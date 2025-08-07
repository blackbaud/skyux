import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-flyout-modal-demo',
  template: `
    <sky-modal>
      <sky-modal-content> Modal content... </sky-modal-content>
      <sky-modal-footer>
        @if (visible) {
          <button
            class="sky-btn-default"
            type="button"
            (click)="visible = false"
          >
            Click to delete
          </button>
        }
        <button class="sky-btn sky-btn-primary" type="button" (click)="close()">
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
  imports: [SkyModalModule],
})
export class FlyoutModalDemoComponent {
  public visible = true;

  #instance: SkyModalInstance;

  constructor(instance: SkyModalInstance) {
    this.#instance = instance;
  }

  public close(): void {
    this.#instance.close();
  }
}
