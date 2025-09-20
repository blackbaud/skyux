// #region imports
import { SkyAppLocaleInfo } from './locale-info';

// #endregion

/**
 * @deprecated `SkyLibResourcesProvider` is no longer needed and will be removed in a future major version of SKY UX.
 * @internal
 */
export abstract class SkyLibResourcesProvider {
  public abstract getString: (
    localeInfo: SkyAppLocaleInfo,
    name: string,
  ) => string | undefined;
}
