import { Component } from '@angular/core';

@Component({
  selector: 'app-date-pipe-demo',
  templateUrl: './date-pipe-demo.component.html',
})
export class DatePipeDemoComponent {
  public myDate = new Date('11/05/1955');
}
