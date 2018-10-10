import { Component, Input, ContentChildren, TemplateRef, QueryList } from '@angular/core';
const moment = require('moment');

@Component({
  selector: 'sky-list-toolbar-item',
  template: '<ng-content></ng-content>'
})
export class SkyListToolbarItemComponent {
  @Input() public id: string = moment().toDate().getTime().toString();
  @Input() public index: number = -1;
  @Input() public location: string = 'left';
  @ContentChildren(TemplateRef) private templates: QueryList<TemplateRef<any>>;
  public get template(): TemplateRef<any> {
    return this.templates.length > 0 ? this.templates.first : undefined;
  }
}
