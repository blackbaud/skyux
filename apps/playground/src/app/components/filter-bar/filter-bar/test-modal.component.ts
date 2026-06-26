import { Component, inject } from '@angular/core';
import { SkyFilterItemModalInstance } from '@skyux/filter-bar';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.component.html',
  imports: [SkyModalModule],
})
export class TestModalComponent {
  #instance = inject(SkyFilterItemModalInstance);
  #context = this.#instance.context;
  #filterValue = this.#context.filterValue;

  protected filterName = this.#context.filterLabelText;

  public save(): void {
    if (this.#filterValue) {
      this.#filterValue = undefined;
    } else {
      this.#filterValue = {
        value: true,
        displayValue:
          'Really really really really really really really really really really really really long display value for testing purposes.',
      };
    }
    this.#instance.save({ filterValue: this.#filterValue });
  }

  public cancel(): void {
    this.#instance.cancel();
  }
}
