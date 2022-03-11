import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { PusherService } from "src/app/pages/services/pusher/pusher.service";

import { Subscription } from "rxjs";
import { ModalController } from "@ionic/angular";
import { UploadViewImageComponent } from "./upload-view-image/upload-view-image.component";
import { ChatService } from "src/app/pages/services/dm/dm.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import { GestureController } from "@ionic/angular";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { ActivatedRoute } from "@angular/router";
import { NavParams } from "@ionic/angular";
import { dataURItoBlob, checkFileType } from "../services/helpers/utilities";
@Component({
  selector: "app-direct-msg",
  templateUrl: "./direct-msg.component.html",
  styleUrls: ["./direct-msg.component.scss"],
  providers: [PusherService],
})
export class DirectMsgComponent implements OnInit, AfterViewInit, OnDestroy {
  patientReqId = 53;
  messageList = [];
  modalView = false;
  private feedSubscription: Subscription;
  sender = 8;
  pageSize = 8;
  pageNumber = 1;
  lastPage = 2;
  totalSize = 0;
  recording = false;
  recordDuration = 0;
  recordDurDisplay = "";
  loadingMessages = false;
  lastScrollTop = 0;
  form: FormGroup;
  isLive = false;
  @ViewChild("recordBtn", { read: ElementRef }) recordBtn: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private gestureCtrl: GestureController,
    private modalCtrl: ModalController,
    private feedService: PusherService,
    private activatedRoute: ActivatedRoute,
    private params: NavParams
  ) {}

  ngOnInit() {
    this.modalView = this.params.data.isModal ? this.params.data.isModal : null;

    this.activatedRoute.queryParams.subscribe((res) => {
      if (res.isLive) {
        this.isLive = true;
        this.feedService.initiatePusher(this.patientReqId);
        this.feedService.getFeedItems().subscribe((res) => {
          this.messageList.unshift(res);
          console.log(this.messageList);
        });
      } else {
        this.feedService.initiatePusher1(this.patientReqId);
        // this.getMessages();
        // VoiceRecorder.requestAudioRecordingPermission();
      }
    });

    this.form = this.formBuilder.group({
      message: [null],
    });
    this.loadingMessages = true;
  }

  ngAfterViewInit() {
    const longPress = this.gestureCtrl.create(
      {
        el: this.recordBtn.nativeElement,
        threshold: 0,
        gestureName: "long-press",
        onStart: (ev) => {
          Haptics.impact({ style: ImpactStyle.Light });
          this.startRecording();
          this.calculateDuration();
        },
        onEnd: (ev) => {
          Haptics.impact({ style: ImpactStyle.Light });
          this.stopRecording();
        },
      },
      true
    );
    longPress.enable();
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

  getMessages(event?) {
    this.chatService
      .getMessages(this.patientReqId, this.pageNumber, this.pageSize)
      .subscribe((res) => {
        let messageData = res.data.messages.data;
        this.messageList = this.messageList.concat(messageData);
        this.totalSize = res.data.messages.total;
        this.lastPage = res.data.messages.last_page;
        this.loadingMessages = false;
      });
  }

  sendMsg() {
    const msg = this.form.get("message").value;
    if (!msg) {
      return;
    }
    let req = {
      message: {
        type: "TXT",
        data: msg,
      },
    };
    this.form.reset();
    this.saveMessage(req);
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    this.recording = false;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      console.log(result);
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        const blob = dataURItoBlob(recordData);
        this.uploadAudio(blob);
      }
    });
  }

  attachFileIm(event) {
    let files = (event.target as HTMLInputElement).files;
    if (files.length === 0) {
      return;
    }
    const file = files.item(0);
    const type = checkFileType(file.type);
    if (type == "audio") {
      this.uploadAudio(file);
    } else if (type == "video" || type == "img") {
      this.imgVideoModal(type, file);
    } else if (type == "doc") {
      this.uploadDoc(file);
    }
  }

  async onScroll(event) {
    if (this.lastScrollTop < event.target.scrollTop) {
      return;
    } else {
      this.lastScrollTop = event.target.scrollTop;
      if (
        this.pageNumber < this.lastPage &&
        -1 * (event.target.scrollTop - event.target.clientHeight - 200) >=
          event.target.scrollHeight &&
        !this.loadingMessages
      ) {
        this.pageNumber++;
        this.loadingMessages = true;
        this.getMessages();
      }
    }
  }

  async imgVideoModal(type, file) {
    const modal = await this.modalCtrl.create({
      component: UploadViewImageComponent,
      componentProps: { type: type, id: this.patientReqId, file: file },
      cssClass: "imageView",
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        let req = {
          message: res.data,
        };
        this.saveMessage(req);
      }
    });
    await modal.present();
  }

  uploadAudio(file) {
    this.chatService.uploadFile(this.patientReqId, file).subscribe((res) => {
      let req = {
        message: {
          type: "audio",
          data: res.data.path,
        },
      };
      this.saveMessage(req);
    });
  }

  uploadDoc(file) {
    this.chatService.uploadFile(this.patientReqId, file).subscribe((res) => {
      let req = {
        message: {
          type: "doc",
          data: res.data.path,
          name: file.name,
        },
      };
      this.saveMessage(req);
    });
  }

  openDoc(url) {
    window.open(url, "_system", "location=yes");
  }

  async viewImgVideo(data) {
    const modal = await this.modalCtrl.create({
      component: UploadViewImageComponent,
      componentProps: { url: data.data, type: data.type },
      cssClass: "imageView",
    });
    modal.present();
  }
  saveMessage(req) {
    this.chatService.uploadMessages(this.patientReqId, req).subscribe((res) => {
      this.isLive ? "" : this.messageList.unshift(res.data.message);
    });
  }
  ngOnDestroy() {
    this.feedSubscription ? this.feedSubscription.unsubscribe() : "";
  }
}
