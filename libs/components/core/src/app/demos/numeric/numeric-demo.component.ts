import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  of
} from 'rxjs';

import {
  SkyNumericService
} from '../../public/public_api';

class MockLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo() {
    return of({
      locale: 'es'
    });
  }
}

@Component({
  selector: 'sky-numeric-demo',
  templateUrl: './numeric-demo.component.html',
  styleUrls: ['./numeric-demo.component.scss'],
  providers: [
    { provide: SkyAppLocaleProvider, useClass: MockLocaleProvider }
  ]
})
export class SkyNumericDemoComponent implements OnInit {

  public locale: string = 'en-US';

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
    private numericService: SkyNumericService
  ) {}

  public ngOnInit(): void {
    const quantity = 40.50;
    const formatted = this.numericService.formatNumber(quantity, {
      digits: 2,
      format: 'currency',
      iso: 'USD'
    });

    console.log(`The number, ${quantity}, is formatted as ${formatted}.`);
  }
}
