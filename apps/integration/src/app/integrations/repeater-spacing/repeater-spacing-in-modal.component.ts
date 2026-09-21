import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';
import RepeaterSpacingComponent from './repeater-spacing.component';

@Component({
  selector: 'app-repeater-spacing-in-modal',
  template: '',
  imports: [],
})
export default class RepeaterSpacingInModalComponent {
  readonly #modalSvc = inject(SkyModalService);
  readonly #router = inject(Router);

  constructor() {
    const modal = this.#modalSvc.open(RepeaterSpacingModalComponent, {
      size: 'large',
    });
    modal.closed.subscribe(() => {
      void this.#router.navigate(['/']);
    });
    inject(DestroyRef).onDestroy(() => {
      modal.close();
    });
  }
}

@Component({
  selector: 'app-repeater-spacing-modal',
  template: `
    <sky-modal headingText="Repeater spacing in modal">
      <sky-modal-content>
        <app-repeater-spacing hideNavigation />
      </sky-modal-content>
      <sky-modal-footer>
        <button
          type="button"
          class="sky-btn sky-btn-primary"
          (click)="modal.close()"
        >
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
  imports: [SkyModalModule, RepeaterSpacingComponent],
})
class RepeaterSpacingModalComponent {
  protected readonly modal = inject(SkyModalInstance);
}
