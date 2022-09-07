import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';

@Component({
  selector: 'app-radio-group-boolean-test',
  templateUrl: './radio-group-boolean.component.fixture.html',
})
export class SkyRadioGroupBooleanTestComponent implements OnInit {
  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent;

  public radioForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.radioForm = this.formBuilder.group({
      booleanValue: false,
    });
  }
}
