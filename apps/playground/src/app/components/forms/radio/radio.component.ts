import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
})
export class RadioComponent implements OnInit {
  public disabled = false;

  public iconSelectedValue = '1';

  public radioForm: FormGroup;

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

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.radioForm = this.formBuilder.group({
      favoriteSeason: new FormControl({
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
