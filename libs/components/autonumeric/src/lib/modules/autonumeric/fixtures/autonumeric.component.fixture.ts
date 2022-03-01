import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgModel,
} from '@angular/forms';

import { SkyAutonumericOptions } from '../autonumeric-options';
import { SkyAutonumericDirective } from '../autonumeric.directive';

@Component({
  selector: 'sky-autonumeric-directive-test',
  templateUrl: './autonumeric.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutonumericFixtureComponent implements OnInit {
  @ViewChild(SkyAutonumericDirective)
  public autonumericDirective: SkyAutonumericDirective | undefined;

  @ViewChild('donationAmountTemplateDriven', { read: NgModel })
  public donationAmountTemplateDriven: NgModel | undefined;

  public autonumericOptions: SkyAutonumericOptions | undefined;

  public formGroup: FormGroup | undefined;

  public templateDrivenModel: any = {
    donationAmount: 1000,
  };

  public get formControl(): AbstractControl | undefined {
    return this.formGroup?.get('donationAmount') || undefined;
  }

  public required = false;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      donationAmount: new FormControl(),
    });
  }
}
