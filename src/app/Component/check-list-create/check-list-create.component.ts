import { Component, OnInit, TrackByFunction } from '@angular/core';
import { CheckListRequestDto } from '../../Model/CheckList';
import { AuthService } from '../../Shared/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-list-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-list-create.component.html',
  styleUrl: './check-list-create.component.scss', 
  providers: [DatePipe]
})
export class CheckListCreateComponent  implements OnInit {

  public CheckListList: any[] = [];
  public oCheckListRequestDto = new CheckListRequestDto();
  public CheckListId = 0;

  trackByCheckList: TrackByFunction<any> | any;
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
      this.CheckListId = Number(id);
      if (this.CheckListId > 0) {
        this.GetCheckListById();
      } else {
        this.oCheckListRequestDto = new CheckListRequestDto();
        this.CheckListId = 0;
      }
    }
  }

  
  GetImageUrl(fileId: number): string {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }

   public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          this.oCheckListRequestDto.fileId = res.id;
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }

  Reset() {
    this.oCheckListRequestDto = new CheckListRequestDto();
  }
  BackToList() {
    this.router.navigateByUrl('admin/checklist')
  }

  private GetCheckListById() {
    this.http.Get(`CheckList/GetCheckListById/${this.CheckListId}`).subscribe(
      (res: any) => {
        this.oCheckListRequestDto.name = res.name;
        this.oCheckListRequestDto.isActive = CommonHelper.booleanConvert(res.isActive);
        this.oCheckListRequestDto.remarks = res.remarks;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }



  public InsertCheckList() {
    if (this.oCheckListRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }

    this.oCheckListRequestDto.isActive = CommonHelper.booleanConvert(this.oCheckListRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`CheckList/InsertCheckList`, this.oCheckListRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateCheckList() {

    if (this.oCheckListRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }

    this.oCheckListRequestDto.isActive = CommonHelper.booleanConvert(this.oCheckListRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`CheckList/UpdateCheckList/${this.CheckListId}`, this.oCheckListRequestDto).subscribe(
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

