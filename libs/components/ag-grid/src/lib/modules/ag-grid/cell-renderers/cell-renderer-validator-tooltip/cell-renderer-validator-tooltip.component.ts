import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';

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
})
export class SkyAgGridCellRendererValidatorTooltipComponent
  implements ICellRendererAngularComp, OnDestroy, AfterViewInit
{
  @Input()
  public set params(value: SkyCellRendererValidatorParams) {
    this.agInit(value);
  }

  @ViewChild('nestedCellRenderer', {
    read: ElementRef,
    static: true,
  })
  protected nestedCellRenderer!: ElementRef<HTMLElement>;

  public cellRendererParams: SkyCellRendererValidatorParams | undefined;
  public value: unknown;

  #changeDetector = inject(ChangeDetectorRef);
  #dynamicComponentService = inject(SkyDynamicComponentService);
  #dynamicComponentRef: ComponentRef<unknown> | undefined;
  #environmentInjector = inject(EnvironmentInjector);

  public ngOnDestroy(): void {
    this.#dynamicComponentRef?.destroy();
  }

  public ngAfterViewInit(): void {
    if (
      this.cellRendererParams?.colDef?.cellRenderer &&
      this.cellRendererParams.colDef.cellRenderer !==
        SkyAgGridCellRendererValidatorTooltipComponent
    ) {
      this.#dynamicComponentRef =
        this.#dynamicComponentService.createComponent<ICellRendererAngularComp>(
          this.cellRendererParams.colDef.cellRenderer,
          {
            location: SkyDynamicComponentLocation.BeforeElement,
            referenceEl: this.nestedCellRenderer.nativeElement,
            environmentInjector: this.#environmentInjector,
          },
        );
      if (this.#dynamicComponentRef.instance) {
        (this.#dynamicComponentRef.instance as ICellRendererAngularComp).agInit(
          this.cellRendererParams,
        );
      }
    }
  }

  public agInit(params: SkyCellRendererValidatorParams): void {
    this.cellRendererParams = params;
    if (this.#dynamicComponentRef) {
      this.#dynamicComponentRef.destroy();
      this.#dynamicComponentRef = undefined;
    }
    if (typeof params.colDef?.valueFormatter === 'function') {
      this.value = params.colDef.valueFormatter(params as ValueFormatterParams);
    } else {
      this.value = params.value;
    }
    this.#changeDetector.markForCheck();
  }

  public refresh(params: SkyCellRendererValidatorParams): boolean {
    this.agInit(params);
    this.ngAfterViewInit();
    return false;
  }
}
