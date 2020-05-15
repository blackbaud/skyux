import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef
} from '@angular/core';

import {
  SkyGridColumnAlignment
} from './types/grid-column-alignment';

import {
  SkyGridColumnDescriptionModelChange
} from './types/grid-column-description-model-change';

import {
  SkyGridColumnHeadingModelChange
} from './types/grid-column-heading-model-change';

import {
  SkyGridColumnInlineHelpPopoverModelChange
} from './types/grid-column-inline-help-popover-model-change';

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

  /**
   * Specifies a template to display inside an inline help popup for this column.
   * This property accepts a SkyPopoverComponent.
   */
  @Input()
  public inlineHelpPopover: any;

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

  /**
   * Specifies the horizontal alignment of the column's data and header.
   * @default 'left'
   */
  @Input()
  public alignment: SkyGridColumnAlignment = 'left';

  /* tslint:disable:no-input-rename */
  @Input('search')
  public searchFunction: (value: any, searchText: string) => boolean = this.search;

  @Input('template')
  public templateInput: TemplateRef<any>;
  /* tslint:enable:no-input-rename */

  public descriptionChanges: EventEmitter<string> = new EventEmitter<string>();

  public descriptionModelChanges = new EventEmitter<SkyGridColumnDescriptionModelChange>();

  public headingChanges: EventEmitter<string> = new EventEmitter<string>();

  public headingModelChanges = new EventEmitter<SkyGridColumnHeadingModelChange>();

  public inlineHelpPopoverModelChanges = new EventEmitter<SkyGridColumnInlineHelpPopoverModelChange>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<any>>;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.heading && changes.heading.firstChange === false) {
      this.headingChanges.emit(this.heading);
      this.headingModelChanges.emit({
        value: this.heading,
        id: this.id,
        field: this.field
      });
    }
    if (changes.description && changes.description.firstChange === false) {
      this.descriptionChanges.emit(this.description);
      this.descriptionModelChanges.emit({
        value: this.description,
        id: this.id,
        field: this.field
      });
    }
    if (changes.inlineHelpPopover && changes.inlineHelpPopover.firstChange === false) {
      this.inlineHelpPopoverModelChanges.emit({
        value: this.inlineHelpPopover,
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
