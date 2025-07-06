import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { CommentRequestDto } from '../../Model/Comment';
import { LikeRequestDto } from '../../Model/Like';

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-content.component.html',
  styleUrl: './post-content.component.scss',
  providers: [DatePipe]
})
export class PostContentComponent implements OnInit {


  private authService = inject(AuthService);
  private toast = inject(ToastrService);
  private http = inject(HttpHelperService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);
  trackByFn: TrackByFunction<any> | any;

  public oLikeRequestDto = new LikeRequestDto();
  public oCommentRequestDto = new CommentRequestDto();

  public currentUser = CommonHelper.GetUser();
  public postList: any[] = [];

  ngOnInit(): void {
    this.GetAllPosts();
  }

  private GetAllPosts() {
    this.http.Get(`Post/GetAllPosts/${this.currentUser?.userId}`).subscribe(
      (res: any) => {
        this.postList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public InsertLike(item: any) {
    
    this.oLikeRequestDto.postId = item.id;
    this.oLikeRequestDto.userId = this.currentUser?.userId;
    this.http.Post(`Like/InsertLike/`, this.oLikeRequestDto).subscribe(
      (res: any) => {
        this.oLikeRequestDto = new LikeRequestDto();
        this.GetAllPosts();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public InsertComment(item: any) {
    this.oCommentRequestDto.postId = item.id;
    this.oCommentRequestDto.userId = this.currentUser?.userId;
    this.http.Post(`Comment/InsertComment/`, this.oCommentRequestDto).subscribe(
      (res: any) => {
        this.oCommentRequestDto = new CommentRequestDto();
        this.GetAllPosts();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


  public GetImageUrl(fileId: number): string {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }

}
