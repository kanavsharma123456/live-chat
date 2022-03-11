import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertController, ModalController } from "@ionic/angular";
import { PusherService } from "src/app/pages/services/pusher/pusher.service";
import { DirectMsgComponent } from "src/app/pages/direct-msg/direct-msg.component";
import { RecieverAlertsService } from "src/app/pages/services/video-call/reciever-webrtc.service";
import { AlertsService } from "src/app/pages/services/video-call/sender-webrtc.service";
import { VideoCallService } from "src/app/pages/services/video-call/video-call.service";

@Component({
  selector: "app-video-call",
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.scss"],
})
export class VideoCallComponent implements OnInit {
  patientRequestId = 53;
  recordDuration = 0;
  recordDurDisplay = "";
  recording = false;
  isPatient = true;
  toggleVideo = false;
  videoCam = true;
  mic = true;
  members;
  constructor(
    private senderAlertsService: AlertsService,
    private recieverAlertsService: RecieverAlertsService,
    private videoCallService: VideoCallService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private feedService: PusherService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initPusher();
    this.feedService.getMembers().subscribe((res) => {
      this.members = res;
      if (this.members.length == 2) {
        this.toggleVideo = false;
        this.recording = true;
        this.calculateDuration();
      } else {
        this.toggleVideo = true;
        this.ringPerson();
      }
    });

    this.activatedRoute.queryParams.subscribe((res) => {
      if (res.isLive) {
        this.isPatient = false;
      }
    });
    this.getDetails();
  }

  initPusher() {
    this.feedService.initiatePusher(this.patientRequestId);
  }

  getDetails() {
    this.videoCallService.getDetails(this.patientRequestId).subscribe((res) => {
      if (this.isPatient) {
        // this.sendVideo(
        //   res.data.video_call.patient_stream_id,
        //   res.data.stream_publish_token.tokenId
        // );
        // this.recieveVideo(res.data.video_call.nurse_stream_id);
      } else {
        this.sendVideo(
          res.data.video_call.nurse_stream_id,
          res.data.stream_publish_token.tokenId
        );
        this.recieveVideo(res.data.video_call.patient_stream_id);
      }
    });
  }

  ringPerson() {
    this.videoCallService
      .ringVideoCall(this.patientRequestId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  recieveVideo(id: string) {
    this.recieverAlertsService.initWebRTCAdaptor("recieverVideo", id);
  }

  sendVideo(id, token) {
    this.senderAlertsService.initWebRTCAdaptor(
      "senderVideo",
      id,
      token,
      "VIDEO_CALL"
    );
  }

  toggleView() {
    this.toggleVideo = !this.toggleVideo;
  }

  toggleVideoCam() {
    this.videoCam = !this.videoCam;
    this.senderAlertsService.toggleVideoCam();
  }

  toggleMic() {
    this.mic = !this.mic;
    this.senderAlertsService.toggleMic();
  }

  async endCall() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Important",
      message: "Please confirm that you want to disconnect the call?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.recording = false;
            // this.senderAlertsService.closeConnection();
          },
        },
      ],
    });
    await alert.present();
  }

  facingMode() {
    this.senderAlertsService.toggleFacingMode();
  }

  async openChat() {
    const modal = await this.modalController.create({
      component: DirectMsgComponent,
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.8,
      cssClass: "small-dialog",
      componentProps: { isModal: true, id: this.patientRequestId },
    });
    await modal.present();
  }

  calculateDuration() {
    if (!this.recording) {
      this.recordDuration = 0;
      this.recordDurDisplay = "";
      return;
    }
    this.recordDuration += 1;
    const min = Math.floor(this.recordDuration / 60);
    const sec = (this.recordDuration % 60).toString().padStart(2, "0");
    this.recordDurDisplay = `${min}:${sec}`;
    setTimeout(() => {
      this.calculateDuration();
    }, 1000);
  }
}
