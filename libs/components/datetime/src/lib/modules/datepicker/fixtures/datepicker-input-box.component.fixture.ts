import { Component, input, model } from '@angular/core';

@Component({
  selector: 'sky-datepicker-input-box-test',
  templateUrl: './datepicker-input-box.component.fixture.html',
  standalone: false,
})
export class DatepickerInputBoxTestComponent {
  public dateFormat = input<string | undefined>(undefined);
  public inputBoxHintText = input<string | undefined>(undefined);
  public labelText = input('Input box test');
  public selectedDate = model<any>(undefined);
}
