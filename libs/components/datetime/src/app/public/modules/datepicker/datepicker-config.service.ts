import {
  Injectable
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

const moment = require('moment');
import 'moment/min/locales.min';

@Injectable()
export class SkyDatepickerConfigService {
  public startingDay: number = 0;
  public minDate: Date;
  public maxDate: Date;
  public dateFormat: string;

  constructor(private windowRefService: SkyWindowRefService) {
    let safeNavigator: any = this.windowRefService.getWindow().navigator;
    /*istanbul ignore next */
    let userLang: string = safeNavigator.languages && safeNavigator.languages[0] ||
      safeNavigator.language || safeNavigator.userLanguage || 'en';

    moment.locale(userLang);
    this.dateFormat = moment.localeData().longDateFormat('L');
  }
}
