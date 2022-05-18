import { TemplateRef } from '@angular/core';

/**
 * @internal
 * @deprecated
 */
export class ListToolbarItemModel {
  public index = -1;
  public template: TemplateRef<unknown>;
  public location: string;
  public view: string;

  public id: string;

  constructor(data?: any) {
    if (data) {
      this.index = data.index;
      this.template = data.template;
      this.location = data.location;
      this.view = data.view;
      this.id = data.id;
    }
  }
}
