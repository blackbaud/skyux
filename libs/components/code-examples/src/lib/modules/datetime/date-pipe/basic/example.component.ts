import { Component } from '@angular/core';
import { SkyDatePipeModule } from '@skyux/datetime';

@Component({
  selector: 'app-datetime-date-pipe-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyDatePipeModule],
})
export class DatetimeDatePipeBasicExampleComponent {
  protected myDate = new Date('11/05/1955');
}
