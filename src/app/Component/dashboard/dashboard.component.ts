import { Component, inject } from '@angular/core';
import { PostComponent } from "../post/post.component";
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { FormsModule } from '@angular/forms';
import { PostContentComponent } from "../post-content/post-content.component";
import { LeftsideBarComponent } from "../leftside-bar/leftside-bar.component";
import { RightsideBarComponent } from "../rightside-bar/rightside-bar.component";
import { VideoCallComponent } from "../video-call/video-call.component";
import { CalenderComponent } from "../calender/calender.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PostComponent, PostContentComponent, LeftsideBarComponent, RightsideBarComponent, CalenderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers:[DatePipe]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastrService);
  private http = inject(HttpHelperService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);

  public currentUser = CommonHelper.GetUser();

}

