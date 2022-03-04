import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DirectMsgComponent } from "./direct-msg.component";

const routes: Routes = [
  {
    path: "",
    component: DirectMsgComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectMsgRoutingModule {}
