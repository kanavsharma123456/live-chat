import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ValidationComponent } from '../components/validation/validation.component';
// import { BookCardComponent } from '../components/book-card/book-card.component';

const components = [
];

const declationCompo = [
  ValidationComponent,
]

const pipes = [
]

const directives = [


]
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule,],
  declarations: [ components, declationCompo,pipes,directives],
  exports: [declationCompo,pipes,directives, ReactiveFormsModule],
  providers: [],
  entryComponents: [components]
})
export class CommonComponentModule { }
