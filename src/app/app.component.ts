import { Component } from "@angular/core";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  providers: [NavParams],
})
export class AppComponent {
  constructor() {}
}
