import { SkyPageLink } from './page-link';

/**
 * Link that also has a date field to sort by.
 *
 * @property lastAccessed Date Object or ISO-8601 string.
 */
export interface SkyRecentLink extends SkyPageLink {
  lastAccessed: Date | string;
}
