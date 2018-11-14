import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals/modules/modal';

@Component({
  selector: 'sky-flyout-modal-demo',
  template: `
<sky-modal>
  <sky-modal-content>
    Modal content...
  </sky-modal-content>
  <sky-modal-footer>
    <button
      class="sky-btn sky-btn-primary"
      type="button"
      (click)="close()"
    >
      Close
    </button>
  </sky-modal-footer>
</sky-modal>
`
})
export class SkyFlyoutModalDemoComponent {
  constructor(
    private instance: SkyModalInstance
  ) { }

  public close(): void {
    this.instance.close();
  }
}
