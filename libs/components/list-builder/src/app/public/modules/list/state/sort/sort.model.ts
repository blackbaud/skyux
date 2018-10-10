import { ListSortLabelModel } from './label.model';
import { ListSortFieldSelectorModel } from './field-selector.model';

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
