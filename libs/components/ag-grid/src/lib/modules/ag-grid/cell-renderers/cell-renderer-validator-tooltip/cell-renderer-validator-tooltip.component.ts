import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BehaviorSubject, Subscription } from 'rxjs';

import { SkyAgGridCellValidatorTooltipComponent } from '../../cell-validator/ag-grid-cell-validator-tooltip.component';
import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-validator-tooltip',
  templateUrl: 'cell-renderer-validator-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyAgGridCellValidatorTooltipComponent, AsyncPipe],
})
export class SkyAgGridCellRendererValidatorTooltipComponent
  implements ICellRendererAngularComp, OnDestroy
{
  @Input()
  public set params(value: SkyCellRendererValidatorParams) {
    this.agInit(value);
  }

  public cellRendererParams: SkyCellRendererValidatorParams | undefined;
  public value: unknown;

  protected valueObservable = new BehaviorSubject('');

  readonly #changeDetector = inject(ChangeDetectorRef);
  #valueSubscription: Subscription | undefined;

  public ngOnDestroy(): void {
    this.#valueSubscription?.unsubscribe();
    this.valueObservable.complete();
  }

  public agInit(params: SkyCellRendererValidatorParams): void {
    this.cellRendererParams = params;
    this.#valueSubscription?.unsubscribe();
    this.#valueSubscription = new Subscription();
    if (
      typeof params.skyComponentProperties?.valueResourceObservable ===
      'function'
    ) {
      this.#valueSubscription.add(
        params.skyComponentProperties
          .valueResourceObservable(
            params.value,
            params.data,
            params.node?.rowIndex,
          )
          .subscribe((result) => {
            this.valueObservable.next(result);
          }),
      );
    } else {
      this.valueObservable.next(params.valueFormatted ?? params.value);
    }
    this.#changeDetector.markForCheck();
  }

  public refresh(params: SkyCellRendererValidatorParams): boolean {
    this.agInit(params);
    return false;
  }
}
