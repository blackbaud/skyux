import { Component } from '@angular/core';

@Component({
  selector: 'datepicker-visual',
  templateUrl: './datepicker-visual.component.html'
})
export class DatepickerVisualComponent {
  public selectedDate: Date = new Date('4/4/2017');
}
