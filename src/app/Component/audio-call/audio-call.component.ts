import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoCallService } from '../../Shared/Service/video-call.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audio-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audio-call.component.html',
  styleUrl: './audio-call.component.scss'
})
export class AudioCallComponent implements OnInit {
  @ViewChild('remoteAudio') remoteAudio!: ElementRef<HTMLAudioElement>;

  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  targetUserId = 'bb4bbf26-5bae-4f1d-b0e1-4e9d6d7fc547'; // Set your target
  incomingCall = false;
  incomingCallerId = '';
  incomingOffer: any = null;
  callStarted = false;
  isCalling = false;
  callType: 'audio' = 'audio';
  private ringtone = new Audio('ringtone.mp3');
  public currentUser = CommonHelper.GetUser();

  constructor(private videoCallService: VideoCallService, private toast: ToastrService) {}

  ngOnInit() {
    const token = localStorage.getItem('Token') || '';
    this.videoCallService.startConnection(token);

    this.videoCallService.onOfferReceived(this.onOfferReceived.bind(this));
    this.videoCallService.onAnswerReceived(this.handleAnswer.bind(this));
    this.videoCallService.onCandidateReceived(this.handleCandidate.bind(this));
  }

  async startCall() {
    this.peerConnection = new RTCPeerConnection(this.config);
    await this.setupAudioStream();
    this.addTracks();

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.videoCallService.sendCandidate(this.targetUserId, event.candidate);
      }
    };

    this.peerConnection.ontrack = event => {
      this.remoteAudio.nativeElement.srcObject = event.streams[0];
      this.remoteAudio.nativeElement.play();
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    if (this.currentUser) {
      this.videoCallService.sendOffer(this.currentUser.userId, this.targetUserId, offer, this.callType);
    }

    this.isCalling = true;
  }

  async setupAudioStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }

  addTracks() {
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  async onOfferReceived(callerId: string, offer: any, callType: 'audio' | 'video') {
    if (callType !== 'audio') return; // Only accept audio calls here

    this.incomingCall = true;
    this.incomingCallerId = callerId;
    this.incomingOffer = offer;
    this.ringtone.loop = true;
    this.ringtone.play();
  }

  async acceptCall() {
    this.incomingCall = false;
    this.ringtone.pause();
    this.ringtone.currentTime = 0;

    this.peerConnection = new RTCPeerConnection(this.config);
    await this.setupAudioStream();
    this.addTracks();

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.videoCallService.sendCandidate(this.incomingCallerId, event.candidate);
      }
    };

    this.peerConnection.ontrack = event => {
      this.remoteAudio.nativeElement.srcObject = event.streams[0];
      this.remoteAudio.nativeElement.play();
    };

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.incomingOffer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.videoCallService.sendAnswer(this.incomingCallerId, answer);

    // Update UI for caller and receiver
    this.callStarted = true;
    this.isCalling = false; // Caller has accepted, stop calling UI
  }

  rejectCall() {
    this.incomingCall = false;
    this.ringtone.pause();
    this.ringtone.currentTime = 0;
    // Optionally reset UI state for the caller
    this.isCalling = false;
  }

  async handleAnswer(answer: any) {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async handleCandidate(candidate: any) {
    if (this.peerConnection) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  endCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = undefined!;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = undefined!;
    }
    this.callStarted = false;
    this.isCalling = false;
    this.remoteAudio.nativeElement.srcObject = null;
    // Reset to initial state (Show Start Call button)
  }
}
