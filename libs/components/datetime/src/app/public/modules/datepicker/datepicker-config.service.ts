import {
  Injectable
} from '@angular/core';

import 'moment/min/locales.min';

@Injectable()
export class SkyDatepickerConfigService {

  public dateFormat: string;

  public maxDate: Date;

  public minDate: Date;

  public startingDay = 0;

}
