import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
})
export class RadioComponent {
  public disabled = false;

  public iconSelectedValue = '1';

  public radioForm: UntypedFormGroup;

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

  constructor(formBuilder: UntypedFormBuilder) {
    this.radioForm = formBuilder.group({
      favoriteSeason: new UntypedFormControl({
        value: this.seasons[0],
        disabled: this.disabled,
      }),
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
}
