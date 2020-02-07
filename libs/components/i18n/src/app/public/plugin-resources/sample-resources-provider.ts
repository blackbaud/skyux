import {
  SkyAppLocaleInfo
} from '../modules/i18n/locale-info';

import {
  SkyLibResourcesProvider
} from '../modules/i18n/lib-resources-provider';

export class SkySampleResourcesProvider implements SkyLibResourcesProvider {
  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;
}
