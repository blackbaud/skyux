import { Component } from '@angular/core';
import { SkyInlineFormModule } from '@skyux/inline-form';

@Component({
  imports: [SkyInlineFormModule],
  template: `
    <sky-inline-form
      [config]="config"
      [showForm]="showForm"
      (close)="onClose()"
    >
      <button type="button" class="sky-btn-primary" (click)="onOpen()">
        Open
      </button>
    </sky-inline-form>
  `,
})
class TestComponent {
  public config: SkyInlineFormConfig = {};
}
