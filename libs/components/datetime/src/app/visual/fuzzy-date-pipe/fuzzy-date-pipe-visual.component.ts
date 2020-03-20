import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyFuzzyDatePipe
} from '../../public';

import {
  SkyFuzzyDate
} from '../../public/modules/datepicker/fuzzy-date';

@Component({
  selector: 'fuzzy-date-pipe-visual',
  templateUrl: './fuzzy-date-pipe-visual.component.html'
})
export class FuzzyDatePipeVisualComponent implements OnInit {

  public fuzzyDate: SkyFuzzyDate = {
    month: 11,
    year: 1955
  };

  public format: string;

  public locale: string;

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
    'zh-CN'
  ];

  constructor(
    private datePipe: SkyFuzzyDatePipe
  ) { }

  public ngOnInit(): void {
    const result = this.datePipe.transform({ month: 11, year: 1955 }, 'MMMM y', 'en-US');
    console.log('Result from calling pipe directly:', result);
  }

  public dateForDisplay(): string {
    return JSON.stringify(this.fuzzyDate);
  }

  public onResetClick(): void {
    this.locale = undefined;
    this.format = 'MMM y';
  }
}
