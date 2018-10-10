import { ListItemModel } from '../../../list/state/items/item.model';

export class ListFilterModel {
  public name: string;
  public label: string;
  public dismissible: boolean = true;
  public value: any;
  public defaultValue: any;

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
