import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDateRangePickerModule } from '@skyux/datetime';

@Component({
  selector: 'app-sectioned-form-date-form-demo',
  templateUrl: './sectioned-form-date-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyDateRangePickerModule],
})
export class SectionedFormDateFormDemoComponent {}
