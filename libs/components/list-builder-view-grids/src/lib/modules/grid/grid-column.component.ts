import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

import { SkyGridLegacyColumnAlignment } from './types/grid-column-alignment';
import { SkyGridLegacyColumnDescriptionModelChange } from './types/grid-column-description-model-change';
import { SkyGridLegacyColumnHeadingModelChange } from './types/grid-column-heading-model-change';
import { SkyGridLegacyColumnInlineHelpPopoverModelChange } from './types/grid-column-inline-help-popover-model-change';

/**
 * Specifies the column information.
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
@Component({
  selector: 'sky-grid-column.legacy',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyGridLegacyColumnComponent implements OnChanges {
  /**
   * The horizontal alignment of the column's data and header.
   * Options include: `"left"`, `"center"`, and `"right"`.
   * @default "left"
   */
  @Input()
  public alignment: SkyGridLegacyColumnAlignment = 'left';

  /**
   * The description for the column.
   */
  @Input()
  public description: string;

  /**
   * Whether to disable the highlighting of search text in the column.
   * @default false
   */
  @Input()
  public excludeFromHighlighting: boolean;

  /**
   * The property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `id` or `field` property for every column,
   * but do not provide both. If `id` does not exist on a column, then `field` is the entry
   * for the grid `selectedColumnIds` array.
   */
  @Input()
  public field: string;

  /**
   * Text to display in the column header.
   */
  @Input()
  public heading: string;

  /**
   * Whether the column is initially hidden when grid `selectedColumnIds` are not provided.
   * @default false
   */
  @Input()
  public hidden: boolean;

  /**
   * The unique ID for the column. You must provide either the `id` or `field` property
   * for every column, but do not provide both. If `field` does not exist on a column,
   * then the `id` property retrieves cell information from an entry on the grid `data` array.
   */
  @Input()
  public id: string;

  /**
   * The template to display inside an inline help popup for this column.
   */
  @Input()
  public inlineHelpPopover: any;

  /**
   * Whether the column sorts the grid when users click the column header.
   * @default true
   */
  @Input()
  public isSortable = true;

  /**
   * Whether the column is locked. The intent is to display locked columns first
   * on the left side of the grid. If set to `true`, then users cannot drag the column
   * to another position and or drag other columns before the locked column.
   * @default false
   */
  @Input()
  public locked: boolean;

  /**
   * The search function to apply for the specific column. By default,
   * the column executes a string compare on the column data.
   * @default (value, searchText) => value.toString().toLowerCase().indexOf(searchText) !== -1
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('search')
  public searchFunction: (value: any, searchText: string) => boolean =
    this.search;

  /**
   * @internal
   */
  @Input()
  public type: string;

  /**
   * The template for a column. This can be assigned as a reference
   * to the `template` attribute, or it can be assigned as a child of the `template` element
   * inside the `sky-grid-column` component. The template has access to the `value` variable,
   * which contains the value passed to the column, and the `row` variable, which contains
   * the entire row data.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('template')
  public templateInput: TemplateRef<unknown>;

  /**
   * The width of the column in pixels.
   * If undefined, the column width is evenly distributed.
   */
  @Input()
  public width: number;

  public descriptionChanges: EventEmitter<string> = new EventEmitter<string>();

  public descriptionModelChanges =
    new EventEmitter<SkyGridLegacyColumnDescriptionModelChange>();

  public headingChanges: EventEmitter<string> = new EventEmitter<string>();

  public headingModelChanges =
    new EventEmitter<SkyGridLegacyColumnHeadingModelChange>();

  public inlineHelpPopoverModelChanges =
    new EventEmitter<SkyGridLegacyColumnInlineHelpPopoverModelChange>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<unknown>>;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['heading'] && changes['heading'].firstChange === false) {
      this.headingChanges.emit(this.heading);
      this.headingModelChanges.emit({
        value: this.heading,
        id: this.id,
        field: this.field,
      });
    }
    if (
      changes['description'] &&
      changes['description'].firstChange === false
    ) {
      this.descriptionChanges.emit(this.description);
      this.descriptionModelChanges.emit({
        value: this.description,
        id: this.id,
        field: this.field,
      });
    }
    if (
      changes['inlineHelpPopover'] &&
      changes['inlineHelpPopover'].firstChange === false
    ) {
      this.inlineHelpPopoverModelChanges.emit({
        value: this.inlineHelpPopover,
        id: this.id,
        field: this.field,
      });
    }
  }

  public get template(): TemplateRef<unknown> {
    if (this.templates.length > 0) {
      return this.templates.first;
    }

    return this.templateInput;
  }

  private search(value: any, searchText: string): boolean {
    if (value !== undefined && value !== null) {
      return value.toString().toLowerCase().indexOf(searchText) !== -1;
    }

    return false;
  }
}
