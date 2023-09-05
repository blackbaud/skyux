import { SkyPageLink } from './page-link';

/**
 * Link that also has a date field to sort by.
 *
 * @property lastAccessed The date when the link was last accessed. Valid types are a Date object or ISO-8601 string.
 */
export interface SkyRecentLink extends SkyPageLink {
  lastAccessed: Date | string;
}
