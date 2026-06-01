import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-sales-modal',
  templateUrl: './sales-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SkyCheckboxModule, SkyModalModule],
})
export class SalesModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);

  protected hideSales = false;
  protected modalLabel: string;

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #context = this.modalInstance.context;

  constructor() {
    this.modalLabel = this.#context.filterLabelText;

    if (this.#context.filterValue) {
      this.hideSales = !!this.#context.filterValue.value;
    }

    this.#changeDetectorRef.markForCheck();
  }

  protected applyFilters(): void {
    let result: SkyFilterBarFilterValue | undefined;

    if (this.hideSales) {
      result = {
        value: 'Sales',
        displayValue: 'True',
      };
    }

    this.modalInstance.save({ filterValue: result });
  }

  protected cancel(): void {
    this.modalInstance.cancel();
  }
}
