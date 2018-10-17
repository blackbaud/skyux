import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '../modules';

export class SkySampleResourcesProvider implements SkyLibResourcesProvider {
  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;
}
