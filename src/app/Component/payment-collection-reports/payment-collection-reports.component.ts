import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { PaymentFilterRequestDto } from '../../Model/Payment';
import { AuthService } from '../../Shared/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { Router } from '@angular/router';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { ValueFormatterParams } from 'ag-grid-community';

@Component({
  selector: 'app-payment-collection-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './payment-collection-reports.component.html',
  providers: [DatePipe], // ✅ Add this line
  styleUrl: './payment-collection-reports.component.scss'
})
export class PaymentCollectionReportsComponent implements OnInit, AfterViewInit {

  private paymentGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public oPaymentFilterRequestDto = new PaymentFilterRequestDto();

  public transactionDate: any = "";
  public startDate: any = "";
  public endDate: any = "";
  public username: any = "";

  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'userName', width: 150, headerName: 'Name', filter: true },
    { field: 'packageName', width: 150, headerName: 'Package', filter: true },
    {
      field: 'transactionDate', cellRenderer: (params: ValueFormatterParams) => {
        return this.datePipe.transform(params.value, 'dd MMM yyyy') || '';
      }, headerName: 'Payment Date'
    },
    { field: 'amount', headerName: 'Amount' },

  ];
  trackByFn: TrackByFunction<any> | any;
  trackByPackage: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByPackageFrom: TrackByFunction<any> | any;
  trackByStatus: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.startDate = this.datePipe.transform(firstDayOfMonth, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {

  }


  ngOnInit(): void {
    this.GetPayment();
  }

  onGridReadyTransection(params: any) {
    this.paymentGridApi = params.api;
    this.rowData = [];
  }

  Filter() {
    this.GetPayment();
  }

  private GetPayment() {
    this.oPaymentFilterRequestDto.startDate = new Date(this.startDate);
    this.oPaymentFilterRequestDto.endDate = new Date(this.endDate);
    this.oPaymentFilterRequestDto.name = this.username;
    this.http.Post(`Payment/GetPayment?pageNumber=${this.pageIndex}`, this.oPaymentFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res); 
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.paymentGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetPayment();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetPayment();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetPayment();
    }
  }


}

