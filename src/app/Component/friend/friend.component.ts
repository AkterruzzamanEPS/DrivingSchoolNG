import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { FriendRequestRequestDto } from '../../Model/FriendRequest';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { UserResponseDto } from '../../Model/UserResponseDto';
import { AspNetUsersFilterRequestDto } from '../../Model/AspNetUsers';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.scss',
  providers: [DatePipe]
})
export class FriendComponent implements OnInit {

  public currentUser: UserResponseDto | any;

  public userList: any[] = [];
  public oFriendRequestRequestDto = new FriendRequestRequestDto();
  public oAspNetUsersFilterRequestDto = new AspNetUsersFilterRequestDto();

  public searchTxt: any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) {
    this.currentUser = CommonHelper.GetUser();
  }

  ngOnInit(): void {
    debugger
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.searchTxt) {
        this.searchTxt = params.searchTxt;
        this.GetAllUsers(); // <-- move this inside so it triggers *after* updating searchTxt
      } else {
        this.GetAllUsers(); // also call if no searchTxt
      }
    });

  }

  private GetAllUsers() {

    debugger
    this.oAspNetUsersFilterRequestDto.name = this.searchTxt;
    this.http.Post(`AspNetUsers/GetAllUsers`, this.oAspNetUsersFilterRequestDto).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        debugger
        this.toast.error(err.error.message, "Error!!", { progressBar: true });
      }
    );

  }

  onEnter(event: any): void {
    this.router.navigate([], {   // stay on same page, only update query params
      relativeTo: this.activatedRoute,
      queryParams: { searchTxt: this.searchTxt },
      queryParamsHandling: 'merge', // merge with existing params if needed
    });
  }
  public InsertFriendRequest(user: any) {

    this.oFriendRequestRequestDto.fromUserId = this.currentUser.userId;
    this.oFriendRequestRequestDto.toUserId = user.id;
    this.http.Post(`FriendRequest/InsertFriendRequest`, this.oFriendRequestRequestDto).subscribe(
      (res: any) => {
        debugger
        this.GetAllUsers();
      },
      (err) => {
        debugger
        this.toast.error(err.error.message, "Error!!", { progressBar: true });
      }
    );

  }

}
