import { Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  imports: [SkyModalModule],
  template: `<sky-modal [isDirty]="true">
    <sky-modal-header>Modal test</sky-modal-header>
    <sky-modal-content> Hello World! </sky-modal-content>
    <sky-modal-footer>
      <button type="button" (click)="instance.close()">Close</button>
    </sky-modal-footer>
  </sky-modal> `,
})
export class ModalStandaloneComponent {
  protected readonly instance = inject(SkyModalInstance);
}
