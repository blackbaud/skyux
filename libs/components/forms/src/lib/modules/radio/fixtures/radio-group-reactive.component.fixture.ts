import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';

@Component({
  templateUrl: './radio-group-reactive.component.fixture.html',
})
export class SkyRadioGroupReactiveFixtureComponent implements OnInit {
  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined = 'radio-group-label';

  public groupName: string | undefined = 'radioGroup';

  public initialDisabled = false;

  public initialValue: unknown = null;

  public options = [
    { name: 'Lillith Corharvest', disabled: false },
    { name: 'Harima Kenji', disabled: false },
    { name: 'Harry Mckenzie', disabled: false },
  ];

  public radioControl: UntypedFormControl | undefined;
  public radioForm: UntypedFormGroup | undefined;

  public required = false;

  public showRadioGroup = true;

  public tabIndex: number | undefined;

  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent | undefined;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.radioControl = new UntypedFormControl({
      value: this.initialValue,
      disabled: this.initialDisabled,
    });

    this.radioForm = this.#formBuilder.group({
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
