import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PackageRequestDto } from '../../Model/Package';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-package-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './package-create.component.html',
  styleUrl: './package-create.component.scss',
  providers: [DatePipe]
})
export class PackageCreateComponent implements OnInit {

  public oPackageRequestDto = new PackageRequestDto();
  public PackageId = 0;

  trackByPackage: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {

  }


  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.PackageId = Number(id);
      if (this.PackageId > 0) {
        this.GetPackageById();
      } else {
        this.oPackageRequestDto = new PackageRequestDto();
        this.PackageId = 0;
      }
    }
  }

  Reset() {
    this.oPackageRequestDto = new PackageRequestDto();
  }
  BackToList() {
    this.router.navigateByUrl('admin/package')
  }

  private GetPackageById() {
    this.http.Get(`Package/GetPackageById/${this.PackageId}`).subscribe(
      (res: any) => {
        this.oPackageRequestDto.name = res.name;
        this.oPackageRequestDto.totalLessons = Number(res.totalLessons);
        this.oPackageRequestDto.price = Number(res.price);
        this.oPackageRequestDto.isActive = true;
        this.oPackageRequestDto.remarks = res.remarks;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }



  public InsertPackage() {
    if (this.oPackageRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }

    this.oPackageRequestDto.totalLessons = Number(this.oPackageRequestDto.totalLessons);
    this.oPackageRequestDto.price = Number(this.oPackageRequestDto.price);
    this.oPackageRequestDto.isActive = CommonHelper.booleanConvert(this.oPackageRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Package/InsertPackage`, this.oPackageRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdatePackage() {

    if (this.oPackageRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oPackageRequestDto.totalLessons = Number(this.oPackageRequestDto.totalLessons);
    this.oPackageRequestDto.price = Number(this.oPackageRequestDto.price);
    this.oPackageRequestDto.isActive = CommonHelper.booleanConvert(this.oPackageRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Package/UpdatePackage/${this.PackageId}`, this.oPackageRequestDto).subscribe(
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

