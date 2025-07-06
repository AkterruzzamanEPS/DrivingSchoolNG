import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ExpenditureFilterRequestDto, ExpenditureRequestDto } from '../../Model/Expenditure';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { PdfService } from '../../Shared/Service/pdf.service';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-expenditure',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './expenditure.component.html',
  styleUrl: './expenditure.component.scss',
  providers: [DatePipe]
})
export class ExpenditureComponent implements OnInit {

  private ExpenditureGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public ExpenditureList: any[] = [];
  public oExpenditureFilterRequestDto = new ExpenditureFilterRequestDto();
  public oExpenditureRequestDto = new ExpenditureRequestDto();

  public result: any[][] = [];

  public startDate: any;
  public endDate: any;
  public ExpenditureId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    {
      field: 'createdDate', width: 150, headerName: 'Date', filter: true,
      valueGetter: (params: any) => this.datePipe.transform(params.data.createdDate, 'MMM d, y')
    },
    { field: 'name', width: 150, headerName: 'Expenditure', filter: true },
    { field: 'expenditureHeadName', width: 150, headerName: 'Head', filter: true },
    { field: 'amount', width: 150, headerName: 'Amount', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
    { field: '', headerName: 'Atachment', width: 100, cellRenderer: this.attachmentToGrid.bind(this) },
    { field: '', headerName: '', width: 80, pinned: "right", resizable: true, cellRenderer: this.editToGrid.bind(this) },
    { field: '', headerName: '', width: 80, pinned: "right", resizable: true, cellRenderer: this.deleteToGrid.bind(this) },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByExpenditure: TrackByFunction<any> | any;
  trackByExpenditureFrom: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef,// <-- Inject here
    private datePipe: DatePipe) {
    const today = new Date();
    this.startDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
  }


  ngOnInit(): void {
    this.GetExpenditure();
  }

  onGridReadyTransection(params: any) {
    this.ExpenditureGridApi = params.api;
    this.rowData = [];
  }

  onBtnExport() {
    this.ExpenditureGridApi.exportDataAsCsv();
  }


  editToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-pencil-square"></i> Edit</button>'
    eDiv.addEventListener('click', () => {
      
      this.router.navigateByUrl('/admin/expenditure/' + params.data.id)
    });
    return eDiv;
  }

  attachmentToGrid(params: any) {
    const eDiv = document.createElement('div');
    if (params.data.fileId > 0) {
      eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye"></i></button>'
      eDiv.addEventListener('click', async () => {
        
        const url = await this.GetImageUrl(params.data.fileId);
        window.open(url, '_blank');
      });
    }
    return eDiv;
  }

  
  async GetImageUrl(fileId: number): Promise<string> {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }

  deleteToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = '<button class="btn btn-danger p-0 px-1"> <i class="bi bi-trash"></i> Delete</button>'
    eDiv.addEventListener('click', () => {
      this.ExpenditureId = Number(params.data.id);
      this.cdr.detectChanges(); // 👈 Force change detection
      CommonHelper.CommonButtonClick("openCommonDelete");
    });
    return eDiv;
  }

  Filter() {
    this.GetExpenditure();
  }
  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetExpenditure();
  }
  private GetExpenditure() {
    this.oExpenditureFilterRequestDto.startDate = new Date(this.startDate);
    this.oExpenditureFilterRequestDto.endDate = new Date(this.endDate);
    this.oExpenditureFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Expenditure/GetExpenditure?pageNumber=${this.pageIndex}`, this.oExpenditureFilterRequestDto).subscribe(
      (res: any) => {
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.ExpenditureGridApi.sizeColumnsToFit();
        this.ColumnDefinationSetUp(res.items);
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteExpenditure() {
    this.oExpenditureRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Expenditure/DeleteExpenditure/${this.ExpenditureId}`, this.oExpenditureRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetExpenditure();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/expenditure/' + 0)
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.ExpenditureGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.ExpenditureId = Number(getSelectedItem.id);
    this.oExpenditureRequestDto.name = getSelectedItem.name;
    this.oExpenditureRequestDto.isActive = getSelectedItem.isActive;
    this.oExpenditureRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetExpenditure();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetExpenditure();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetExpenditure();
    }
  }


  private ColumnDefinationSetUp(res: any[]) {
    this.result = [];
    let amount = 0;

    if (res.length > 0) {
      res.forEach((item: any, index: number) => {

        amount += Number(item.amount);
        const row: any[] = [
          { text: index + 1, style: 'tableTextCenter' },
          { text: this.datePipe.transform(item.createdDate, 'dd/MM/yyyy'), style: 'tableTextLeft' },
          { text: item.name, style: 'tableTextLeft' },
          { text: item.expenditureHeadName, style: 'tableTextLeft' },
          { text: item.amount.toFixed(2), style: 'tableTextRight' },
          { text: item.remarks, style: 'tableTextRight' }
        ];
        this.result.push(row);
      });

      // Header Row with Merged Columns for "Recharge History"
      this.result.unshift([
        { text: 'Serial No', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Date', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Name', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Head Name', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Amount', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Remarks ', style: 'tableColumnHeader', alignment: 'center' },
      ]);

      // Add footer row for totals
      this.result.push([
        { text: 'Total', style: 'tableColumnHeader', colSpan: 4, alignment: 'right' },  {}, {}, {},
        { text: amount.toFixed(2), style: 'tableTextRight', alignment: 'right' },
        { text: '', style: 'tableTextRight', alignment: 'right' }
      ]);

    }


  }

  PDFGenerate() {
    
    console.log(this.result);
    let title = "Expenditure Head Summary";
    const documentDefinition = {
      pageMargins: [20, 70, 20, 30], // [left, top, right, bottom]

      content: [
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: [45, 45, '*', 50, 50, 50],
            body: this.result,
          },
        },
        { text: '\n' },
      ],

      styles: {
        mainHeader: { fontSize: 14, bold: true, alignment: 'center' },
        subHeader: { fontSize: 11, bold: true, margin: [0, 5, 0, 5] },
        bodyText: { fontSize: 10, margin: [0, 1, 0, 1] },
        tableColumnHeader: { bold: true, alignment: 'center', fontSize: 9 },
        tableTextLeft: { alignment: 'left', fontSize: 8 },
        tableTextCenter: { alignment: 'center', fontSize: 8 },
        tableTextRight: { alignment: 'right', fontSize: 8 },
        tableHeader: { bold: true, fillColor: '#e7e7e7', alignment: 'center', fontSize: 9 },
      },

      header: {
        columns: [
          {
            stack: [
              { text: title, style: { fontSize: 12, bold: true, alignment: 'center' } },
              { text: '\nOnline Expenditure History\n', style: { fontSize: 10, bold: true, alignment: 'center' } },
              { text: `From ${this.datePipe.transform(new Date(), 'MMMM d, y')} To ${this.datePipe.transform(new Date(), 'MMMM d, y')}`, style: { fontSize: 9, bold: true, alignment: 'center' } },

            ],
            alignment: 'center',
            margin: [0, 20, 0, 10],
          }
        ],
        canvas: [
          {
            type: 'line',
            x1: 10,
            y1: 10,
            x2: 580,
            y2: 10,
            lineWidth: 1,
            lineColor: 'black',
          },
        ],
      },

      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Software developed by: FawTime.`,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        };
      }
    };

    // Generate PDF using pdfMake
    this.pdfService.generatePdf(documentDefinition);
  }

}

