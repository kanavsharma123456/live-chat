import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { UploadViewImageComponent } from "./upload-view-image/upload-view-image.component";
import { DirectMsgRoutingModule } from "./direct-msg-routing.module";
import { DirectMsgComponent } from "./direct-msg.component";
@NgModule({
  declarations: [DirectMsgComponent, UploadViewImageComponent],
  imports: [
    CommonModule,
    IonicModule,
    DirectMsgRoutingModule,
    ReactiveFormsModule,
  ],
})
export class DirectMsgModule {}
