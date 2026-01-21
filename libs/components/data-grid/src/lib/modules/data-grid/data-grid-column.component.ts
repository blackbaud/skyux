import {
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  input,
  numberAttribute,
} from '@angular/core';

import { SkyDataGridFilterOperator } from '../types/data-grid-filter-operator';

/**
 * Specifies the column information.
 * @preview
 */
@Component({
  selector: 'sky-data-grid-column',
  template: '',
})
export class SkyDataGridColumnComponent {
  /**
   * The description for the column.
   */
  public readonly description = input<string>();

  /**
   * The property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `id` or `field` property for every column,
   * but do not provide both. If `id` does not exist on a column, then `field` is the entry
   * for the grid `selectedColumnIds` array.
   */
  public readonly field = input<string>();

  /**
   * When set to a value greater than `-1`, it overrides `width` and works like
   * [CSS flex-grow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-grow), where a column
   * with `flexWidth="2"` is twice the width of a column with `flexWidth="1"`, and `flexWidth="0"` does not auto-expand.
   * @default -1
   */
  public readonly flexWidth = input<number, unknown>(-1, {
    transform: numberAttribute,
  });

  /**
   * Text to display in the column header.
   */
  public readonly heading = input<string>();

  /**
   * Whether to prevent `heading` text from being visibly displayed.
   * @default false
   */
  public readonly headingHidden = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The unique ID for the column. You must provide either the `columnId` or `field` property
   * for every column, but do not provide both. Use `columnId` when the column does not map directly to a field
   * in the data set.
   */
  public readonly columnId = input<string>();

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  public readonly helpPopoverTitle = input<string>();

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the column header. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  public readonly helpPopoverContent = input<string | TemplateRef<unknown>>();

  /**
   * Whether the column is initially hidden when grid `selectedColumnIds` are not provided.
   * @default false
   */
  public readonly hidden = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether the column can be resized by dragging the column header border.
   * @default true
   */
  public readonly isResizable = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  /**
   * Whether the column sorts the grid when users click the column header.
   * @default true
   */
  public readonly isSortable = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  /**
   * Whether the column is locked. The intent is to display locked columns first
   * on the left side of the grid. If set to `true`, then users cannot drag the column
   * to another position and or drag other columns before the locked column.
   * @default false
   */
  public readonly locked = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The template for a column. This can be assigned as a reference
   * to the `template` attribute, or it can be assigned as a child of the `template` element
   * inside the `sky-grid-column` component. The template has access to the `value` variable,
   * which contains the value passed to the column, and the `row` variable, which contains
   * the entire row data.
   */
  public readonly template = input<TemplateRef<unknown>>();

  /**
   * The data type of the column used for filtering, sorting, and rendering when a template is not provided.
   * @default 'text'
   */
  public readonly type = input<'text' | 'number' | 'date' | 'boolean'>('text');

  /**
   * The width of the column in pixels. When set to `0`, the column width is evenly distributed.
   * @default 0
   */
  public readonly width = input<number, unknown>(0, {
    transform: numberAttribute,
  });

  /**
   * Whether text in this column should wrap to multiple lines. For best performance, large grids should set a `height`
   * and not enable `wrapText` on any column so that rows can be virtually drawn as needed. Not setting a `height` or
   * enabling `wrapText` forces the grid to draw every row in order to determine the scroll height.
   * @default false
   */
  public readonly wrapText = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The filter ID that maps this column to a filter bar item.
   * When set, changes to the corresponding filter will apply to this column.
   * Defaults to the column's `field` value.
   */
  public readonly filterId = input<string>();

  /**
   * The filter operator to use when applying the filter.
   *
   * Defaults based on column type:
   *
   * - text: 'contains'
   * - number: 'equals'
   * - date: 'equals'
   */
  public readonly filterOperator = input<SkyDataGridFilterOperator>();

  protected readonly templateChild = contentChild(TemplateRef);

  /**
   * @internal
   */
  public readonly cellTemplate = computed<TemplateRef<unknown> | undefined>(
    () => {
      const template = this.template();
      const templateChild = this.templateChild();
      return template || templateChild;
    },
  );
}
