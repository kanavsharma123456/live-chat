import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { ModalController } from "@ionic/angular";
import { UploadViewImageComponent } from "./upload-view-image/upload-view-image.component";
import { ChatService } from "src/app/pages/services/dm/dm.service";
import { IonInfiniteScroll } from "@ionic/angular";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import { GestureController } from "@ionic/angular";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { dataURItoBlob, checkFileType } from "../services/helpers/utilities";
@Component({
  selector: "app-direct-msg",
  templateUrl: "./direct-msg.component.html",
  styleUrls: ["./direct-msg.component.scss"],
})
export class DirectMsgComponent implements OnInit, AfterViewInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  patientReqId = 50;
  messageList = [];
  sender = 8;
  page_size = 5;
  pageNumber = 1;
  totalSize = 0;
  recording = false;
  recordDuration = 0;
  recordDurDisplay = "";
  form: FormGroup;
  @ViewChild("recordBtn", { read: ElementRef }) recordBtn: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private gestureCtrl: GestureController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      message: [null],
    });
    this.getMessages();
    VoiceRecorder.requestAudioRecordingPermission();
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
      .getMessages(this.patientReqId, this.pageNumber, this.page_size)
      .subscribe((res) => {
        let messageData = res.data.messages.data;
        this.messageList = this.messageList.concat(messageData);
        this.totalSize = res.data.messages.total;
        if (event) {
          event.target.complete();
        }
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
    console.log(type);
    if (type == "audio") {
      this.uploadAudio(file);
    } else if (type == "video" || type == "img") {
      this.imgVideoModal(type, file);
    }
  }

  async onScroll(event) {
    console.log(event);
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

  scrollEvent(event) {
    if (this.messageList.length != 0) {
      if (this.messageList.length < this.totalSize) {
        console.log("ccs");
        console.log(event.target.disabled);
        event.target.disabled = false;
        this.pageNumber++;
        this.getMessages(event);
      } else {
        console.log("c");
        event.target.disabled = true;
      }
    } else {
      console.log("sa");
      this.getMessages(event);
    }
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
      this.messageList.unshift(res.data.message);
    });
  }
}
