import {
  AbstractControl,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

export const EmailValidation = [Validators.required, Validators.email];
export const EmailValidationNew = [
  Validators.required,
  Validators.pattern(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,50})$/
  ),
];
// export const EmailValidationNew = [Validators.required, Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]*\.([a-z]{2,50})$/)];
// const candianPostalCode = "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$";
const candianPostalCode =
  '^(?!.*[])[a-vxyA-VXY][0-9][a-zA-Z] ?[0-9][a-zA-Z][0-9]$';
// const candianPostalCode = "^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$";
export const aphaNumericPattern =
  /(?![\s~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/?]+$)([a-zA-Z0-9][\s~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/?]*)+$/;
export const PasswordValidation = [
  Validators.required,
  Validators.minLength(4),
  Validators.maxLength(50),
];

export const PasswordValidationNew = [
  Validators.required,
  Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/),
];
export const PasswordValidationNumeric = [
  Validators.pattern('^[0-9]*$'),
  Validators.required,
  Validators.maxLength(4),
];

export const CanadianPostalCodeCalidation = [
  Validators.required,
  Validators.pattern(candianPostalCode),
];

export const DomainValidation = [Validators.required];

export const OptionalTextValidation = [
  Validators.minLength(2),
  Validators.maxLength(50),
];
export const RequiredTextValidation = OptionalTextValidation.concat([
  Validators.required,
]);
export const RequiredCodeValidation = [
  Validators.required,
  Validators.maxLength(20),
];

export const OneCharValidation = [
  Validators.minLength(1),
  Validators.maxLength(1),
];
export const BirthDateValidation = [
  Validators.required,
  Validators.min(new Date().getFullYear() - 100),
  Validators.max(new Date().getFullYear()),
];

export const USAZipCodeValidation = [
  Validators.required,
  Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/),
];
export const USAPhoneNumberValidation = [
  Validators.required,
  Validators.pattern(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/),
];

export const MobileOrEmailValidation = [
  Validators.required,
  Validators.pattern(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))|(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
  ),
];

export const NumberValidation = [
  Validators.pattern(/^-?(0|[1-9]\d*)?$/),
  Validators.minLength(10),
  // Validators.maxLength(15)
];

export const DecimalNumberValidation = [
  Validators.pattern(/^[1-9]\d*(\.\d+)?$/),
];

export function minLengthArray(min: number) {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min) {
      return null;
    }
    return { minLengthArray: { valid: false } };
  };
}

export function firstLessThanSecond(first: string, second: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const firstVal = <Number>group.controls[first].value
      ? Number(group.controls[first].value).toFixed(10)
      : 0;
    const secondVal = <Number>group.controls[second].value
      ? Number(group.controls[second].value).toFixed(10)
      : 0;

    if (Number(firstVal) > Number(secondVal)) {
      return {
        hasGreaterValue: true,
      };
    }
  };
}

export const MobileValidation = [
  Validators.required,
  Validators.minLength(10),
  // Validators.maxLength(10),
  // Validators.pattern("\d{9}"),
  Validators.pattern('^[0-9]*$'),
];

export const ChangePasswordValidation = [
  // (?![\s~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/?]+$)([a-zA-Z0-9][\s~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/?]*)+$/;
  Validators.required,
  Validators.minLength(8),
  // Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$"),
  // Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9\d!@#$%^&*]+$"),
  Validators.pattern(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9d!@#$%^&*()_+={}\\[\\]\\-|\\:;'<>,./?]+$"
  ),
];

export const MobileValidationWithoutRequired = [
  Validators.minLength(10),
  Validators.pattern('^[0-9]*$'),
];

export const AlphaNumeric = [
  Validators.required,
  Validators.pattern(aphaNumericPattern),
];

export function checkPercentage(per: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const firstVal = <Number>group.controls[per].value
      ? Number(group.controls[per].value).toFixed(10)
      : 0;
    if (Number(firstVal) > 100) {
      return {
        hasGreaterValue: true,
      };
    }
  };
}

