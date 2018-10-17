// #region imports
import {
  Injectable
} from '@angular/core';

import {
  SkyAppLocaleInfo
} from './locale-info';
// #endregion

@Injectable()
export abstract class SkyLibResourcesProvider {

  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;

}
