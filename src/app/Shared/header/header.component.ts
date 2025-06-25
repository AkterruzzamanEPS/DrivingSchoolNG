import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { CommonHelper } from '../Service/common-helper.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public userName: any = "";
  public searchTxt: any = "";

  constructor(private route: Router, public authService: AuthService) {
    let currentUser = CommonHelper.GetUser();
    this.userName = currentUser?.userName;
  }

  ngOnInit(): void {

  }

  onEnter(event: any) {
    this.route.navigate(['friend'], { queryParams: { searchTxt: this.searchTxt }, });
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(["/"]);
  }

}
