import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpHelperService } from './http-helper.service';
import { ToastrService } from 'ngx-toastr';
import { CommonHelper } from './common-helper.service';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private hubConnection!: signalR.HubConnection;

    public currentUser = CommonHelper.GetUser();
  constructor(
    private http: HttpHelperService,
    private toastr: ToastrService
  ) { }

  startConnection(token: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.http.appUrl + 'videoCallHub?userId=' + this.currentUser?.userId, {
        accessTokenFactory: () => {
          return localStorage.getItem('Token') || '';
        }
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting connection: ', err));
  }

  sendOffer(callerId: string, targetUserId: string, offer: any, callType: 'audio' | 'video') {
    this.hubConnection.invoke('SendOffer', callerId, targetUserId, offer, callType)
      .catch(err => console.error('Error sending offer:', err));
  }

  sendAnswer(targetUserId: string, answer: any) {
    this.hubConnection.invoke('SendAnswer', targetUserId, answer)
      .catch(err => console.error('Error sending answer:', err));
  }

  sendCandidate(targetUserId: string, candidate: any) {
    this.hubConnection.invoke('SendCandidate', targetUserId, candidate)
      .catch(err => console.error('Error sending candidate:', err));
  }

  onOfferReceived(handler: (callerId: string, offer: any, callType: 'audio' | 'video') => void) {
    this.hubConnection.on('ReceiveOffer', handler);
  }

  onAnswerReceived(handler: (answer: any) => void) {
    this.hubConnection.on('ReceiveAnswer', handler);
  }

  onCandidateReceived(handler: (candidate: any) => void) {
    this.hubConnection.on('ReceiveCandidate', handler);
  }
}
