import {
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyFilterStateFilterItem, SkyPagingModule } from '@skyux/lists';

import { AgGridAngular } from 'ag-grid-angular';

import { SkyDataGridFilterValue } from '../types/data-grid-filter-value';
import { SkyDataGridRowDeleteCancelArgs } from '../types/data-grid-row-delete-cancel-args';
import { SkyDataGridRowDeleteConfirmArgs } from '../types/data-grid-row-delete-confirm-args';

import { SkyDataGridDirective } from './data-grid.directive';

/**
 * @preview
 */
@Component({
  selector: 'sky-data-grid-lite',
  imports: [
    AgGridAngular,
    SkyAgGridModule,
    SkyPagingModule,
    SkyViewkeeperModule,
    SkyWaitModule,
  ],
  templateUrl: './data-grid-lite.component.html',
  styleUrl: './data-grid.component.css',
  hostDirectives: [
    {
      directive: SkyDataGridDirective,
      inputs: [
        'appliedFilters',
        'compact',
        'data',
        'fit',
        'height',
        'multiselect',
        'pageQueryParam',
        'pageSize',
        'rowDeleteIds',
        'rowHighlightedId',
        'selectedRowIds',
        'stacked',
        'topScrollEnabled',
        'width',
        'useInternalFilters',
      ],
      outputs: [
        'rowCountChange',
        'rowDeleteCancel',
        'rowDeleteConfirm',
        'rowDeleteIdsChange',
        'selectedRowIdsChange',
      ],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGridLiteComponent<
  T extends Record<'id', string> = Record<'id', string> & object,
> {
  /**
   * The filter state from a
   * [`SkyFilterBarComponent`](https://developer.blackbaud.com/skyux/components/filter-bar?docs-active-tab=development#class_sky-filter-bar-component).
   * When provided, filters are automatically applied to columns that have matching `filterId` values using the
   * respective `SkyDataGridColumnComponent`'s `filterOperator` as the comparator. To use the built-in filters, the
   * filter values are:
   *
   * - For a boolean column, use a `boolean` with `'equals'` or `'notEqual'` as the operator.
   * - For a date column, use a [`SkyDateRange`](https://developer.blackbaud.com/skyux/components/date-range-picker?docs-active-tab=development#interface_sky-date-range) or `Date`.
   * - For a number column, use a `SkyDataGridNumberRangeFilterValue` or a `number`.
   * - For a text column, use `string` or `string[]` as the filter value to match one or more text values.
   *
   * To provide custom filtering functions, use the `externalRowCount` input and update the `data` input when filters change.
   */
  public readonly appliedFilters = input<
    SkyFilterStateFilterItem<SkyDataGridFilterValue>[]
  >([]);

  /**
   * Enable a compact layout for the grid when using modern theme. Compact layout uses
   * a smaller font size and row height to display more data in a smaller space.
   * @default false
   */
  public readonly compact = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The data for the grid. Each item requires an `id`, and other properties should map to a `field` of the grid columns.
   * When `data` is `null` or `undefined`, the grid will show a loading indicator, and when `data` is an empty array,
   * the grid will show a "no rows" message.
   */
  public readonly data = input<T[] | null | undefined>();

  /**
   * How the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default 'width'
   */
  public readonly fit = input<'width' | 'scroll'>('width');

  /**
   * The height of the grid in CSS pixels. For best performance, large grids should set a `height` value and not enable
   * `wrapText` on any column so that rows can be virtually drawn as needed. When `wrapText` is  enabled on any column,
   * or when `height` is not set, the grid needs to build every row in order to determine the scroll height, creating
   * hundreds or thousands of invisible DOM elements and slowing down the browser.
   */
  public readonly height = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * Whether to enable the multiselect feature to display a column of
   * checkboxes on the left side of the grid. You can specify a unique ID with
   * the `multiselectRowId` property, but multiselect defaults to the `id` property on
   * the `data` object.
   * @default false
   */
  public readonly multiselect = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The number of items to display per page. Setting this value enables pagination.
   */
  public readonly pageSize = input<number, unknown>(0, {
    transform: (value: unknown) => coerceNumberProperty(value, 0),
  });

  /**
   * The query parameter name that stores the current page number.
   * When set, the grid syncs page changes to the URL for deep linking, and there should only be one grid on the page.
   */
  public readonly pageQueryParam = input<string | undefined>();

  /**
   * The ID of the row to highlight. The ID matches the `multiselectRowId` property
   * of the `data` object. Typically, this property is used in conjunction with
   * the flyout component to indicate the currently selected row. Other rows
   * are de-selected in the grid.
   */
  public readonly rowHighlightedId = input<string | undefined>();

  /**
   * Whether the data grid is stacked with another element below it. When specified, the appropriate
   * vertical spacing is automatically added to the data grid.
   * @default false
   */
  public readonly stacked = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * Move the horizontal scrollbar to just below the header row.
   * @default false
   */
  public readonly topScrollEnabled = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The width of the grid in CSS pixels. When no width is set, the grid will use the width of its container.
   */
  public readonly width = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The set of IDs for the rows to prompt for delete confirmation.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   */
  public readonly rowDeleteIds = model<string[]>([]);

  /**
   * The set of IDs for the rows to select in a multiselect grid.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   * Rows with IDs that are not included are de-selected in the grid.
   */
  public readonly selectedRowIds = model<string[]>([]);

  /**
   * Emits a row count after filters are updated. Not used when `externalRowCount` is set.
   */
  public readonly rowCountChange = output<number>();

  /**
   * Fires when users cancel the deletion of a row.
   */
  public readonly rowDeleteCancel = output<SkyDataGridRowDeleteCancelArgs>();

  /**
   * Fires when users confirm the deletion of a row.
   */
  public readonly rowDeleteConfirm = output<SkyDataGridRowDeleteConfirmArgs>();

  protected readonly directive = inject(SkyDataGridDirective, { self: true });
  protected readonly useInternalFilters = signal(true).asReadonly();
}
