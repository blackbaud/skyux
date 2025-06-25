import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';
import { SkyPopoverModule } from '@skyux/popovers';

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
  imports: [NgTemplateOutlet, SkyPopoverModule, SkyStatusIndicatorModule],
})
export class SkyAgGridCellValidatorTooltipComponent implements OnDestroy {
  @Input()
  public set params(value: SkyCellRendererValidatorParams | undefined) {
    this.cellRendererParams = value;

    if (value?.api && !this.#listenersAdded) {
      this.#listenersAdded = true;
      value.api.addEventListener('cellFocused', this.#cellFocusHandler);
      value.api.addEventListener('cellEditingStarted', this.#blurHandler);
      value.eGridCell?.addEventListener('keyup', this.#keyupHandler);
      value.eGridCell?.addEventListener('mouseenter', this.#focusHandler);
      value.eGridCell?.addEventListener('mouseleave', this.#blurHandler);
    }

    if (typeof value?.skyComponentProperties?.validatorMessage === 'function') {
      this.validatorMessage = value.skyComponentProperties.validatorMessage(
        value.value,
        value.data,
        value?.node?.rowIndex,
      );
    } else {
      this.validatorMessage = value?.skyComponentProperties?.validatorMessage;
    }

    this.showValidatorMessage.set(this.#showValidatorMessage());
    this.#changeDetector.markForCheck();
  }

  public popoverMessageStream = new Subject<SkyPopoverMessage>();
  public validatorMessage: string | undefined;
  public cellRendererParams: SkyCellRendererValidatorParams | undefined;

  protected readonly showValidatorMessage = signal(false);

  readonly #changeDetector = inject(ChangeDetectorRef);
  #listenersAdded = false;

  readonly #keyupHandler = (event: KeyboardEvent): void => {
    if (
      ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)
    ) {
      this.showPopover();
    }
  };
  readonly #focusHandler = (): void => this.showPopover();
  readonly #cellFocusHandler = (eventParams: CellFocusedEvent): void => {
    // We want to close any popovers that are opened when other cells are focused, but open a popover if the current cell is focused.
    if (
      (eventParams.column as AgColumn).getColId() ===
        this.cellRendererParams?.column?.getColId() &&
      eventParams.rowIndex === this.cellRendererParams?.node?.rowIndex
    ) {
      this.showPopover();
    } else {
      this.hidePopover();
    }
  };
  readonly #blurHandler = (): void => this.hidePopover();

  public ngOnDestroy(): void {
    const params = this.cellRendererParams;
    if (params?.api) {
      params.api.removeEventListener('cellFocused', this.#cellFocusHandler);
      params.api.removeEventListener('cellEditingStarted', this.#blurHandler);
    }
    const el = params?.eGridCell;
    if (el) {
      el.removeEventListener('keyup', this.#keyupHandler);
      el.removeEventListener('mouseenter', this.#focusHandler);
      el.removeEventListener('mouseleave', this.#blurHandler);
    }
  }

  public hidePopover(): void {
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Close });
  }

  public showPopover(): void {
    if (this.#shouldShowPopover()) {
      this.popoverMessageStream.next({ type: SkyPopoverMessageType.Open });
    }
  }

  #showValidatorMessage(): boolean {
    if (!this.validatorMessage) {
      return false;
    }
    if (
      typeof this.cellRendererParams?.skyComponentProperties?.validator ===
      'function'
    ) {
      return !this.cellRendererParams.skyComponentProperties.validator(
        this.cellRendererParams.value,
        this.cellRendererParams.data,
        this.cellRendererParams.node?.rowIndex,
      );
    } else {
      return true;
    }
  }

  #shouldShowPopover(): boolean {
    if (!this.showValidatorMessage()) {
      return false;
    }
    const editingCells = this.cellRendererParams?.api.getEditingCells() ?? [];
    return editingCells.length === 0;
  }
}
