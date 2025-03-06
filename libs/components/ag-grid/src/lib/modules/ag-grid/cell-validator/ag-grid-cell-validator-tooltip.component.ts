import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

    value?.api?.addEventListener(
      'cellFocused',
      (eventParams: CellFocusedEvent) => {
        // We want to close any popovers that are opened when other cells are focused, but open a popover if the current cell is focused.
        if (
          (eventParams.column as AgColumn).getColId() ===
            value?.column?.getColId() &&
          eventParams.rowIndex === value?.node?.rowIndex
        ) {
          this.showPopover();
        } else {
          this.hidePopover();
        }
      },
    );

    value?.api?.addEventListener('cellEditingStarted', () => {
      this.hidePopover();
    });

    if (typeof value?.skyComponentProperties?.validatorMessage === 'function') {
      this.validatorMessage = value.skyComponentProperties.validatorMessage(
        value.value,
        value.data,
        value?.node?.rowIndex,
      );
    } else {
      this.validatorMessage = value?.skyComponentProperties?.validatorMessage;
    }
  }

  public popoverMessageStream = new Subject<SkyPopoverMessage>();
  public validatorMessage: string | undefined;
  public cellRendererParams: SkyCellRendererValidatorParams | undefined;

  public hidePopover(): void {
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Close });
  }

  public showPopover(): void {
    if (this.#shouldShowPopover()) {
      this.popoverMessageStream.next({ type: SkyPopoverMessageType.Open });
    }
  }

  #shouldShowPopover(): boolean {
    if (!this.validatorMessage) {
      return false;
    }
    const editingCells = this.cellRendererParams?.api.getEditingCells() ?? [];
    if (editingCells.length > 0) {
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
}
