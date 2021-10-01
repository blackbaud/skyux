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

/**
 * Specifies the column information.
 */
@Component({
  selector: 'sky-grid-column',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyGridColumnComponent implements OnChanges {

  /**
   * Specifies the horizontal alignment of the column's data and header.
   * @default 'left'
   */
  @Input()
  public alignment: SkyGridColumnAlignment = 'left';

  /**
   * Specifies a description for the column.
   */
  @Input()
  public description: string;

  /**
   * Indicates whether to disable the highlighting of search text in the column.
   * @default false
   */
  @Input()
  public excludeFromHighlighting: boolean;

  /**
   * Specifies the property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `id` or `field` property for every column,
   * but do not provide both. If `id` does not exist on a column, then `field` is the entry
   * for the grid `selectedColumnIds` array.
   */
  @Input()
  public field: string;

  /**
   * Specifies text to display in the column header.
   */
  @Input()
  public heading: string;

  /**
   * Indicates whether the column is initially hidden when grid `selectedColumnIds` are not provided.
   * @default false
   */
  @Input()
  public hidden: boolean;

  /**
   * Specifies a unique ID for the column. You must provide either the `id` or `field` property
   * for every column, but do not provide both. If `field` does not exist on a column,
   * then the `id` property retrieves cell information from an entry on the grid `data` array.
   */
  @Input()
  public id: string;

  /**
   * Specifies a template to display inside an inline help popup for this column.
   */
  @Input()
  public inlineHelpPopover: any;

  /**
   * Indicates whether the column sorts the grid when users click the column header.
   * @default true
   */
  @Input()
  public isSortable: boolean = true;

  /**
   * Indicates whether the column is locked. The intent is to display locked columns first
   * on the left side of the grid. If set to `true`, then users cannot drag the column
   * to another position and or drag other columns before the locked column.
   * @default false
   */
  @Input()
  public locked: boolean;

  /**
   * Specifies a search function to apply for the specific column. By default,
   * the column executes a string compare on the column data.
   * @default (value, searchText) => value.toString().toLowerCase().indexOf(searchText) !== -1
   */
  /* tslint:disable-next-line:no-input-rename */
  @Input('search')
  public searchFunction: (value: any, searchText: string) => boolean = this.search;

  /**
   * @internal
   */
  @Input()
  public type: string;

  /**
   * Specifies a template for a column. This can be assigned as a reference
   * to the `template` attribute, or it can be assigned as a child of the `template` element
   * inside the `sky-grid-column` component. The template has access to the `value` variable,
   * which contains the value passed to the column, and the `row` variable, which contains
   * the entire row data.
   */
  /* tslint:disable-next-line:no-input-rename */
  @Input('template')
  public templateInput: TemplateRef<any>;

  /**
   * Specifies the width of the column in pixels.
   * If undefined, the column width is evenly distributed.
   */
  @Input()
  public width: number;

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
