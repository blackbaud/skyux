import { ListToolbarItemModel } from './toolbar-item.model';

/**
 * @internal
 * @deprecated
 */
export class ListToolbarModel {
  public exists: boolean;
  public disabled: boolean;
  public items: ListToolbarItemModel[] = [];
  public type: string;
  public showMultiselectToolbar = false;

  constructor(data?: any) {
    if (data) {
      this.exists = data.exists;
      this.disabled = data.disabled;
      this.items = data.items;
      this.type = data.type;
      this.showMultiselectToolbar = data.showMultiselectToolbar;
    }
  }
}
