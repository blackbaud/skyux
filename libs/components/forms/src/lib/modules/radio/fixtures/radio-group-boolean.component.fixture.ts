import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';

@Component({
  selector: 'app-radio-group-boolean-test',
  templateUrl: './radio-group-boolean.component.fixture.html',
})
export class SkyRadioGroupBooleanTestComponent {
  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent | undefined;

  public radioForm: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.radioForm = formBuilder.group({
      booleanValue: false,
    });
  }
}
