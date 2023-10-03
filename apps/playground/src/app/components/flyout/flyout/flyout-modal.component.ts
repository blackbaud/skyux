import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  standalone: true,
  selector: 'app-flyout-modal-demo',
  template: `
    <sky-modal>
      <sky-modal-content> Modal content... </sky-modal-content>
      <sky-modal-footer>
        <button
          *ngIf="visible"
          class="sky-btn-default"
          type="button"
          (click)="visible = false"
        >
          Click to delete
        </button>
        <button class="sky-btn sky-btn-primary" type="button" (click)="close()">
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
  imports: [CommonModule, SkyModalModule],
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
