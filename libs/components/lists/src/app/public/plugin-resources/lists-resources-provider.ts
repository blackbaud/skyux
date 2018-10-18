import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '@skyux/i18n';

export class SkyListsResourcesProvider implements SkyLibResourcesProvider {
  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;
}
