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

  @ViewChild(SkyPhoneFieldInputDirective)
  public inputDirective: SkyPhoneFieldInputDirective;

  @ViewChild(SkyPhoneFieldComponent)
  public phoneFieldComponent: SkyPhoneFieldComponent;

  public defaultCountry: string;

  public showInvalidDirective: boolean = false;

  public noValidate: boolean = false;

  public phoneForm: FormGroup;

  public phoneControl: FormControl;

  public initialValue: Date | string;

  public ngOnInit() {
    this.phoneControl = new FormControl(this.initialValue);
    this.phoneForm = new FormGroup({
      'phone': this.phoneControl
    });
  }

}
