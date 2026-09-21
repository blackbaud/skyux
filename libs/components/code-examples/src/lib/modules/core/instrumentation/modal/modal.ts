import { Component, inject } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-core-instrumentation-modal-content',
  imports: [SkyHelpInlineModule, SkyModalModule],
  template: `
    <sky-modal headingText="Edit gift">
      <sky-modal-content>
        <p>
          Gift details
          <sky-help-inline
            data-sky-id="modal-help"
            helpKey="edit-gift.html"
            labelText="Gift details"
          />
        </p>
        <p>
          The help button in this modal reports the context from the page that
          opened it.
        </p>
      </sky-modal-content>
      <sky-modal-footer>
        <button
          class="sky-btn sky-btn-link"
          type="button"
          (click)="closeModal()"
        >
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
export class CoreInstrumentationModalContent {
  readonly #instance = inject(SkyModalInstance);

  protected closeModal(): void {
    this.#instance.close();
  }
}
