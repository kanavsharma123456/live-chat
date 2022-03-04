import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { ChatService } from "../../services/dm/dm.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-upload-view-image",
  templateUrl: "./upload-view-image.component.html",
  styleUrls: ["./upload-view-image.component.scss"],
})
export class UploadViewImageComponent implements OnInit {
  form: FormGroup;
  retData;
  type;
  file;
  src;
  viewData = false;
  patientReqId;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private params: NavParams,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (this.params.data && this.params.data.url) {
      this.src = this.params.data.url;
      this.type = this.params.data.type;
      this.viewData = true;
    } else {
      this.patientReqId = this.params.data.id;
      this.type = this.params.data.type;
      this.file = this.params.data.file;
      this.setSrc();
    }
    this.form = this.formBuilder.group({
      message: [null],
    });
  }

  setSrc() {
    if (this.type == "img") {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (_event) => {
        this.src = reader.result;
      };
    } else {
      this.src = URL.createObjectURL(this.file);
    }
  }
  sendMsg() {
    const caption = this.form.get("message").value;

    this.chatService
      .uploadFile(this.patientReqId, this.file)
      .subscribe((res) => {
        caption
          ? (this.retData = {
              type: this.type,
              data: res.data.path,
              caption: caption,
            })
          : (this.retData = { type: this.type, data: res.data.path });
        this.close();
      });
  }

  changeFile() {
    let files = (event.target as HTMLInputElement).files;
    if (files.length === 0) {
      return;
    }
    this.file = files.item(0);
    files.item(0).type.includes("video")
      ? (this.type = "video")
      : (this.type = "img");
    this.setSrc();
  }

  videoUrl() {
    return this.sanitizer.bypassSecurityTrustUrl(this.src);
  }

  close() {
    this.modalController.dismiss(this.retData ? this.retData : null);
  }
}
