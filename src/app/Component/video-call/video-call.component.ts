import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoCallService } from '../../Shared/Service/video-call.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.scss'
})
export class VideoCallComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;

  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  targetUserId = 'bb4bbf26-5bae-4f1d-b0e1-4e9d6d7fc547';  // The user you want to call
  incomingCall = false;
  incomingCallerId = '';
  incomingOffer: any = null; // This was missing, define incomingOffer here
  incomingCallType: 'audio' | 'video' = 'video';
  callStarted = false;
  isCalling = false;
  callType: 'audio' | 'video' = 'video';
  private ringtone = new Audio('ringtone.mp3');
  public currentUser = CommonHelper.GetUser();

  constructor(private videoCallService: VideoCallService, private toast: ToastrService) {}

  ngOnInit() {
    const token = localStorage.getItem('Token') || '';
    this.videoCallService.startConnection(token);

    // Listen for incoming call offers
    this.videoCallService.onOfferReceived(this.onOfferReceived.bind(this));
    this.videoCallService.onAnswerReceived(this.handleAnswer.bind(this));
    this.videoCallService.onCandidateReceived(this.handleCandidate.bind(this));
  }

  async startCall() {
    this.peerConnection = new RTCPeerConnection(this.config);
    this.addTracks();

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.videoCallService.sendCandidate(this.targetUserId, event.candidate);
      }
    };

    this.peerConnection.ontrack = event => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    if(this.currentUser!=null){
      this.videoCallService.sendOffer(this.currentUser?.userId, this.targetUserId, offer, this.callType);
    }

    this.isCalling = true;
  }

  addTracks() {
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  // Corrected onOfferReceived to store incoming offer
  async onOfferReceived(callerId: string, offer: any, callType: 'audio' | 'video') {
    this.incomingCall = true;
    this.incomingCallerId = callerId;
    this.incomingCallType = callType;
    this.incomingOffer = offer; // Store the incoming offer
    this.ringtone.loop = true;
    this.ringtone.play();
  }

  async acceptCall() {
    this.incomingCall = false;
    this.ringtone.pause();
    this.ringtone.currentTime = 0;

    this.peerConnection = new RTCPeerConnection(this.config);
    this.addTracks();

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.videoCallService.sendCandidate(this.incomingCallerId, event.candidate);
      }
    };

    this.peerConnection.ontrack = event => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.incomingOffer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.videoCallService.sendAnswer(this.incomingCallerId, answer);

    this.callStarted = true;
  }

  rejectCall() {
    this.incomingCall = false;
    this.ringtone.pause();
    this.ringtone.currentTime = 0;
    // Optionally send reject message to server
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
    this.callStarted = false;
    this.remoteVideo.nativeElement.srcObject = null;
  }

  toggleVideo() {
    const videoTrack = this.localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  }

  toggleAudio() {
    const audioTrack = this.localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
  }
}