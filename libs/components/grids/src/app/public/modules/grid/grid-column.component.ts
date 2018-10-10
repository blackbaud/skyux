import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  QueryList
} from '@angular/core';

import {
  SkyGridColumnHeadingModelChange
} from './types';

@Component({
  selector: 'sky-grid-column',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyGridColumnComponent implements OnChanges {
  @Input()
  public id: string;

  @Input()
  public heading: string;

  @Input()
  public width: number;

  @Input()
  public hidden: boolean;

  @Input()
  public locked: boolean;

  @Input()
  public field: string;

  @Input()
  public type: string;

  @Input()
  public description: string;

  @Input()
  public isSortable: boolean = true;

  @Input()
  public excludeFromHighlighting: boolean;

  /* tslint:disable:no-input-rename */
  @Input('search')
  public searchFunction: (value: any, searchText: string) => boolean = this.search;

  @Input('template')
  public templateInput: TemplateRef<any>;
  /* tslint:enable:no-input-rename */

  public headingChanges: EventEmitter<string> = new EventEmitter<string>();
  public headingModelChanges = new EventEmitter<SkyGridColumnHeadingModelChange>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<any>>;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.heading && changes.heading.firstChange === false) {
      this.headingChanges.emit(this.heading);
      this.headingModelChanges.emit({
        value: this.heading,
        id: this.id,
        field: this.field
      });
    }
  }

  public get template(): TemplateRef<any> {
    if (this.templates.length > 0) {
      return this.templates.first;
    }

    return this.templateInput;
  }

  private search(value: any, searchText: string): boolean {
    /* tslint:disable:no-null-keyword */
    if (value !== undefined && value !== null) {
      return value.toString().toLowerCase().indexOf(searchText) !== -1;
    }
    /* tslint:enable */

    return false;
  }
}
