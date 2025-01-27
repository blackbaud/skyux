import { SkyDataManagerFilterData } from './models/data-manager-filter-data';

// TODO: In a future breaking change convert this to an interface
/**
 * Sets the state of the filters.
 */
export class SkyDataManagerFilterModalContext {
  /**
   * Sets the state of the filters.
   */
  public filterData: SkyDataManagerFilterData | undefined;
}
