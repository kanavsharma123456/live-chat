import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { UtilsService } from 'src/app/services/uitils.services';
import { slide1, slide2,bt_bg } from 'src/app/utils/constaants';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
})
export class GetStartedPage implements OnInit {

  CONST_DATA={
    slide1,slide2,bt_bg
  }
  @ViewChild('slides', {static: true}) slides: IonSlides;
  currentIndex=0;
  constructor(private utilsService:UtilsService) { }

  ngOnInit() {
  }

  skipPage(){
    this.utilsService.setNavigationRoute("login");
  }

  slideChanged(e: any) {
    this.getActiveIndex();
   }
 
   getActiveIndex(){
     this.slides.getActiveIndex().then((index: number) => {
       this.currentIndex=index;
         console.log(index);
     });
   }

}
