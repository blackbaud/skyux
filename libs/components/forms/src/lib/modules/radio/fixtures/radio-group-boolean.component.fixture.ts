import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';

@Component({
  selector: 'app-radio-group-boolean-test',
  templateUrl: './radio-group-boolean.component.fixture.html',
})
export class SkyRadioGroupBooleanTestComponent {
  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent | undefined;

  public radioForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.radioForm = formBuilder.group({
      booleanValue: false,
    });
  }
}
