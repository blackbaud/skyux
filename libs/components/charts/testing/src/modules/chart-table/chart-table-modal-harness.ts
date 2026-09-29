import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for interacting with a chart's data table modal in tests. Open the
 * modal with `SkyChartHarness.openDataTableModal`.
 */
export class SkyChartTableModalHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static readonly hostSelector = 'sky-chart-table-modal';

  readonly #getBodyCells = this.locatorForAll('.sky-chart-data-table tbody td');
  readonly #getCloseButton = this.locatorFor(
    'button.sky-chart-table-modal-close',
  );
  readonly #getColumnHeaders = this.locatorForAll(
    '.sky-chart-data-table thead th',
  );
  readonly #getRowHeaders = this.locatorForAll(
    '.sky-chart-data-table tbody th',
  );

  /**
   * Closes the data table modal.
   */
  public async close(): Promise<void> {
    await (await this.#getCloseButton()).click();
  }

  /**
   * Gets the categories, shown as the table's row headers.
   */
  public async getCategories(): Promise<string[]> {
    const rowHeaders = await this.#getRowHeaders();

    return await Promise.all(rowHeaders.map((header) => header.text()));
  }

  /**
   * Gets the category axis label, shown as the table's corner header.
   */
  public async getCategoryLabel(): Promise<string> {
    const [cornerHeader] = await this.#getColumnHeaders();

    return await cornerHeader.text();
  }

  /**
   * Gets the series labels, shown as the table's column headers.
   */
  public async getSeriesLabels(): Promise<string[]> {
    const [, ...seriesHeaders] = await this.#getColumnHeaders();

    return await Promise.all(seriesHeaders.map((header) => header.text()));
  }

  /**
   * Gets the formatted values of the table's body as one array per category
   * row, ordered to match the series labels.
   */
  public async getValues(): Promise<string[][]> {
    const seriesCount = (await this.getSeriesLabels()).length;
    const cells = await this.#getBodyCells();
    const cellText = await Promise.all(cells.map((cell) => cell.text()));

    const rows: string[][] = [];

    for (let i = 0; i < cellText.length; i += seriesCount) {
      rows.push(cellText.slice(i, i + seriesCount));
    }

    return rows;
  }
}
