import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ValueFormatterParams } from 'ag-grid-community';
import { Observable, isObservable } from 'rxjs';

import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-validator-tooltip',
  templateUrl: 'cell-renderer-validator-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  readonly #changeDetector = inject(ChangeDetectorRef);

  public agInit(params: SkyCellRendererValidatorParams): void {
    this.cellRendererParams = params;
    if (typeof params.skyComponentProperties?.getString === 'function') {
      this.value = params.skyComponentProperties.getString(
        params.value,
        params.data,
        params.node?.rowIndex,
      );
    } else if (typeof params.colDef?.valueFormatter === 'function') {
      this.value = params.colDef.valueFormatter(params as ValueFormatterParams);
    } else {
      this.value = params.value;
    }
    this.#changeDetector.markForCheck();
  }

  public refresh(params: SkyCellRendererValidatorParams): boolean {
    this.agInit(params);
    return false;
  }

  protected isObservable(value: unknown): value is Observable<any> {
    return isObservable(value);
  }
}
