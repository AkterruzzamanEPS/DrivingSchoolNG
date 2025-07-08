import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { UserPackageFilterRequestDto } from '../../Model/UserPackage';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { PdfService } from '../../Shared/Service/pdf.service';
import { ValueFormatterParams } from 'ag-grid-community';

@Component({
  selector: 'app-profit-and-loss-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './profit-and-loss-detail.component.html',
  styleUrl: './profit-and-loss-detail.component.scss',
  providers: [DatePipe]
})
export class ProfitAndLossDetailComponent implements OnInit, AfterViewInit {

  private userpackageGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oUserPackageFilterRequestDto = new UserPackageFilterRequestDto();
  public username: string = "";
  // pagination setup
  public startDate: any = "";
  public endDate: any = "";
  public result: any[][] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    {
      field: 'Date', width: 150, headerName: 'Date ', filter: true,
      cellRenderer: (params: ValueFormatterParams) => {
        return this.datePipe.transform(params.value, 'dd MMM yyyy') || '';
      }
    },
    { field: 'Type', width: 150, headerName: 'Type ', filter: true },
    { field: 'Description', width: 150, headerName: 'Description ', filter: true },
    { field: 'Amount', width: 150, headerName: 'Amount', filter: true },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByPackage: TrackByFunction<any> | any;
  trackByPackageFrom: TrackByFunction<any> | any;
  trackByStatus: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private pdfService: PdfService,
    private datePipe: DatePipe) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.startDate = this.datePipe.transform(firstDayOfMonth, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    // this.GetUserPackage();
  }


  ngOnInit(): void {
    this.GetUserPackage();
  }


  onGridReadyTransection(params: any) {
    this.userpackageGridApi = params.api;
    this.rowData = [];
  }


  Filter() {
    this.GetUserPackage();
  }

  private GetUserPackage() {
    this.oUserPackageFilterRequestDto.startDate = new Date(this.startDate);
    this.oUserPackageFilterRequestDto.endDate = new Date(this.endDate);
    // After the hash is generated, proceed with the API call
    this.http.Post(`UserPackage/GetProfitAndLossDetail`, this.oUserPackageFilterRequestDto).subscribe(
      (res: any) => {
        this.rowData = res;
        this.userpackageGridApi.sizeColumnsToFit();
        this.ColumnDefinationSetUp(res);
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  onBtnExport() {
    this.userpackageGridApi.exportDataAsCsv();
  }


  private ColumnDefinationSetUp(res: any[]) {
    this.result = [];

    let TotalIncome = 0;
    let TotalExpense = 0;
    let ProfitOrLoss = 0;

    if (res.length > 0) {
      res.forEach((item: any, index: number) => {

        TotalIncome += Number(item.TotalIncome);
        TotalExpense += Number(item.TotalExpense);
        ProfitOrLoss += Number(item.ProfitOrLoss);
        const row: any[] = [
          { text: index + 1, style: 'tableTextCenter' },
          { text: this.datePipe.transform(item.Date, 'dd/MM/yyyy'), style: 'tableTextLeft' },
          { text: item.Type, style: 'tableTextRight' },
          { text: item.Description, style: 'tableTextRight' },
          { text: item.Amount.toFixed(2), style: 'tableTextRight' },
        ];
        this.result.push(row);
      });

      // Header Row with Merged Columns for "Recharge History"
      this.result.unshift([
        { text: 'SL No', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Date ', style: 'tableColumnHeader', alignment: 'left' },
        { text: 'Type ', style: 'tableColumnHeader', alignment: 'left' },
        { text: 'Description', style: 'tableColumnHeader', alignment: 'left' },
        { text: 'Amount', style: 'tableColumnHeader', alignment: 'center' }
      ]);

      // Add footer row for totals
      this.result.push([
        { text: 'Total', style: 'tableColumnHeader', colSpan: 2, alignment: 'right' },
        {},
        {},
        {},
        { text: ProfitOrLoss.toFixed(2), style: 'tableTextRight', alignment: 'right' },
      ]);

    }


  }



  PDFGenerate() {

    let title = "Profit And Loss Summary";
    const documentDefinition = {
      pageMargins: [20, 70, 20, 30], // [left, top, right, bottom]

      content: [
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: [45, 45, '*', '*', '*'],
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
              { text: '\nProfit And Loss List\n', style: { fontSize: 10, bold: true, alignment: 'center' } },
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
          text: ``,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        };
      }
    };

    // Generate PDF using pdfMake
    this.pdfService.generatePdf(documentDefinition);
  }



}


