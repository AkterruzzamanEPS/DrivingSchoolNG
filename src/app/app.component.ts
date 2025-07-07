import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonHelper } from './Shared/Service/common-helper.service';
import { HttpHelperService } from './Shared/Service/http-helper.service';
import { NotificationService } from './Shared/Service/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpHelperService,DatePipe, CommonHelper,
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
