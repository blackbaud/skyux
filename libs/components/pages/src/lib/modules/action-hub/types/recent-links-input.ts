import { SkyRecentlyAccessedGetLinksArgs } from '@skyux/router';

import { SkyRecentLink } from './recent-link';

export type SkyRecentLinksInput =
  | SkyRecentLink[]
  | 'loading'
  | SkyRecentlyAccessedGetLinksArgs
  | undefined;
