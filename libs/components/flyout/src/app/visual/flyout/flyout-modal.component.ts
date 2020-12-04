import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

@Component({
  selector: 'sky-flyout-modal-demo',
  template: `
<sky-modal>
  <sky-modal-content>
    Modal content...
  </sky-modal-content>
  <sky-modal-footer>
    <button *ngIf="visible"
      class="sky-btn-default"
      type="button"
      (click)="visible=false"
    >
      Click to delete
    </button>
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
  public visible = true;
  constructor(
    private instance: SkyModalInstance
  ) { }

  public close(): void {
    this.instance.close();
  }
}
