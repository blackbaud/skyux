import { Component, inject } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  imports: [SkyIconModule, SkyModalModule],
  template: `
    <sky-modal
      headingHidden
      headingText="New feature: Modal with banner support"
    >
      <sky-modal-banner
        imageSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjM4MCIgdmlld0JveD0iMCAwIDYwMCAzODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMzgwIiBmaWxsPSIjRENGNkY1Ii8+CjxyZWN0IHg9IjQyIiB5PSI0NiIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxNDAiIGZpbGw9IiNERUJERkEiLz4KPHJlY3QgeD0iMjMwIiB5PSIxOTQiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiByeD0iNzAiIGZpbGw9IiM2MEQ1RDIiLz4KPHBhdGggZD0iTTQ3OCA3OEw1NDcuMjgyIDE5OEg0MDguNzE4TDQ3OCA3OFoiIGZpbGw9IiM2NkUyRkYiLz4KPC9zdmc+Cg=="
      />
      <sky-modal-content>
        <h2 class="sky-theme-font-display-1 sky-theme-margin-bottom-s">
          Modal with banner support
        </h2>
        <div class="awareness-modal-body sky-theme-font-body-l">
          Modals can now display a banner that extends the full width of the
          modal without any padding or margin!
        </div>
      </sky-modal-content>
      <sky-modal-footer>
        <button
          class="sky-btn sky-btn-primary"
          type="button"
          (click)="closeForm()"
        >
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
export class ModalComponent {
  readonly #instance = inject(SkyModalInstance);

  protected closeForm(): void {
    this.#instance.close();
  }
}
