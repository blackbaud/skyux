import { Component, inject } from '@angular/core';
import { SkyFilterItemModalInstance } from '@skyux/filter-bar';
import { SkyModalModule } from '@skyux/modals';

/**
 * Minimal filter item modal so the filter bar in this demo has renderable
 * filter items. The modal content itself is not part of the repro.
 */
@Component({
  imports: [SkyModalModule],
  template: `<sky-modal [headingText]="filterName">
    <sky-modal-content>Pick a value.</sky-modal-content>
    <sky-modal-footer>
      <button class="sky-btn sky-btn-primary" type="button" (click)="save()">
        Apply
      </button>
      <button class="sky-btn sky-btn-link" type="button" (click)="cancel()">
        Cancel
      </button>
    </sky-modal-footer>
  </sky-modal>`,
})
export class FilterItemModalComponent {
  readonly #instance = inject(SkyFilterItemModalInstance);

  protected filterName = this.#instance.context.filterLabelText;

  protected save(): void {
    this.#instance.save({
      filterValue: { value: true, displayValue: 'Applied' },
    });
  }

  protected cancel(): void {
    this.#instance.cancel();
  }
}
