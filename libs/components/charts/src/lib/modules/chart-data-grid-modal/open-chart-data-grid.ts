import { SkyModalService } from '@skyux/modals';

import { SkyChartSeries } from '../shared/chart-types';

import { SkyChartGridModalContext } from './chart-data-grid-modal-context';
import { SkyChartDataGridModalComponent } from './chart-data-grid-modal.component';

/**
 * Opens a modal displaying chart data in a data grid format.
 *
 * @param modalService The modal service to use for opening the modal.
 * @param modalTitle The title to display in the modal header.
 * @param categories The category labels for the chart data.
 * @param series The data series to display. Can be a single series or an array of series.
 */
export function openChartDataGridModal(
  modalService: SkyModalService,
  modalTitle: string | undefined,
  categories: string[],
  series: SkyChartSeries | SkyChartSeries[],
): void {
  const modalContext = new SkyChartGridModalContext({
    modalTitle: modalTitle ?? '',
    categories,
    series: Array.isArray(series) ? series : [series],
  });

  modalService.open(SkyChartDataGridModalComponent, {
    size: 'large',
    providers: [{ provide: SkyChartGridModalContext, useValue: modalContext }],
  });
}
