import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './Shared/footer/footer.component';
import { HeaderComponent } from './Shared/header/header.component';
import { CommonHelper } from './Shared/Service/common-helper.service';
import { HttpHelperService } from './Shared/Service/http-helper.service';
import { NotificationService } from './Shared/Service/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpHelperService, CommonHelper,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppComponent implements OnInit {
  private notification = inject(NotificationService);
  title = 'E-commerce';
  ngOnInit() {
    this.notification.startConnection();
  }
}
