import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';

@Component({
  templateUrl: './radio-group-reactive.component.fixture.html',
})
export class SkyRadioGroupReactiveFixtureComponent implements OnInit {
  public ariaLabel: string;

  public ariaLabelledBy = 'radio-group-label';

  public initialDisabled = false;

  public initialValue: unknown = null;

  public options = [
    { name: 'Lillith Corharvest', disabled: false },
    { name: 'Harima Kenji', disabled: false },
    { name: 'Harry Mckenzie', disabled: false },
  ];

  public radioControl: UntypedFormControl;
  public radioForm: UntypedFormGroup;

  public required = false;

  public showRadioGroup = true;

  public tabIndex: number;

  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent;

  constructor(private fb: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.radioControl = new UntypedFormControl({
      value: this.initialValue,
      disabled: this.initialDisabled,
    });

    this.radioForm = this.fb.group({
      radioGroup: this.radioControl,
    });
  }

  public changeOptions(): void {
    this.options = [
      { name: 'Lillith Corharvest', disabled: false },
      { name: 'Hank Salizar', disabled: false },
      { name: 'Harima Kenji', disabled: false },
      { name: 'Harry Mckenzie', disabled: false },
    ];
  }
}
