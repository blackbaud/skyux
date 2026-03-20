import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  isSignal,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverModule,
} from '@skyux/popovers';

import { AgColumn, CellFocusedEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';

import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';
import { SkyAgGridValidatorProperties } from '../types/validator-properties';

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
export class SkyAgGridCellValidatorTooltipComponent {
  public readonly params = input<SkyCellRendererValidatorParams>();

  protected readonly popoverMessageStream = new Subject<SkyPopoverMessage>();
  protected readonly validatorProperties = computed<
    SkyAgGridValidatorProperties | undefined
  >(
    () =>
      this.params()?.skyComponentProperties as
        | SkyAgGridValidatorProperties
        | undefined,
  );
  protected readonly validatorMessage = computed((): string => {
    const params = this.params();
    const validatorProperties = this.validatorProperties();
    const validatorMessage = validatorProperties?.validatorMessage;
    if (!validatorMessage || !params) {
      return '';
    }
    if (isSignal(validatorMessage)) {
      return validatorMessage();
    }
    if (typeof validatorMessage === 'function') {
      return validatorMessage(
        params.value,
        params.data,
        params?.node?.rowIndex,
      );
    }
    return validatorMessage;
  });
  protected readonly showValidatorMessage = computed(() => {
    const validatorMessage = this.validatorMessage();
    const validatorProperties = this.validatorProperties();
    const params = this.params();
    if (!validatorMessage || !validatorProperties || !params) {
      return false;
    }
    const validator = validatorProperties.validator;
    if (typeof validator === 'function') {
      return !validator(params.value, params.data, params.node?.rowIndex);
    }
    return true;
  });

  readonly #keyupHandler = (event: KeyboardEvent): void => {
    if (
      ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)
    ) {
      this.#showPopover();
    }
  };
  readonly #focusHandler = (): void => this.#showPopover();
  readonly #cellFocusHandler = (eventParams: CellFocusedEvent): void => {
    const params = this.params();
    if (
      (eventParams.column as AgColumn).getColId() ===
        params?.column?.getColId() &&
      eventParams.rowIndex === params?.node?.rowIndex
    ) {
      this.#showPopover();
    } else {
      this.#hidePopover();
    }
  };
  readonly #blurHandler = (): void => this.#hidePopover();

  constructor() {
    effect((onCleanup) => {
      const value = this.params();
      if (value?.api) {
        value.api.addEventListener('cellFocused', this.#cellFocusHandler);
        value.api.addEventListener('cellEditingStarted', this.#blurHandler);
        value.eGridCell?.addEventListener('keyup', this.#keyupHandler);
        value.eGridCell?.addEventListener('mouseenter', this.#focusHandler);
        value.eGridCell?.addEventListener('mouseleave', this.#blurHandler);

        onCleanup(() => {
          if (!value.api.isDestroyed || !value.api.isDestroyed()) {
            value.api.removeEventListener(
              'cellFocused',
              this.#cellFocusHandler,
            );
            value.api.removeEventListener(
              'cellEditingStarted',
              this.#blurHandler,
            );
          }
          if (value.eGridCell) {
            value.eGridCell.removeEventListener('keyup', this.#keyupHandler);
            value.eGridCell.removeEventListener(
              'mouseenter',
              this.#focusHandler,
            );
            value.eGridCell.removeEventListener(
              'mouseleave',
              this.#blurHandler,
            );
          }
        });
      }
    });
  }

  #hidePopover(): void {
    this.popoverMessageStream.next({ type: SkyPopoverMessageType.Close });
  }

  #showPopover(): void {
    if (this.#shouldShowPopover()) {
      this.popoverMessageStream.next({ type: SkyPopoverMessageType.Open });
    }
  }

  #shouldShowPopover(): boolean {
    if (!this.showValidatorMessage()) {
      return false;
    }
    const editingCells = this.params()?.api.getEditingCells() ?? [];
    return editingCells.length === 0;
  }
}
