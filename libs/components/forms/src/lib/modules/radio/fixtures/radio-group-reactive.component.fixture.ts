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

  /* spell-checker:disable */
  public options: { name: string; disabled: boolean; id?: string }[] = [
    { name: 'Lilly Corr', disabled: false },
    { name: 'Sherry Ken', disabled: false },
    { name: 'Harry Mckenzie', disabled: false },
  ];
  /* spell-checker:enable */

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
    /* spell-checker:disable */
    this.options = [
      { name: 'Lily Corr', disabled: false },
      { name: 'Hank Smith', disabled: false },
      { name: 'Sherry Ken', disabled: false },
      { name: 'Harry Mckenzie', disabled: false },
    ];
    /* spell-checker:enable */
  }
}
