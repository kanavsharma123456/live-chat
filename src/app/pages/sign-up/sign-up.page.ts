import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  heart,
  ic_patient,
  ic_patient_light,
  ic_nurse,
  ic_nurse_light,
} from 'src/app/utils/constaants';
import {
  AlphaNumeric,
  EmailValidationNew,
  MobileValidation,
  ValidationMessages,
} from 'src/app/validators/validations';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  CONST_DATA = {
    heart,
    ic_patient,
    ic_patient_light,
    ic_nurse,
    ic_nurse_light,
  };
  commonForm: FormGroup;
  isFormSubmit: boolean = false;
  validationMessages = ValidationMessages;
  isPatientSelect: boolean = true;
  isNurseSelect: boolean = false;
  isSelectOne: boolean = true;
  isSelectTwo: boolean = false;
  isTextFieldType: boolean;
  isTextFieldTypeConf: boolean;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  serverSideError: string;
  isPasswordMatch: boolean = false;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.commonForm = this.formBuilder.group({
      fullName: ['', AlphaNumeric],
      email: ['', EmailValidationNew],
      phone_number: ['', MobileValidation],
      password: ['', AlphaNumeric],
      retype_password: ['', AlphaNumeric],
      age: ['', AlphaNumeric],
      cradential: ['', AlphaNumeric],
      state: ['', AlphaNumeric],
      licenseNumber: ['', AlphaNumeric],
      yearsNurse: ['', AlphaNumeric],
      specialities: ['', AlphaNumeric],
    });
    // this.setListenerForTrim();
  }

  onChangePassword(ev) {
    this.serverSideError = '';
    if (
      this.commonForm.value.password &&
      this.commonForm.value.confirm_password
    ) {
      if (
        this.commonForm.value.password ===
        this.commonForm.value.confirm_password
      ) {
        this.isPasswordMatch = true;
      } else {
        this.isPasswordMatch = false;
      }
    }
  }

  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }

  toggleConfPasswordFieldType() {
    this.isTextFieldTypeConf = !this.isTextFieldTypeConf;
  }

  onSelectItem(idx) {
    switch (idx) {
      case 1:
        this.isPatientSelect = true;
        this.isNurseSelect = false;
        break;
      case 2:
        this.isPatientSelect = false;
        this.isNurseSelect = true;
        break;
    }
  }

  onSelectItemNumber(idx) {
    switch (idx) {
      case 1:
        this.isSelectOne = true;
        this.isSelectTwo = false;
        break;
      case 2:
        this.isSelectTwo = true;
        this.isSelectOne = false;
        break;
    }
  }

  setListenerForTrim() {
    document
      .getElementById('ionInput')
      .addEventListener('ionInput', (e: any) => {
        e.target.value = e.target.value.trim();
      });
  }
}
