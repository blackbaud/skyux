import { Component } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

/**
 * Specifies a header for the modal.
 * @deprecated Use the `headingText` input on the `sky-modal` component for modal headings.
 * For inline help, use the `helpKey` or `helpPopoverContent` inputs on the `sky-modal` component.
 */
@Component({
  selector: 'sky-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  imports: [SkyThemeModule, SkyTrimModule],
})
export class SkyModalHeaderComponent {}
