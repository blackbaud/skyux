/**
 * Contains data about the selected items in the list.
 */
export class ListSelectedModel {
  /**
   * A map of key value pairs that consists of IDs for selected items
   * and boolean values for their selected states.
   */
  public selectedIdMap: Map<string, boolean>;

  constructor() {
    this.selectedIdMap = new Map<string, boolean>();
  }
}
