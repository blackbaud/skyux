import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';

import { ListSortLabelModel } from './label.model';

/**
 * Specifies a set of fields to sort by.
 * @deprecated
 */
export class ListSortModel {
  /**
   * The list of available views to sort.
   */
  public available: ListSortLabelModel[] = [];
  /**
   * The list views that the sort applies to.
   */
  public global: ListSortLabelModel[] = [];
  /**
   * The fields to sort.
   * For information about `ListSortFieldSelectorModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  public fieldSelectors: ListSortFieldSelectorModel[] = [];

  constructor(data?: any) {
    if (data) {
      this.available = data.available;
      this.global = data.global;
      this.fieldSelectors = data.fieldSelectors;
    }
  }
}
