import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { UserPackageFilterRequestDto } from '../../Model/UserPackage';
import { AuthService } from '../../Shared/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { PdfService } from '../../Shared/Service/pdf.service';

@Component({
  selector: 'app-due-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './due-list.component.html',
  styleUrl: './due-list.component.scss',
  providers: [DatePipe]
})
export class DueListComponent implements OnInit, AfterViewInit {

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
    { field: 'StudentIdNo', width: 150, headerName: 'IdNo', filter: true },
    { field: 'UserName', width: 150, headerName: 'Name', filter: true },
    { field: 'PackageName', width: 150, headerName: 'Package Name', filter: true },
    { field: 'TotalLessons', width: 150, headerName: 'Total Lessons', filter: true },
    { field: 'Price', width: 150, headerName: 'Amount', filter: true },
    { field: 'PaymentAmount', width: 150, headerName: 'Paid Amount', filter: true },
    { field: 'RemaingAmount', width: 150, headerName: 'Due Amount', filter: true },
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
    this.http.Post(`UserPackage/GetUserPackageDueList`, this.oUserPackageFilterRequestDto).subscribe(
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
    let TotalLessons = 0;
    let Price = 0;
    let PaymentAmount = 0;
    let RemaingAmount = 0;

    if (res.length > 0) {
      res.forEach((item: any, index: number) => {

        TotalLessons += Number(item.TotalLessons);
        Price += Number(item.Price);
        PaymentAmount += Number(item.PaymentAmount);
        RemaingAmount += Number(item.RemaingAmount);
        const row: any[] = [
          { text: index + 1, style: 'tableTextCenter' },
          { text: item.StudentIdNo, style: 'tableTextLeft' },
          { text: item.UserName, style: 'tableTextLeft' },
          { text: item.PackageName, style: 'tableTextLeft' },
          { text: item.TotalLessons.toFixed(2), style: 'tableTextRight' },
          { text: item.Price, style: 'tableTextRight' },
          { text: item.PaymentAmount, style: 'tableTextRight' },
          { text: item.RemaingAmount, style: 'tableTextRight' },
        ];
        this.result.push(row);
      });

      // Header Row with Merged Columns for "Recharge History"
      this.result.unshift([
        { text: 'SL No', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'ID No', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Name', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Package Name', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Total Lessons', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Amount ', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Payment Amount ', style: 'tableColumnHeader', alignment: 'center' },
        { text: 'Due Amount', style: 'tableColumnHeader', alignment: 'center' },
      ]);

      // Add footer row for totals
      this.result.push([
        { text: 'Total', style: 'tableColumnHeader', colSpan: 4, alignment: 'right' }, {}, {},{},
        { text: TotalLessons.toFixed(2), style: 'tableTextRight', alignment: 'right' },
        { text: Price.toFixed(2), style: 'tableTextRight', alignment: 'right' },
        { text: PaymentAmount.toFixed(2), style: 'tableTextRight', alignment: 'right' },
        { text: RemaingAmount.toFixed(2), style: 'tableTextRight', alignment: 'right' },
      ]);

    }


  }



  PDFGenerate() {

    let title = "Du Summary";
    const documentDefinition = {
      pageMargins: [20, 70, 20, 30], // [left, top, right, bottom]

      content: [
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: [45, 45, '*', 50, 50, 50, 50, 45],
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
              { text: '\nDue List\n', style: { fontSize: 10, bold: true, alignment: 'center' } },
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

