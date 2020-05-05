import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyDatepickerConfigService {

  public dateFormat: string;

  public maxDate: Date;

  public minDate: Date;

  public startingDay = 0;

}
