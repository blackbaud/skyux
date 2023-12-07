import { SkyDataManagerSummary } from './data-manager-summary';

/**
 * @internal
 * A summary of the data displayed within the data manager and the source of the change.
 */
export interface SkyDataManagerSummaryChange {
  dataSummary: SkyDataManagerSummary;
  source: string;
}
