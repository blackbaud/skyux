import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-group-boolean-test',
  templateUrl: './radio-group-boolean.component.fixture.html',
  standalone: false,
})
export class SkyRadioGroupBooleanTestComponent {
  public radioForm: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.radioForm = formBuilder.group({
      booleanValue: false,
    });
  }
}
