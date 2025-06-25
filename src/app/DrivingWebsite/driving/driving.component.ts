import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { RegistrationComponent } from "../../Component/registration/registration.component";

@Component({
  selector: 'app-driving',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RegistrationComponent],
  templateUrl: './driving.component.html',
  styleUrl: './driving.component.scss',
  providers: [DatePipe]
})
export class DrivingComponent implements OnInit {

  public oPostCategoryList: any[] = [];
  public oPostSubCategoryList: any[] = [];
  public trackByFnCategory: TrackByFunction<any> | any;
  public trackByFnSubCategory: TrackByFunction<any> | any;

  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.GetPostsByParent();
    this.GetPostsByCategory();
  }


  private GetPostsByParent() {
    this.http.Get(`Post/GetPostsByParent`).subscribe(
      (res: any) => {
        console.log(res);
        this.oPostSubCategoryList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetPostsByCategory() {
    this.http.Get(`Post/GetPostsByCategory`).subscribe(
      (res: any) => {
        console.log(res);
        this.oPostCategoryList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  GetImageUrl(fileId: number): string {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }

}
