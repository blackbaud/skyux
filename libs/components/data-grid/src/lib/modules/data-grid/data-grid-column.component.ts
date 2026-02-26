import {
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

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
   * The unique ID for the column. You must provide either the `columnId` or `field` property
   * for every column, but do not provide both. Use `columnId` when the column does not map directly to a field
   * in the data set.
   */
  public readonly columnId = input<string>();

  /**
   * The data type of the column used for filtering, sorting, and rendering when a template is not provided.
   * @default 'text'
   */
  public readonly dataType = input<'text' | 'number' | 'date' | 'boolean'>(
    'text',
  );

  /**
   * The description for the column.
   */
  public readonly description = input<string>();

  /**
   * The property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `columnId` or `field` property for every column,
   * but do not provide both. If `columnId` does not exist on a column, then `field` is the entry
   * for the grid `selectedColumnIds` array.
   */
  public readonly field = input<string>();

  /**
   * When set, `flexWidth` overrides `width` and works like
   * [CSS flex-grow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-grow), where a column
   * with `flexWidth="2"` is twice the width of a column with `flexWidth="1"`, and `flexWidth="0"` does not auto-expand.
   */
  public readonly flexWidth = input<number, unknown>(-1, {
    transform: (value) => numberAttribute(value, -1),
  });

  /**
   * Text to display in the column header.
   */
  public readonly headingText = input.required<string>();

  /**
   * Whether to prevent `heading` text from being visibly displayed.
   * @default false
   */
  public readonly headingHidden = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

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
  public readonly resizable = input<boolean>(true);

  /**
   * Whether the column sorts the grid when users click the column header.
   * @default true
   */
  public readonly sortable = input<boolean>(true);

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
   * The width of the column in pixels. When no width is set, the column width is evenly distributed.
   */
  public readonly width = input<number, unknown>(0, {
    transform: (value) => numberAttribute(value, 0),
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
  public readonly filterOperator = input<
    SkyDataGridFilterOperator | undefined
  >();

  protected readonly templateChild = contentChild(TemplateRef);

  constructor() {
    const logger = inject(SkyLogService);
    effect(() => {
      const columnId = this.columnId();
      const field = this.field();
      if (columnId && field) {
        logger.warn(
          `A <sky-data-grid-column> should have either a columnId or a field, but not both.`,
        );
      }
    });
  }

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