export function fromToDateValidation(fromDate: string, toDate: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const from = <Date>group.controls[fromDate].value;
    const to = <Date>group.controls[toDate].value;
    if (null !== from && null !== to) {
      if (from > to) {
        return {
          hasGreaterValue: true,
        };
      }
    }
    return;
  };
}

export function firstEqualToSecond(first: string, second: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const firstVal = <Number>group.controls[first].value
      ? Number(group.controls[first].value).toFixed(10)
      : 0;
    const secondVal = <Number>group.controls[second].value
      ? Number(group.controls[second].value).toFixed(10)
      : 0;

    if (firstVal && secondVal !== 0) {
      if (firstVal !== secondVal) {
        return {
          hasEqualValue: true,
        };
      }
    }
    return;
  };
}

export function passwordAndConfirmPassword(first: string, second: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const firstVal = group.controls[first].value;
    const secondVal = group.controls[second].value;

    if (firstVal && secondVal) {
      if (firstVal !== secondVal) {
        return {
          hasEqualValue: true,
        };
      }
    }
    return;
  };
}

export const OTPValidation = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(6),
];

export const ValidationMessages = {
  email: [
    { type: 'required', message: 'Please enter an email.' },
    { type: 'pattern', message: 'You must enter a valid email.' },
  ],
  password: [{ type: 'required', message: 'Password is required.' }],
  oldPassword: [{ type: 'required', message: 'Enter Old Password.' }],
  confirmPassword: [
    { type: 'required', message: 'Confirm password is required.' },
  ],
  licenseNumber: [
    { type: 'required', message: 'License number  is required.' },
    { type: 'pattern', message: 'License number  is required.' },
  ],
  specialities: [
    { type: 'required', message: 'Specialities  is required.' },
    { type: 'pattern', message: 'Specialities  is required.' },
  ],
  fullName: [
    { type: 'required', message: 'Full name  is required.' },
    { type: 'pattern', message: 'Full name  is required.' },
  ],
  lastName: [
    { type: 'required', message: 'Last name  is required.' },
    { type: 'pattern', message: 'Last name  is required.' },
  ],
  dob: [{ type: 'required', message: 'DOB is required.' }],
  phone: [
    { type: 'required', message: 'Phone number  is required.' },
    { type: 'pattern', message: 'You must enter a valid phone number.' },
    {
      type: 'minlength',
      message: 'Minimum 10 digit phone number is required.',
    },
    // { type: 'maxlength', message: 'You must enter a valid phone number.' }
  ],
  otp: [{ type: 'required', message: 'OTP is required' }],
  shift_location: [
    { type: 'required', message: 'Shift location  is required.' },
    { type: 'pattern', message: 'Shift location  is required.' },
  ],
  shift_notes: [
    { type: 'required', message: 'Shift notes  is required.' },
    { type: 'pattern', message: 'Shift notes  is required.' },
  ],
  from_address: [
    { type: 'required', message: 'From address  is required.' },
    { type: 'pattern', message: 'From address  is required.' },
  ],
  to_address: [
    { type: 'required', message: 'From address  is required.' },
    { type: 'pattern', message: 'From address  is required.' },
  ],
  km_travell: [
    { type: 'required', message: 'KM travell  is required.' },
    { type: 'pattern', message: 'KM travell  is required.' },
  ],
  change_transport: [
    { type: 'required', message: 'Change transport  is required.' },
    { type: 'pattern', message: 'Change transport  is required.' },
  ],
  changePassword: [
    { type: 'required', message: 'Please enter a password.' },
    {
      type: 'pattern',
      message:
        'Minimum 8 characters, Minimum 1 character in Lowercase, Minimum 1 character in Uppercase, Minimum 1 digit.',
    },
  ],
  passwordMatch: [
    { type: 'required', message: 'Please enter the same password again.' },
  ],
  age: [{ type: 'required', message: 'Age is required.' }],
};
