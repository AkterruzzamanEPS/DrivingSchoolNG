import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { PaymentRequestDto, PaymentFilterRequestDto } from '../../Model/Payment';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { ValueFormatterParams } from 'ag-grid-community';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  providers: [DatePipe]
})
export class PaymentComponent implements OnInit, AfterViewInit {

  private paymentGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public packageFromList: any[] = [];
  
  public statusList: any[] = [];
  public packageList: any[] = [];
  public userList: any[] = [];

  public oPaymentRequestDto = new PaymentRequestDto();
  public oPaymentFilterRequestDto = new PaymentFilterRequestDto();

  public transactionDate: any = "";
  public startDate: any = "";
  public endDate: any = "";

  public paymentId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'receiptNo', width: 150, headerName: 'Receipt No', filter: true },
    { field: 'transactionDate', headerName: 'Transaction Date' ,cellRenderer: (params: ValueFormatterParams) => {
                return this.datePipe.transform(params.value, 'dd MMM yyyy') || '';
              }},
    { field: 'studentIdNo', width: 150, headerName: 'Reg No', filter: true },
    { field: 'userName', width: 150, headerName: 'Name', filter: true },
    { field: 'packageName', width: 150, headerName: 'Package', filter: true },
    { field: 'amount', headerName: 'Amount' },
    
    { field: 'isActive', headerName: 'Status' },
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
    private datePipe: DatePipe) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetPayment();
  }
  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetPayment();
  }

  ngOnInit(): void {
    this.GetAspNetUsersByType();
    this.GetAllPackages();
  }


  private GetAspNetUsersByType() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`AspNetUsers/GetAspNetUsersByType?Type=4`).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  onGridReadyTransection(params: any) {
    this.paymentGridApi = params.api;
    this.rowData = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
  }

  Filter() {
    this.GetPayment();
  }

  private GetPayment() {

    this.oPaymentFilterRequestDto.startDate = new Date(this.startDate);
    this.oPaymentFilterRequestDto.endDate = new Date(this.endDate);
    this.oPaymentFilterRequestDto.packageId = Number(this.oPaymentFilterRequestDto.packageId);
    this.oPaymentFilterRequestDto.status = 1;
    this.oPaymentFilterRequestDto.isActive = true;
    // After the hash is generated, proceed with the API call
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

  private GetAllPackages() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Package/GetAllPackages`).subscribe(
      (res: any) => {
        this.packageList = res;
        this.packageFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public InsertPayment() {

    if (this.oPaymentRequestDto.userId == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }
    this.oPaymentRequestDto.packageId = Number(this.oPaymentRequestDto.packageId);
    this.oPaymentRequestDto.status = Number(1);
    this.oPaymentRequestDto.transactionDate = new Date(this.transactionDate);
    this.oPaymentRequestDto.amount = Number(this.oPaymentRequestDto.amount);
    this.oPaymentRequestDto.isActive = true;
    // After the hash is generated, proceed with the API call
    this.http.Post(`Payment/InsertPayment`, this.oPaymentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetPayment();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdatePayment() {
    this.oPaymentRequestDto.packageId = Number(this.oPaymentRequestDto.packageId);
    this.oPaymentRequestDto.status = Number(this.oPaymentRequestDto.status);
    this.oPaymentRequestDto.transactionDate = new Date(this.transactionDate);
    this.oPaymentRequestDto.isActive = CommonHelper.booleanConvert(this.oPaymentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Payment/UpdatePayment/${this.paymentId}`, this.oPaymentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetPayment();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeletePayment() {
    this.oPaymentRequestDto.isActive = CommonHelper.booleanConvert(this.oPaymentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Payment/DeletePayment/${this.paymentId}`, this.oPaymentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetPayment();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/payment/' + 0)
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.paymentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.paymentId = Number(getSelectedItem.id);
    this.oPaymentRequestDto.userId = getSelectedItem.userId;
    this.oPaymentRequestDto.packageId = Number(getSelectedItem.packageId);
    this.oPaymentRequestDto.status = Number(getSelectedItem.status);
    this.oPaymentRequestDto.paymentMethod = getSelectedItem.paymentMethod;
    this.oPaymentRequestDto.amount = Number(getSelectedItem.amount);
    this.oPaymentRequestDto.transactionDate = new Date(this.transactionDate);
    this.oPaymentRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oPaymentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.paymentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.paymentId = Number(getSelectedItem.id);
    this.oPaymentRequestDto.userId = getSelectedItem.userId;
    this.oPaymentRequestDto.packageId = Number(getSelectedItem.packageId);
    this.oPaymentRequestDto.paymentMethod = getSelectedItem.paymentMethod;
    this.oPaymentRequestDto.amount = Number(getSelectedItem.amount);
    this.oPaymentRequestDto.isActive = getSelectedItem.isActive;
    this.oPaymentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

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

