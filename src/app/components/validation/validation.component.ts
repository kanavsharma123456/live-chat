import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnInit {

  @Input() validationMessages:any;
  @Input() ValidationForm:FormGroup | any;
  @Input() type:any;
  @Input() isFormSubmit:boolean=false;
  @Input() isServerSide:boolean=false;
  @Input() message:string;
  //styles
  @Input() marginLeft:number=0;
  @Input() marginTop:number=8; //16
  @Input() marginBottom:number=0;
  @Input() ColorCode;
  constructor() { }

  ngOnInit() {}

}
