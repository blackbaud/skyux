import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { SkyCellRendererLookupParams } from '../../types/cell-renderer-lookup-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-cell-renderer-lookup',
  templateUrl: './cell-renderer-lookup.component.html',
  styleUrls: ['./cell-renderer-lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyI18nModule],
})
export class SkyAgGridCellRendererLookupComponent implements ICellRendererAngularComp {
  protected value = '';
  protected summaryCount = 0;

  readonly #changeDetector = inject(ChangeDetectorRef);

  public agInit(params: SkyCellRendererLookupParams): void {
    this.summaryCount = params.value?.length || 0;
    this.value = `${params.valueFormatted}`;
    this.#changeDetector.markForCheck();
  }

  public refresh(params: SkyCellRendererLookupParams): boolean {
    this.agInit(params);
    return true;
  }
}
