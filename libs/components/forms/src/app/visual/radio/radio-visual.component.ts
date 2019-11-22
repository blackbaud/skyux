import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'radio-visual',
  templateUrl: './radio-visual.component.html'
})
export class RadioVisualComponent implements OnInit {

  public disabled: boolean;

  public iconSelectedValue = '1';

  public radioForm: FormGroup;

  public radioValue: any;

  public required: boolean = false;

  public seasons = [
    { name: 'Spring', disabled: false },
    { name: 'Summer', disabled: false },
    { name: 'Fall', disabled: true },
    { name: 'Winter', disabled: false }
  ];

  public selectedValue = '3';

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.radioForm = this.formBuilder.group({
      favoriteSeason: this.seasons[0]
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
}
