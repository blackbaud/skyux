import { Component } from '@angular/core';
import {
  AbstractControl,
  NgModel,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  standalone: false,
})
export class RadioComponent {
  public disabled = false;

  public iconSelectedValue = '1';

  public radioForm: UntypedFormGroup;

  public favoriteSeason: UntypedFormControl;

  public radioValue: { name: string; disabled: boolean };

  public required = false;

  public showInlineHelp = false;

  public seasons = [
    { name: 'Spring', disabled: false },
    { name: 'Summer', disabled: false },
    { name: 'Fall', disabled: true },
    { name: 'Winter', disabled: false },
  ];

  public selectedValue = '3';

  public headingStyle: number | undefined;

  constructor(formBuilder: UntypedFormBuilder) {
    this.favoriteSeason = new UntypedFormControl(
      {
        value: undefined,
        disabled: this.disabled,
      },
      [
        (control: AbstractControl): ValidationErrors | null => {
          if (control.value?.name !== 'Spring') {
            return { incorrectSeason: true };
          }
          return null;
        },
      ],
    );

    this.radioForm = formBuilder.group({
      favoriteSeason: this.favoriteSeason,
    });
  }

  public onToggleDisabledClick(): void {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.radioForm.disable();
    } else {
      this.radioForm.enable();
    }
  }

  public onToggleInlineHelpClick(): void {
    this.showInlineHelp = !this.showInlineHelp;
  }

  public markAllAsTouched(model: NgModel): void {
    this.radioForm.markAllAsTouched();
    this.radioForm.updateValueAndValidity();

    model.control.markAsTouched();
    model.control.updateValueAndValidity();
  }

  public toggleHeadingStyle(): void {
    const newStyle = (this.headingStyle ?? 2) + 1;
    if (newStyle > 5) {
      this.headingStyle = undefined;
    } else {
      this.headingStyle = newStyle;
    }
  }
}
