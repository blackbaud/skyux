import {
  Component
} from '@angular/core';

@Component({
  selector: 'date-pipe-test',
  templateUrl: './date-pipe.component.fixture.html'
})
export class DatePipeTestComponent {
  public dateValue: any = new Date('01/01/2000');
  public format: string;
  public locale: string;
}
