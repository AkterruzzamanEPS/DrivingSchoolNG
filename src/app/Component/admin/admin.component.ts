import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, AfterViewInit {

  public auth = inject(AuthService);
  dashboardOpen = false;
  studentOpen = false;
  adminOpen = false;
  settingOpen = false;
  userMgmtOpen = false;
  bookingOpen = false;
  schedulingOpen = false;
  paymentOpen = false;

  public userName: any = "";
  public searchTxt: any = "";

  constructor(private route: Router, public authService: AuthService) {
    let currentUser = CommonHelper.GetUser();
    this.userName = currentUser?.userName;
  }


  ngOnInit(): void {

  }

  // In app.component.ts or your sidebar component
  ngAfterViewInit(): void {
    const AdminLTE = (window as any).AdminLTE;
    if (AdminLTE?.Treeview?.autoInitialize) {
      AdminLTE.Treeview.autoInitialize();
    }
  }

   logOut() {
    localStorage.clear();
    this.route.navigate(["/"]);
  }
  
  toggleSidebar(event: Event) {
    event.preventDefault();
    // AdminLTE 4 exposes this globally
    if ((window as any).AdminLTE?.Layout) {
      (window as any).AdminLTE.Layout.toggleMenuSidebar();
    }
  }

  toggleDashboard(event: Event) {
    event.preventDefault();
    this.dashboardOpen = !this.dashboardOpen;
  }
  toggleStudent(event: Event) {
    event.preventDefault();
    this.studentOpen = !this.studentOpen;
  }

  toggleAdmin(event: Event) {
    event.preventDefault();
    this.adminOpen = !this.adminOpen;
  }
  toggleSetting(event: Event) {
    event.preventDefault();
    this.settingOpen = !this.settingOpen;
  }

  toggleUserMgmt(event: Event) {
    event.preventDefault();
    this.userMgmtOpen = !this.userMgmtOpen;
  }

  toggleBooking(event: Event) {
    event.preventDefault();
    this.bookingOpen = !this.bookingOpen;
  }

  toggleScheduling(event: Event) {
    event.preventDefault();
    this.schedulingOpen = !this.schedulingOpen;
  }

  togglePayment(event: Event) {
    event.preventDefault();
    this.paymentOpen = !this.paymentOpen;
  }

}
