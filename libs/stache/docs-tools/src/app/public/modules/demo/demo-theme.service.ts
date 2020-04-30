import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyThemeSettings
} from '@skyux/theme';

@Injectable()
export class SkyDocsDemoThemeService {

  public readonly supportsTheming = new BehaviorSubject<boolean>(false);

  public readonly themeSettings = new BehaviorSubject<SkyThemeSettings>(undefined);

}
