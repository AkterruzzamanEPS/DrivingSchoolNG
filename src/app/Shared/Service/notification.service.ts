import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpHelperService } from './http-helper.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  constructor(
    private http: HttpHelperService,
    private toastr: ToastrService
  ) { }
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.http.appUrl + 'notificationHub', {
        accessTokenFactory: () => {
          return localStorage.getItem('Token') || '';
        }
      })
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ' + err));

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.toastr.success(message, '🔔 New Notification');
      // Here, you can instead push it to a notification list or UI bell icon
    });
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

}