import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { RegistrationRequestDto } from '../../Model/AdminRegistration';

@Component({
  selector: 'app-admin-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-registration.component.html',
  styleUrl: './admin-registration.component.scss',
  providers: [DatePipe]
})
export class AdminRegistrationComponent implements OnInit {
  public oRegistrationRequestDto = new RegistrationRequestDto();
  currentRole: any;
  public packageList: any[] = [];

  public trackByPackage: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
    this.currentRole = authService.GetCurrentUserRole();
  }
  ngOnInit(): void {
    this.GetAllPackages();

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

  BackToList() {
    this.router.navigateByUrl('admin/student')
  }

  PackageChange() {
    debugger
    if (this.oRegistrationRequestDto.packageId > 0) {
      const selectedPackage = this.packageList.find(pkg => pkg.id === parseInt(this.oRegistrationRequestDto.packageId.toString()));  
      console.log(selectedPackage);
      this.oRegistrationRequestDto.amount = selectedPackage.price;
      this.oRegistrationRequestDto.discount = 0;
      this.oRegistrationRequestDto.netAmount = parseFloat(this.oRegistrationRequestDto.amount.toString()) - parseFloat(this.oRegistrationRequestDto.discount.toString());
      this.oRegistrationRequestDto.nooflesson = selectedPackage.totalLessons;
      this.oRegistrationRequestDto.lessonRate = selectedPackage.rate;
    }
  }

  LessonRateChange() {
    this.oRegistrationRequestDto.amount = this.oRegistrationRequestDto.nooflesson * this.oRegistrationRequestDto.lessonRate;
    this.DisCountChange();
  }

  DisCountChange(){
    this.oRegistrationRequestDto.netAmount = this.oRegistrationRequestDto.amount -this.oRegistrationRequestDto.discount;
  }

  Registration() {
    this.oRegistrationRequestDto.fullName = this.oRegistrationRequestDto.fullName;
    if (this.oRegistrationRequestDto.fullName == "") {
      this.toast.warning("Please enter fullName", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oRegistrationRequestDto.packageId == 0) {
      this.toast.warning("Please select package", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oRegistrationRequestDto.email == "") {
      this.toast.warning("Please enter email", "Warning!!", { progressBar: true });
      return;
    }
    if (!CommonHelper.IsValidEmail(this.oRegistrationRequestDto.email)) {
      this.toast.warning("Please enter valid email.", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oRegistrationRequestDto.phoneNumber == "") {
      this.toast.warning("Please enter phone number", "Warning!!", { progressBar: true });
      return;
    }
    if (!CommonHelper.isValidNumber(this.oRegistrationRequestDto.phoneNumber)) {
      this.toast.warning("Number must be exactly 11 digits.", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oRegistrationRequestDto.nooflesson == 0) {
      this.toast.warning("Please enter no of lesson", "Warning!!", { progressBar: true });
      return;
    }
     if (this.oRegistrationRequestDto.lessonRate == 0) {
      this.toast.warning("Please enter lesson per rate", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oRegistrationRequestDto.amount == 0) {
      this.toast.warning("Please enter amount", "Warning!!", { progressBar: true });
      return;
    }

    this.oRegistrationRequestDto.userName = this.oRegistrationRequestDto.email;
    this.oRegistrationRequestDto.password = '123456';
    this.oRegistrationRequestDto.confirmPassword = '123456';
    this.oRegistrationRequestDto.vehicleType = Number(1);
    this.oRegistrationRequestDto.isFixed = CommonHelper.booleanConvert(this.oRegistrationRequestDto.isFixed);
    this.oRegistrationRequestDto.amount = Number(this.oRegistrationRequestDto.amount);
    this.oRegistrationRequestDto.discount = Number(this.oRegistrationRequestDto.discount);
    this.oRegistrationRequestDto.fileId = Number(this.oRegistrationRequestDto.fileId);
    this.oRegistrationRequestDto.type = Number(4);
    let currentUser = CommonHelper.GetUser();

    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/Registration`, this.oRegistrationRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.oRegistrationRequestDto = new RegistrationRequestDto();

      },
      (err) => {
        debugger
        this.toast.error(err.error.message, "Error!!", { progressBar: true });
      }
    );
  }
}
