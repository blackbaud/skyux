import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-orange-modal',
  templateUrl: './orange-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyModalModule,
  ],
})
export class OrangeModalComponent implements SkyFilterItemModal, OnInit {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;

  protected hideOrange: boolean | undefined;
  protected headingText = signal<string>(this.#context.filterLabelText);

  public ngOnInit(): void {
    if (this.#context.filterValue) {
      this.hideOrange = !!this.#context.filterValue.value;
    }
  }

  protected applyFilters(): void {
    let result: SkyFilterBarFilterValue | undefined;

    if (this.hideOrange) {
      result = {
        value: true,
        displayValue: 'True',
      };
    }

    this.modalInstance.save({ filterValue: result });
  }

  protected cancel(): void {
    this.modalInstance.cancel();
  }
}
