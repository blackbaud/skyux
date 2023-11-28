import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  ],
  templateUrl: './timepicker.component.html',
})
export class TimepickerComponent {}
