import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';
import { CellFocusedEvent, Events } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

@Component({
  selector: 'sky-ag-grid-cell-validator-tooltip',
  styleUrls: ['ag-grid-cell-validator-tooltip.component.scss'],
  templateUrl: 'ag-grid-cell-validator-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAgGridCellValidatorTooltipComponent {
  @Input()
  public set params(value: SkyCellRendererValidatorParams) {
    this.cellRendererParams = value;

    /*istanbul ignore next*/
    this.cellRendererParams.api?.addEventListener(Events.EVENT_CELL_FOCUSED, (eventParams: CellFocusedEvent) => {
      // We want to close any popovers that are opened when other cells are focused, but open a popover if the current cell is focused.
      if (eventParams.column.getColId() !== this.cellRendererParams.column.getColId() ||
        eventParams.rowIndex !== this.cellRendererParams.rowIndex) {
        this.hidePopover();
      }
    });

    /*istanbul ignore next*/
    this.cellRendererParams.eGridCell?.addEventListener('keyup', (event) => {
      if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)) {
        this.showPopover();
      }
    });

    /*istanbul ignore next*/
    this.cellRendererParams.api?.addEventListener(Events.EVENT_CELL_EDITING_STARTED, () => {
      this.hidePopover();
    });

    if (typeof this.cellRendererParams.skyComponentProperties?.validatorMessage === 'function') {
      this.validatorMessage = this.cellRendererParams.skyComponentProperties.validatorMessage(this.cellRendererParams.value);
    } else {
      this.validatorMessage = this.cellRendererParams.skyComponentProperties?.validatorMessage;
    }

    this.changeDetector.markForCheck();
  }

  public indicatorShouldShow = true;
  public popoverMessageStream = new Subject<SkyPopoverMessage>();
  public validatorMessage: string;

  public cellRendererParams: SkyCellRendererValidatorParams;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  public hideIndicator(): void {
    this.zone.run(() => {
      this.indicatorShouldShow = false;
      this.changeDetector.markForCheck();
    });
  }

  public hidePopover(): void {
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Close });
  }

  public showIndicator(): void {
    this.zone.run(() => {
      this.indicatorShouldShow = true;
      this.changeDetector.markForCheck();
    });
  }

  public showPopover(): void {
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Open });
  }
}
