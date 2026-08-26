import { Component, inject } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

/**
 * Demonstrates the toolbar's built-in padding stacking on top of the modal
 * content's own padding. The toolbar buttons should line up with the
 * paragraphs above and below, but they are indented further.
 */
@Component({
  imports: [SkyIconModule, SkyModalModule, SkyToolbarModule],
  template: `<sky-modal headingText="Toolbar in a modal">
    <sky-modal-content>
      <p class="app-reference-text">
        This paragraph sits on the modal content's left edge.
      </p>
      <sky-toolbar>
        <sky-toolbar-item>
          <button class="sky-btn sky-btn-primary" type="button">
            <sky-icon class="sky-theme-margin-right-xs" iconName="add" />
            New
          </button>
        </sky-toolbar-item>
        <sky-toolbar-item>
          <button class="sky-btn sky-btn-default" type="button">Edit</button>
        </sky-toolbar-item>
      </sky-toolbar>
      <p class="app-reference-text">
        So does this one. The toolbar buttons above should align with them.
      </p>
    </sky-modal-content>
    <sky-modal-footer>
      <button
        class="sky-btn sky-btn-primary"
        type="button"
        (click)="instance.close()"
      >
        Close
      </button>
    </sky-modal-footer>
  </sky-modal>`,
  styles: `
    .app-reference-text {
      margin: 0;
    }
  `,
})
export class ToolbarSpacingModalComponent {
  protected readonly instance = inject(SkyModalInstance);
}
