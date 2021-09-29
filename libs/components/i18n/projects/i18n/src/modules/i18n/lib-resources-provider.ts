// #region imports
import {
  SkyAppLocaleInfo
} from './locale-info';
// #endregion

export abstract class SkyLibResourcesProvider {

  public abstract getString: (localeInfo: SkyAppLocaleInfo, name: string) => string | undefined;

}
