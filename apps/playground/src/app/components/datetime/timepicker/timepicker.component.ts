import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-timepicker',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyTimepickerModule,
  ],
  templateUrl: './timepicker.component.html',
})
export class TimepickerComponent {
  protected retainControl = new FormControl<unknown>('');
}
