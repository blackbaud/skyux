import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyAutonumericDirective
} from '../autonumeric.directive';

import {
  SkyAutonumericOptions
} from '../autonumeric-options';

@Component({
  selector: 'autonumeric-directive-test',
  templateUrl: './autonumeric.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutonumericFixtureComponent implements OnInit {

  @ViewChild(SkyAutonumericDirective)
  public autonumericDirective: SkyAutonumericDirective;

  public formGroup: FormGroup;

  public autonumericOptions: SkyAutonumericOptions;

  public get formControl(): AbstractControl {
    return this.formGroup.get('donationAmount');
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      donationAmount: new FormControl()
    });
  }
}
