import { ListItemModel } from '@skyux/list-builder-common';

/**
 * @deprecated
 */
export class ListDataResponseModel {
  /**
   * The total number of records in the list.
   */
  public count: number;
  /**
   * An array of the items returned. For information about `ListItemModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  public items: ListItemModel[];

  constructor(data?: any) {
    if (data !== undefined) {
      this.count = data.count;
      this.items = data.items;
    }
  }
}
