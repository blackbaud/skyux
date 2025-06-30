import { Component, inject } from '@angular/core';
import { SkyFilterBarFilterModalContext } from '@skyux/filter-bar';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.component.html',
  imports: [SkyModalModule],
})
export class TestModalComponent {
  #context = inject(SkyFilterBarFilterModalContext);
  readonly #modalInstance = inject(SkyModalInstance);

  protected filterName = this.#context.filterName;

  public save(): void {
    if (this.#context.filterValue) {
      this.#context.filterValue = undefined;
    } else {
      this.#context.filterValue = {
        value: true,
        displayValue:
          'Really really really really really really really really really really really really long display value for testing purposes.',
      };
    }
    this.#modalInstance.save(this.#context.filterValue);
  }

  public cancel(): void {
    this.#modalInstance.cancel();
  }
}
