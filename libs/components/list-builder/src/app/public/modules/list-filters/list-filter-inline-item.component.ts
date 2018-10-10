import {
  Component,
  Input,
  ContentChildren,
  TemplateRef,
  QueryList,
  OnInit,
  EventEmitter
} from '@angular/core';

import { ListItemModel } from '../list/state';

@Component({
  selector: 'sky-list-filter-inline-item',
  template: '<ng-content></ng-content>'
})
export class SkyListFilterInlineItemComponent implements OnInit {
  @Input()
  public name: string;

  @Input()
  public value: any;

  @Input()
  public defaultValue: any;

  /* tslint:disable:no-input-rename */
  @Input('filter')
  public filterFunction: (item: ListItemModel, filter: any) => boolean;

  @Input('template')
  public templateInput: TemplateRef<any>;
  /* tslint:enable:no-input-rename */

  public onChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<any>>;

  public ngOnInit() {
    if (this.name === undefined || this.name.length === 0) {
      throw new Error('Inline filter requires a name.');
    }
  }

  public get template(): TemplateRef<any> {
      return this.templates.length > 0 ? this.templates.first : this.templateInput;
  }
}
