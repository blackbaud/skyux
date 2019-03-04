import {
  Component
} from '@angular/core';

@Component({
  selector: 'date-pipe-visual',
  templateUrl: './date-pipe-visual.component.html'
})
export class DatePipeVisualComponent {
  public dateValue1 = new Date('01/01/2019');
  public dateValue2 = new Date('02/02/2019');
  public dateValue3 = new Date('03/03/2019');
  public format: string;
  public locale: string;

  public toggleLocale(): void {
    if (this.locale === 'en-GB') {
      this.locale = 'en-US';
    } else {
      this.locale = 'en-GB';
    }
  }

  public toggleFormat(): void {
    if (this.format === 'medium') {
      this.format = 'short';
    } else {
      this.format = 'medium';
    }
  }
}
