import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

/**
 * Defines a single column in a `SkyDataGrid`. Add one `sky-data-grid-column` for each
 * column to render.
 * @preview
 */
@Component({
  selector: 'sky-data-grid-column',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGridColumn {
  /**
   * Whether the column is hidden.
   * @default false
   */
  public readonly columnHidden = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * The unique ID for the column. You must provide either the `columnId` or `field` property
   * for every column, but do not provide both. Use `columnId` when the column does not map directly to a field
   * in the data set.
   */
  public readonly columnId = input<string>();

  /**
   * The data type of the column used for sorting and rendering when a template is not provided.
   * @default 'text'
   */
  public readonly dataType = input<'text' | 'number' | 'date' | 'boolean'>(
    'text',
  );

  /**
   * The property to retrieve cell information from an entry on the grid `data` array.
   * You must provide either the `columnId` or `field` property for every column,
   * but do not provide both. When a column maps directly to a property on the data,
   * use `field`; the column's ID defaults to the `field` value.
   */
  public readonly field = input<string>();

  /**
   * When set, `flexWidth` takes precedence over `width` for sizing and works like
   * [CSS flex-grow](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow), where a column
   * with `flexWidth="2"` is twice the width of a column with `flexWidth="1"`, and `flexWidth="0"` does not auto-expand.
   * If `width` is also set, it acts as the column's minimum width.
   */
  public readonly flexWidth = input<number | undefined, unknown>(undefined, {
    transform: (value) => numberAttribute(value, undefined),
  });

  /**
   * Text to display in the column header.
   * @required
   */
  public readonly headingText = input.required<string>();

  /**
   * Whether to visually hide `headingText` while keeping it available to
   * assistive technologies. The header cell still renders, so its sorting and
   * resizing controls remain available.
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
   * Whether the column is locked. The intent is to display locked columns first
   * on the left side of the grid. If set to `true`, then users cannot drag the column
   * to another position or drag other columns before it.
   * @default false
   */
  public readonly locked = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether the column can be resized by dragging the column header border.
   * @default true
   */
  public readonly resizable = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  /**
   * Whether the column sorts the grid when users click the column header.
   * @default true
   */
  public readonly sortable = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  /**
   * The template for a column. This can be assigned as a reference
   * to the `template` input, or it can be assigned as an `<ng-template>` child
   * of the `sky-data-grid-column` component. The template has access to the `value` variable,
   * which contains the value passed to the column, and the `row` variable, which contains
   * the entire row data.
   */
  public readonly template = input<TemplateRef<unknown>>();

  /**
   * The width of the column in pixels. Used as the column's initial width; the
   * column can still be resized and is included when columns are sized to fit
   * the grid's width. When `flexWidth` is also set, `width` instead acts as the
   * column's minimum width. When no width is set, the column width is evenly distributed.
   */
  public readonly width = input<number | undefined, unknown>(undefined, {
    transform: (value) => numberAttribute(value, undefined),
  });

  /**
   * Whether text in this column should wrap to multiple lines.
   * @default false
   */
  public readonly wrapText = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly templateChild = contentChild(TemplateRef);

  constructor() {
    const logger = inject(SkyLogService);
    afterRenderEffect(() => {
      const columnId = this.columnId();
      const field = this.field();
      if (columnId && field) {
        logger.warn(
          `A <sky-data-grid-column> should have either a columnId or a field, but not both.`,
        );
      }
      if (!columnId && !field) {
        logger.warn(
          `A <sky-data-grid-column> must have a columnId or a field.`,
        );
      }
    });
  }

  /**
   * @internal
   */
  protected readonly cellTemplate = computed<TemplateRef<unknown> | undefined>(
    () => {
      const template = this.template();
      const templateChild = this.templateChild();
      return template || templateChild;
    },
  );
}
