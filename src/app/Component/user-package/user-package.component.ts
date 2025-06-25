import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { UserPackageRequestDto, UserPackageFilterRequestDto } from '../../Model/UserPackage';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { PaymentRequestDto } from '../../Model/Payment';

@Component({
  selector: 'app-user-package',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './user-package.component.html',
  styleUrl: './user-package.component.scss',
  providers: [DatePipe]
})
export class UserPackageComponent implements OnInit, AfterViewInit {

  private userpackageGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public packageList: any[] = [];
  public userList: any[] = [];
  public packageFromList: any[] = [];

  public statusList: any[] = [];

  public oUserPackageRequestDto = new UserPackageRequestDto();
  public oUserPackageFilterRequestDto = new UserPackageFilterRequestDto();

  public oPaymentRequestDto = new PaymentRequestDto();

  public purchaseDate: any = "";
  public expiryDate: any = "";
  public startDate: any = "";
  public endDate: any = "";
  public transactionDate: any = "";

  public userpackageId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'userName', width: 150, headerName: 'User', filter: true },
    { field: 'packageName', width: 150, headerName: 'Package Name', filter: true },
    { field: 'totalLessons', width: 150, headerName: 'Total Lessons', filter: true },
    { field: 'durationInDays', width: 150, headerName: 'Duration In Days', filter: true },
    { field: 'price', width: 150, headerName: 'Fees', filter: true },
    { field: 'remaingAmount', width: 150, headerName: 'Remaing', filter: true },
    { field: 'paymentAmount', width: 150, headerName: 'Payment', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'paymentStatusName', headerName: 'Status' },
    { field: 'Payment', headerName: 'Payment', width: 100, pinned: "right", resizable: true, cellRenderer: this.PaymentDetailToGrid.bind(this) },

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
    private datePipe: DatePipe) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.expiryDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.transactionDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetUserPackage();
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
    this.userpackageGridApi = params.api;
    this.rowData = [];
  }

  PaymentDetailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Payment</button>'
    eDiv.addEventListener('click', () => {
      this.oPaymentRequestDto = new PaymentRequestDto();
      CommonHelper.CommonButtonClick("openPaymentModel");
      this.oPaymentRequestDto.userId = params.data.userId;
      this.oPaymentRequestDto.packageId = params.data.packageId;
      this.oPaymentRequestDto.amount = params.data.remaingAmount;

    });
    return eDiv;
  }

  Filter() {
    this.GetUserPackage();
  }

  private GetUserPackage() {
    this.oUserPackageFilterRequestDto.startDate = new Date(this.startDate);
    this.oUserPackageFilterRequestDto.endDate = new Date(this.endDate);
    this.oUserPackageFilterRequestDto.packageId = Number(this.oUserPackageRequestDto.packageId);
    this.oUserPackageFilterRequestDto.paymentStatus = Number(this.oUserPackageRequestDto.paymentStatus);
    this.oUserPackageFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oUserPackageRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`UserPackage/GetUserPackage?pageNumber=${this.pageIndex}`, this.oUserPackageRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.userpackageGridApi.sizeColumnsToFit();
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


  public InsertUserPackage() {

    if (this.oUserPackageRequestDto.userId == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }

    this.oUserPackageRequestDto.packageId = Number(this.oUserPackageRequestDto.packageId);
    this.oUserPackageRequestDto.paymentStatus = Number(this.oUserPackageRequestDto.paymentStatus);
    this.oUserPackageRequestDto.purchaseDate = new Date(this.purchaseDate);
    this.oUserPackageRequestDto.expiryDate = new Date(this.expiryDate);
    this.oUserPackageRequestDto.isActive = true;
    // After the hash is generated, proceed with the API call
    this.http.Post(`UserPackage/InsertUserPackage`, this.oUserPackageRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetUserPackage();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateUserPackage() {
    this.oUserPackageRequestDto.packageId = Number(this.oUserPackageRequestDto.packageId);
    this.oUserPackageRequestDto.paymentStatus = Number(this.oUserPackageRequestDto.paymentStatus);
    this.oUserPackageRequestDto.purchaseDate = new Date(this.purchaseDate);
    this.oUserPackageRequestDto.expiryDate = new Date(this.expiryDate);
    this.oUserPackageRequestDto.isActive = true;
    // After the hash is generated, proceed with the API call
    this.http.Post(`UserPackage/UpdateUserPackage/${this.userpackageId}`, this.oUserPackageRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetUserPackage();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteUserPackage() {
    this.oUserPackageRequestDto.isActive = CommonHelper.booleanConvert(this.oUserPackageRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`UserPackage/DeleteUserPackage/${this.userpackageId}`, this.oUserPackageRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetUserPackage();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
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

    if (this.oPaymentRequestDto.amount < 0) {
      this.toast.warning("Please enter amount is geather then 0", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oPaymentRequestDto.paymentMethod == "") {
      this.toast.warning("Please enter payment method", "Warning!!", { progressBar: true });
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
        CommonHelper.CommonButtonClick("closePaymentModel");
        this.GetUserPackage();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oUserPackageRequestDto = new UserPackageRequestDto();
    this.userpackageId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.userpackageGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.userpackageId = Number(getSelectedItem.id);
    this.oUserPackageRequestDto.userId = getSelectedItem.userId;
    this.oUserPackageRequestDto.packageId = Number(getSelectedItem.packageId);
    this.oUserPackageRequestDto.paymentStatus = Number(getSelectedItem.paymentStatus);
    this.oUserPackageRequestDto.purchaseDate = new Date(this.purchaseDate);
    this.oUserPackageRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oUserPackageRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.userpackageGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.userpackageId = Number(getSelectedItem.id);
    this.oUserPackageRequestDto.userId = getSelectedItem.userId;
    this.oUserPackageRequestDto.packageId = Number(getSelectedItem.packageId);
    this.oUserPackageRequestDto.isActive = getSelectedItem.isActive;
    this.oUserPackageRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetUserPackage();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetUserPackage();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetUserPackage();
    }
  }


}

