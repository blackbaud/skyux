import { Component } from '@angular/core';

@Component({
  selector: 'sky-datepicker-input-box-test',
  templateUrl: './datepicker-input-box.component.fixture.html',
})
export class DatepickerInputBoxTestComponent {
  public dateFormat: string | undefined;
  public inputBoxHintText: string | undefined;
  public labelText = 'Input box test';
  public selectedDate: any;
}
