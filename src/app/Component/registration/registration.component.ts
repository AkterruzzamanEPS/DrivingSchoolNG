import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AspNetUsersRequestDto } from '../../Model/AspNetUsers';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [DatePipe]
})
export class RegistrationComponent {
  public oAspNetUsersRequestDto = new AspNetUsersRequestDto();
  currentRole: any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
    this.currentRole = authService.GetCurrentUserRole();
  }

  Registration() {

    this.oAspNetUsersRequestDto.fullName = this.oAspNetUsersRequestDto.firstName + " " + this.oAspNetUsersRequestDto.lastName
    if (this.oAspNetUsersRequestDto.fullName == "") {
      this.toast.warning("Please enter fullName", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.email == "") {
      this.toast.warning("Please enter email", "Warning!!", { progressBar: true });
      return;
    }
    if (!CommonHelper.IsValidEmail(this.oAspNetUsersRequestDto.email)) {
      this.toast.warning("Please enter valid email.", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.phoneNumber == "") {
      this.toast.warning("Please enter phone number", "Warning!!", { progressBar: true });
      return;
    }
    if (!CommonHelper.isValidNumber(this.oAspNetUsersRequestDto.phoneNumber)) {
      this.toast.warning("Number must be exactly 11 digits.", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.password == "") {
      this.toast.warning("Please enter password", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.confirmPassword == "") {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }

    let currentUser = CommonHelper.GetUser();

    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/InsertAspNetUsers`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.oAspNetUsersRequestDto = new AspNetUsersRequestDto();

      },
      (err) => {
        debugger
        this.toast.error(err.error.message, "Error!!", { progressBar: true });
      }
    );
  }
}
