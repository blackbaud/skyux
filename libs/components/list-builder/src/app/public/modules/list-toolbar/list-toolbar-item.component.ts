import { Component, Input, ContentChildren, TemplateRef, QueryList } from '@angular/core';

let idIndex = 0;

@Component({
  selector: 'sky-list-toolbar-item',
  template: '<ng-content></ng-content>'
})
export class SkyListToolbarItemComponent {
  @Input() public id: string = `sky-list-toolbar-item-${++idIndex}`;
  @Input() public index: number = -1;
  @Input() public location: string = 'left';
  @ContentChildren(TemplateRef) private templates: QueryList<TemplateRef<any>>;
  public get template(): TemplateRef<any> {
    return this.templates.length > 0 ? this.templates.first : undefined;
  }
}
