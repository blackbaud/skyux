import { SkyRecentlyAccessedGetLinksArgs } from '@skyux/router';

import { SkyRecentLink } from './recent-link';

/**
 * Recently accessed links to display in a link list component.
 */
export type SkyRecentLinksInput =
  | SkyRecentLink[]
  | 'loading'
  | SkyRecentlyAccessedGetLinksArgs
  | undefined;
