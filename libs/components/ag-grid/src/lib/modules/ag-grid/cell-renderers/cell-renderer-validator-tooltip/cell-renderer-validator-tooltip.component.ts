import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  effect,
  inject,
  input,
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
  public readonly params = input<SkyCellRendererValidatorParams>();

  protected cellRendererParams: SkyCellRendererValidatorParams | undefined;
  protected valueObservable = new BehaviorSubject('');

  readonly #changeDetector = inject(ChangeDetectorRef);
  #valueSubscription: Subscription | undefined;

  constructor() {
    effect(() => {
      const params = this.params();
      if (params) {
        this.agInit(params);
      }
    });
  }

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
