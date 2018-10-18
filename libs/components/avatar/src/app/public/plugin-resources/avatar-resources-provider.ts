import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '@skyux/i18n';

export class SkyAvatarResourcesProvider implements SkyLibResourcesProvider {
  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;
}
