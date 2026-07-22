/**
 * A tabular representation of a chart's plotted content, used to render the
 * accessible data table.
 * @internal
 */
export interface SkyChartTable {
  /**
   * The label of the category axis, shown as the corner header of the table.
   */
  categoryLabel: string;

  /**
   * The category values, shown as the table's row headers.
   */
  categories: readonly (string | number)[];

  /**
   * The plotted series, shown as the table's columns.
   */
  series: SkyChartTableSeries[];
}

/**
 * A single series within a chart's tabular representation.
 * @internal
 */
export interface SkyChartTableSeries {
  /**
   * The series label, shown as a column header.
   */
  label: string;

  /**
   * The series values, formatted for display and aligned to the categories by
   * index.
   */
  values: readonly string[];
}
