import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import { ListSortLabelModel } from './label.model';

export class ListSortModel {
  public available: Array<ListSortLabelModel> = [];
  public global: Array<ListSortLabelModel> = [];
  public fieldSelectors: Array<ListSortFieldSelectorModel> = [];

  constructor(data?: any) {
    if (data) {
      this.available = data.available;
      this.global = data.global;
      this.fieldSelectors = data.fieldSelectors;
    }
  }
}
