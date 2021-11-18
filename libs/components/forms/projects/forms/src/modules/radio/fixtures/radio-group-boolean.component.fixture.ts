import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';

@Component({
  selector: 'app-radio-group-boolean-test',
  templateUrl: './radio-group-boolean.component.fixture.html',
})
export class SkyRadioGroupBooleanTestComponent implements OnInit {
  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent;

  public radioForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.radioForm = this.formBuilder.group({
      booleanValue: false,
    });
  }
}
