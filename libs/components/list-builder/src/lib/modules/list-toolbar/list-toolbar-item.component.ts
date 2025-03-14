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
 * @deprecated
 */
@Component({
  selector: 'sky-list-toolbar-item',
  template: '<ng-content />',
  standalone: false,
})
export class SkyListToolbarItemComponent {
  /**
   * The ID of the item.
   */
  @Input() public id = `sky-list-toolbar-item-${++idIndex}`;
  /**
   * The index of the item at the given item location.
   * @default -1
   */
  @Input() public index = -1;
  /**
   * The toolbar location of the item. The valid options are `"left"`,
   * `"center"`, and `"right"`.
   * @default "left"
   */
  @Input() public location = 'left';
  @ContentChildren(TemplateRef) private templates: QueryList<
    TemplateRef<unknown>
  >;
  public get template(): TemplateRef<unknown> {
    return this.templates.length > 0 ? this.templates.first : undefined;
  }
}
