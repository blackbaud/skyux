import { Component } from '@angular/core';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-timepicker',
  imports: [SkyInputBoxModule, SkyPageModule, SkyTimepickerModule],
  templateUrl: './timepicker.component.html',
})
export class TimepickerComponent {}
