import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ValueFormatterParams } from 'ag-grid-community';

import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-validator-tooltip',
  templateUrl: 'cell-renderer-validator-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyAgGridCellRendererValidatorTooltipComponent
  implements ICellRendererAngularComp
{
  @Input()
  public set params(value: SkyCellRendererValidatorParams) {
    this.agInit(value);
  }

  public cellRendererParams: SkyCellRendererValidatorParams | undefined;
  public value: unknown;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public agInit(params: SkyCellRendererValidatorParams): void {
    this.cellRendererParams = params;
    if (typeof params.colDef?.valueFormatter === 'function') {
      this.value = params.colDef.valueFormatter(params as ValueFormatterParams);
    } else {
      this.value = params.value;
    }
    this.#changeDetector.markForCheck();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public refresh(params: unknown): boolean {
    return false;
  }
}
