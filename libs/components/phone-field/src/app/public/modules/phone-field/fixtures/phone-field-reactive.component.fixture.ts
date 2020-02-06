import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyPhoneFieldComponent
} from '../phone-field.component';

import {
  SkyPhoneFieldInputDirective
} from '../phone-field-input.directive';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field-reactive.component.fixture.html'
})
export class PhoneFieldReactiveTestComponent implements OnInit {

  public defaultCountry: string;

  public initialValue: Date | string;

  public noValidate: boolean = false;

  public phoneControl: FormControl;

  public phoneForm: FormGroup;

  public showInvalidDirective: boolean = false;

  public showPhoneField: boolean = true;

  public showSecondaryPhoneField: boolean = false;

  @ViewChild(SkyPhoneFieldInputDirective)
  public inputDirective: SkyPhoneFieldInputDirective;

  @ViewChild(SkyPhoneFieldComponent)
  public phoneFieldComponent: SkyPhoneFieldComponent;

  public ngOnInit(): void {
    this.phoneControl = new FormControl(this.initialValue);
    this.phoneForm = new FormGroup({
      'phone': this.phoneControl
    });
  }

}
