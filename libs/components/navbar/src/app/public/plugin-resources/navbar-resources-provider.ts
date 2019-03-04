import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '@skyux/i18n';

export class SkyNavbarResourcesProvider implements SkyLibResourcesProvider {

  public getString(localeInfo: SkyAppLocaleInfo, name: string) {
    return name;
  }

}
