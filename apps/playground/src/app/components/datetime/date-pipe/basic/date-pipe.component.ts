import { Component, OnInit } from '@angular/core';
import { SkyDatePipe } from '@skyux/datetime';

@Component({
  selector: 'app-date-pipe',
  templateUrl: './date-pipe.component.html',
})
export class DatePipeComponent implements OnInit {
  public format = 'short';

  // Pre-defined format options from SkyDateFormatUtility.
  public formatList: string[] = [
    'medium',
    'short',
    'fullDate',
    'longDate',
    'mediumDate',
    'shortDate',
    'mediumTime',
    'shortTime',
  ];

  public locale = 'en-US';

  public localeList: string[] = [
    'de-DE',
    'fr-FR',
    'en-CA',
    'es-ES',
    'en-GB',
    'en-US',
    'es-MX',
    'it-IT',
    'ja-JP',
    'pt-BR',
    'ru-RU',
    'zh-CN',
  ];

  public myDate = new Date(1955, 10, 5);

  constructor(private datePipe: SkyDatePipe) {}

  public ngOnInit(): void {
    const result = this.datePipe.transform(
      new Date('01/01/2019'),
      'short',
      'en-US'
    );
    console.log('Result from calling pipe directly:', result);
  }

  public dateForDisplay(): string {
    return JSON.stringify(this.myDate);
  }

  public onResetClick(): void {
    this.locale = 'en-US';
    this.format = 'short';
  }
}
