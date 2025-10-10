import { SkyFilterAdapterData } from './filter-adapter-data';

/**
 * Represents a change to the filter adapter data including the source that triggered the change.
 * @internal
 */
export interface SkyFilterAdapterDataChange {
  data: SkyFilterAdapterData;
  source: string;
}
