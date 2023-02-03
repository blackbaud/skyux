import { ListItemModel } from '@skyux/list-builder-common';

export class ListFilterModel {
  /**
   * The name of the filter.
   * @required
   */
  public name: string;

  /**
   * The label for the filter's summary item.
   * The label defaults to the `value` of the filter.
   */
  public label: string;

  /**
   * Whether users can dismiss the filter's summary item.
   * @default true
   */
  public dismissible = true;

  /**
   * The current value of the filter.
   */
  public value: any;

  /**
   * The default value of the filter. When a filter equals the
   * default value, the filter does not affect the list.
   */
  public defaultValue: any;

  /**
   * The function that determines whether items are filtered.
   * This property is required when using an in-memory data provider.
   * For information about `ListItemModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  public filterFunction: (item: ListItemModel, filter: any) => boolean;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.label = data.label;
      this.filterFunction = data.filterFunction;
      this.value = data.value;
      this.dismissible = data.dismissible;
      this.defaultValue = data.defaultValue;
    }
  }
}
