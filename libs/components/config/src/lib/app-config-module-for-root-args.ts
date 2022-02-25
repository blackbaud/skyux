import { SkyuxConfigHost } from './config';

import { SkyuxConfigParams } from './config-params';

export interface SkyAppConfigModuleForRootArgs {
  host?: SkyuxConfigHost;

  params?: SkyuxConfigParams;
}
