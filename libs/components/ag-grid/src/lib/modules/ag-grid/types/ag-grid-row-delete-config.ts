/**
 * Information for internally tracking what inline deletes are currently shown.
 * @internal
 */
export interface SkyAgGridRowDeleteConfig {
  /** The id of the data in the row. */
  id: string;
  /** The pending status of the inline delete. */
  pending: boolean;
}
