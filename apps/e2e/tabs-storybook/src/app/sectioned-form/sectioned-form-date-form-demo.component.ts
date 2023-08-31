import { Component } from '@angular/core';
import { SkyDateRangePickerModule } from '@skyux/datetime';

@Component({
  standalone: true,
  selector: 'app-sectioned-form-date-form-demo',
  templateUrl: './sectioned-form-date-form-demo.component.html',
  imports: [SkyDateRangePickerModule],
})
export class SectionedFormDateFormDemoComponent {}
