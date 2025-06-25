import { Component, inject, OnInit } from '@angular/core';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { PostRequestDto } from '../../Model/Post';
import { AuthService } from '../../Shared/Service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [DatePipe]
})
export class PostComponent implements OnInit {

  private authService = inject(AuthService);
  private toast = inject(ToastrService);
  private http = inject(HttpHelperService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);

  public currentUser = CommonHelper.GetUser();
  public oPostRequestDto = new PostRequestDto();
  public selectedFile: File | undefined

  ngOnInit(): void {

  }


  public InputPostClick() {
    CommonHelper.CommonButtonClick("openCommonModel")
  }

  public CreatePost() {
    if (this.oPostRequestDto.content == "") {
      this.toast.warning("Please enter you content", "Warning!!", { progressBar: true });
      return;
    }
    this.oPostRequestDto.categoryId = Number(this.oPostRequestDto.categoryId);
    this.oPostRequestDto.parentId = Number(this.oPostRequestDto.parentId);
    this.http.Post(`Post/InsertPost`, this.oPostRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.toast.success("Content Post Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  GetImageUrl(fileId: number): string {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }

  FileUploaded() {
    CommonHelper.CommonButtonClick("fileUpload");
  }
  public onImageFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (this.selectedFile == undefined) {
        this.toast.warning("Please select you file", "Warning!!", { progressBar: true });
        return;
      }
      this.http.UploadFile(`UploadedFile/Upload`, this.selectedFile).subscribe(
        (res: any) => {
          this.oPostRequestDto.fileId = res.id;
        },
        (err) => {
          this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
        }
      );
    }

  }

}
