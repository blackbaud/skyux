import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-orange-modal',
  templateUrl: './orange-modal.component.html',
  imports: [ReactiveFormsModule, SkyCheckboxModule, SkyModalModule],
})
export class OrangeModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);

  protected hideOrange = inject(FormBuilder).control(
    !!this.modalInstance.context.filterValue?.value,
  );
  protected modalLabel = this.modalInstance.context.filterLabelText;

  protected applyFilters(): void {
    if (this.hideOrange.value) {
      this.modalInstance.save({
        filterValue: {
          value: true,
          displayValue: 'True',
        },
      });
    } else {
      this.modalInstance.save({ filterValue: undefined });
    }
  }

  protected cancel(): void {
    this.modalInstance.cancel();
  }
}
