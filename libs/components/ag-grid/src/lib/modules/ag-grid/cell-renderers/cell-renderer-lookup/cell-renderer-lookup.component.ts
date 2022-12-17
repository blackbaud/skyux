import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

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
})
export class SkyAgGridCellRendererLookupComponent
  implements ICellRendererAngularComp
{
  protected value = '';
  protected summaryCount = 0;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

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
