import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';

import { ListSortLabelModel } from './label.model';

/**
 * A set of fields to sort by.
 * @deprecated
 */
export class ListSortModel {
  /**
   * The list of available views to sort.
   */
  public available: Array<ListSortLabelModel> = [];
  /**
   * Whether the sort applies to all list views.
   */
  public global: Array<ListSortLabelModel> = [];
  /**
   * The fields to sort.
   * For information about `ListSortFieldSelectorModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  public fieldSelectors: Array<ListSortFieldSelectorModel> = [];

  constructor(data?: any) {
    if (data) {
      this.available = data.available;
      this.global = data.global;
      this.fieldSelectors = data.fieldSelectors;
    }
  }
}
