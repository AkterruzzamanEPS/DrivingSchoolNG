import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentRequestDto } from '../../Model/Payment';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-create.component.html',
  styleUrl: './payment-create.component.scss',
  providers: [DatePipe]
})
export class PaymentCreateComponent implements OnInit {

  public packageList: any[] = [];
  public userList: any[] = [];
  public oPaymentRequestDto = new PaymentRequestDto();
  public PaymentId = 0;

  trackByPayment: TrackByFunction<any> | any;
  trackByPackage: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {

  }


  ngOnInit(): void {
    this.GetAspNetUsersByType();
    this.GetAllPackages();
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.PaymentId = Number(id);
      if (this.PaymentId > 0) {
        this.GetPaymentById();
      } else {
        this.oPaymentRequestDto = new PaymentRequestDto();
        this.PaymentId = 0;
      }
    }
  }

  Reset() {
    this.oPaymentRequestDto = new PaymentRequestDto();
  }
  BackToList() {
    this.router.navigateByUrl('admin/payment')
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

  private GetAllPackages() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Package/GetAllPackages`).subscribe(
      (res: any) => {
        this.packageList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetPaymentById() {
    this.http.Get(`Payment/GetPaymentById/${this.PaymentId}`).subscribe(
      (res: any) => {
        this.oPaymentRequestDto.amount = res.amount;
        this.oPaymentRequestDto.packageId = Number(res.packageId);
        this.oPaymentRequestDto.userId = res.userId;
        this.oPaymentRequestDto.isActive = CommonHelper.booleanConvert(res.isActive);
        this.oPaymentRequestDto.remarks = res.remarks;
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
    this.oPaymentRequestDto.transactionDate = new Date();
    this.oPaymentRequestDto.amount = Number(this.oPaymentRequestDto.amount);
    this.oPaymentRequestDto.isActive = true;
    // After the hash is generated, proceed with the API call
    this.http.Post(`Payment/InsertPayment`, this.oPaymentRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdatePayment() {

    if (this.oPaymentRequestDto.userId == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }
    this.oPaymentRequestDto.packageId = Number(this.oPaymentRequestDto.packageId);
    this.oPaymentRequestDto.status = Number(1);
    this.oPaymentRequestDto.transactionDate = new Date();
    this.oPaymentRequestDto.amount = Number(this.oPaymentRequestDto.amount);
    this.oPaymentRequestDto.isActive = true;
    // After the hash is generated, proceed with the API call
    this.http.Post(`Payment/UpdatePayment/${this.PaymentId}`, this.oPaymentRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


}
