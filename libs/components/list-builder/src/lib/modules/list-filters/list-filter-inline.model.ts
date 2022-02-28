import { EventEmitter, TemplateRef } from '@angular/core';
import { ListItemModel } from '@skyux/list-builder-common';

/**
 * @internal
 */
export class SkyListFilterInlineModel {
  public name: string;
  public value: any;
  public defaultValue: any;
  public filterFunction: (item: ListItemModel, filter: any) => boolean;
  public onChange: EventEmitter<any> = new EventEmitter<any>();
  public template: TemplateRef<any>;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.filterFunction = data.filterFunction;
      this.value = data.value;
      this.template = data.template;
      this.defaultValue = data.defaultValue;
    }
  }

  public changed(value: any) {
    this.value = value;
    this.onChange.emit(value);
  }
}
