import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';
import { SkyRadioGroupHeadingLevel } from '../types/radio-group-heading-level';
import { SkyRadioGroupHeadingStyle } from '../types/radio-group-heading-style';

@Component({
  templateUrl: './radio-group-reactive.component.fixture.html',
  standalone: false,
})
export class SkyRadioGroupReactiveFixtureComponent implements OnInit {
  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined = 'radio-group-label';

  public groupName: string | undefined = 'radioGroup';

  public initialDisabled = false;

  public initialValue: unknown = null;

  public options: { name: string; disabled: boolean; id?: string }[] = [
    { name: 'Lilly Corr', disabled: false },
    { name: 'Sherry Ken', disabled: false },
    { name: 'Harry Mckenzie', disabled: false },
    { name: 'Incorrect option', disabled: false },
  ];

  public radioControl: UntypedFormControl | undefined;
  public radioForm: UntypedFormGroup | undefined;

  public required = false;

  public showRadioGroup = true;

  public tabIndex: number | undefined;

  public headingText: string | undefined;

  public headingHidden = false;

  public hintText: string | undefined;

  public stacked: boolean | undefined;

  public helpKey: string | undefined;

  public helpPopoverContent: string | undefined;

  public headingLevel: SkyRadioGroupHeadingLevel | undefined = 3;

  public headingStyle: SkyRadioGroupHeadingStyle | undefined = 3;

  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent | undefined;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.radioControl = new UntypedFormControl(
      {
        value: this.initialValue,
        disabled: this.initialDisabled,
      },
      [
        (control: AbstractControl): ValidationErrors | null => {
          if (control.value?.name === 'Incorrect option') {
            return { incorrectOption: true };
          }
          return null;
        },
      ],
    );

    this.radioForm = this.#formBuilder.group({
      radioGroup: this.radioControl,
    });
  }

  public changeOptions(): void {
    this.options = [
      { name: 'Lily Corr', disabled: false },
      { name: 'Hank Smith', disabled: false },
      { name: 'Sherry Ken', disabled: false },
      { name: 'Harry Mckenzie', disabled: false },
    ];
  }
}
