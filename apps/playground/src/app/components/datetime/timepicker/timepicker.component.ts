import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [
    CommonModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyTimepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './timepicker.component.html',
})
export class TimepickerComponent {
  public myForms: FormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForms = formBuilder.group({
      time: new UntypedFormControl('2'),
    });
  }
}
