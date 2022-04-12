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
  public value = '';
  public summaryCount = 0;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public agInit(params: SkyCellRendererLookupParams): void {
    this.summaryCount = params.value?.length || 0;
    this.value = `${params.valueFormatted}`;
    this.changeDetector.markForCheck();
  }

  public refresh(params: SkyCellRendererLookupParams): boolean {
    this.agInit(params);
    return true;
  }
}
