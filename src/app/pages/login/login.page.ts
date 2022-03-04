import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { UtilsService } from 'src/app/services/uitils.services';
import { bt_bg, heart, ic_user, ic_password } from 'src/app/utils/constaants';
import {
  AlphaNumeric,
  EmailValidationNew,
  ValidationMessages,
} from 'src/app/validators/validations';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  CONST_DATA = {
    bt_bg,
    heart,
    ic_user,
    ic_password,
  };
  loginForm: FormGroup;
  isTextFieldType: boolean;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  isFormSubmit: boolean = false;
  serverSideError: string;
  apiTotalLogins: number;
  totalPercetageofProfile: any;
  browser: any;
  validationMessages = ValidationMessages;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private utilServices: UtilsService,
    private platform: Platform,
    private alertController: AlertController
  ) {
    // this.startLoad();
  }

  ngOnInit() {
    this.isFormSubmit = false;
    this.buildLoginForm();
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter.....Login');
  }

  openRegPage() {
    // this.utilServices.setNavigationRoute("registration");
  }

  setListenerForTrim() {
    document
      .getElementById('ionInput')
      .addEventListener('ionInput', (e: any) => {
        e.target.value = e.target.value.trim();
      });
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidationNew],
      password: ['', AlphaNumeric],
      // email: ['vivek@technorex.in', EmailValidationNew],
      // password: ['As123456', AlphaNumeric],
      // email: ['', EmailValidationNew],
      // password: ['', AlphaNumeric],
    });
    this.setListenerForTrim();
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }

  login() {
    console.log('formvalue.....', this.loginForm);
    this.isFormSubmit = true;
    if (this.loginForm.valid) {
      this.utilServices.setNavigationRoute('tabs/tabs/tab1');
    }
  }

  openRegistere() {
    this.utilServices.setNavigationRoute('sign-up');
  }

  gotoDashborad() {
    this.utilServices.setNavigationRoute('tabs/tabs/tab1');
  }

  logScrollStart() {
    console.log('logScrollStart..');
  }
}
