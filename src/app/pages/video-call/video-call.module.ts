import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";

import { VideoCallRoutingModule } from "./video-call-routing.module";
import { VideoCallComponent } from "./video-call.component";
@NgModule({
  declarations: [VideoCallComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    VideoCallRoutingModule,
  ],
})
export class VideoCallModule {}
