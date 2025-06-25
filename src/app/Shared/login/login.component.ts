import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { CommonHelper } from '../Service/common-helper.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../Service/http-helper.service';
import { LoginRequestDto } from '../../Model/LoginRequestDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Service/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ToastrService, HttpHelperService]
})
export class LoginComponent implements OnInit, AfterViewChecked {

  public bodyHeight = 700;

  public oLoginRequestDto = new LoginRequestDto();
  constructor(
    private toast: ToastrService,
    private auth: AuthService,
    private http: HttpHelperService,
    private route: Router
  ) {

  }

  ngAfterViewChecked(): void {
  }

  ngOnInit(): void {
    if(this.auth.isLogin()){
       this.route.navigateByUrl('admin/dashboard')
    }
    let currentUser = CommonHelper.GetUser();

  }

  public Login() {

    if (this.oLoginRequestDto.UserName == "") {
      this.toast.warning("Enter your user name!!", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oLoginRequestDto.Password == "") {
      this.toast.warning("Enter your password!!", "Warning!!", { progressBar: true });
      return;
    }

    const payload = {
      userName: this.oLoginRequestDto.UserName,
      password: this.oLoginRequestDto.Password,
    }
    this.http.Login("Auth/Login", payload).subscribe(
      (res: any) => {
        console.log(res);
        if (res.data != null) {
          this.toast.success("Login Successfully!!", "Success!!", { progressBar: true });
          localStorage.setItem("Token", res.data.jwtToken)
          localStorage.setItem("UserResponseDto", JSON.stringify(res.data))
          this.route.navigateByUrl("/admin/dashboard");
        } else {
          this.toast.error(res?.message, "Error!!", { progressBar: true });
        }
      },
      (err) => {

        console.log(err)
        this.toast.error(err.error.message, "Error!!", { progressBar: true });
      });

  }

  public async RefreshToken() {
    let currentUser = CommonHelper.GetUser();
    const payload =
    {
      userId: currentUser?.userId,
      refreshToken: currentUser?.refreshToken
    }
    this.http.Login("Auth/RefreshToken", payload).subscribe(
      (res: any) => {
        if (res.data != null) {
          localStorage.setItem("Token", res.data.jwtToken)
          localStorage.setItem("UserResponseDto", JSON.stringify(res.data))
          this.route.navigateByUrl("/dashboard");
        } else {
          localStorage.clear();
          this.route.navigate(["/"]);
        }
      },
      (err) => {
        console.log(err)
      });

  }


}

