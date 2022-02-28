import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';

let idIndex = 0;

/**
 * Defines a toolbar item for the list toolbar.
 */
@Component({
  selector: 'sky-list-toolbar-item',
  template: '<ng-content></ng-content>',
})
export class SkyListToolbarItemComponent {
  /**
   * Specifies the ID of the item.
   */
  @Input() public id: string = `sky-list-toolbar-item-${++idIndex}`;
  /**
   * Specifies the index of the item at the given item location.
   * @default -1
   */
  @Input() public index: number = -1;
  /**
   * Specifies the toolbar location of the item. The valid options are `"left"`,
   * `"center"`, and `"right"`.
   * @default "left"
   */
  @Input() public location: string = 'left';
  @ContentChildren(TemplateRef) private templates: QueryList<TemplateRef<any>>;
  public get template(): TemplateRef<any> {
    return this.templates.length > 0 ? this.templates.first : undefined;
  }
}
