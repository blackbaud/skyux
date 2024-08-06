import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';

import { AgColumn, CellFocusedEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';

import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-validator-tooltip',
  styleUrls: ['ag-grid-cell-validator-tooltip.component.scss'],
  templateUrl: 'ag-grid-cell-validator-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellValidatorTooltipComponent {
  @Input()
  public set params(value: SkyCellRendererValidatorParams | undefined) {
    this.cellRendererParams = value;

    /*istanbul ignore next*/
    this.cellRendererParams?.api?.addEventListener(
      'cellFocused',
      (eventParams: CellFocusedEvent) => {
        // We want to close any popovers that are opened when other cells are focused, but open a popover if the current cell is focused.
        if (
          (eventParams.column as AgColumn).getColId() !==
            this.cellRendererParams?.column?.getColId() ||
          eventParams.rowIndex !== this.cellRendererParams?.node?.rowIndex
        ) {
          this.hidePopover();
        }
      },
    );

    /*istanbul ignore next*/
    this.cellRendererParams?.eGridCell?.addEventListener('keyup', (event) => {
      if (
        ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)
      ) {
        this.showPopover();
      }
    });

    this.cellRendererParams?.eGridCell?.addEventListener('mouseenter', () => {
      this.#scheduleDelayedPopover();
    });

    this.cellRendererParams?.eGridCell?.addEventListener('mouseleave', () => {
      this.hidePopover();
    });

    /*istanbul ignore next*/
    this.cellRendererParams?.api?.addEventListener('cellEditingStarted', () => {
      this.hidePopover();
    });

    if (
      typeof this.cellRendererParams?.skyComponentProperties
        ?.validatorMessage === 'function'
    ) {
      this.validatorMessage =
        this.cellRendererParams.skyComponentProperties.validatorMessage(
          this.cellRendererParams.value,
          this.cellRendererParams.data,
          this.cellRendererParams?.node?.rowIndex ?? undefined,
        );
    } else {
      this.validatorMessage =
        this.cellRendererParams?.skyComponentProperties?.validatorMessage;
    }

    this.#changeDetector.markForCheck();
  }

  public popoverMessageStream = new Subject<SkyPopoverMessage>();
  public validatorMessage: string | undefined;
  public cellRendererParams: SkyCellRendererValidatorParams | undefined;

  #hoverTimeout: number | undefined;
  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public hidePopover(): void {
    this.#cancelDelayedPopover();
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Close });
  }

  public showPopover(): void {
    this.#cancelDelayedPopover();
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Open });
  }

  #scheduleDelayedPopover(): void {
    /* istanbul ignore else */
    if (!this.#hoverTimeout) {
      this.#hoverTimeout = window.setTimeout(() => {
        this.showPopover();
      }, 300);
    }
  }

  #cancelDelayedPopover(): void {
    if (this.#hoverTimeout) {
      window.clearTimeout(this.#hoverTimeout);
      this.#hoverTimeout = undefined;
    }
  }
}
