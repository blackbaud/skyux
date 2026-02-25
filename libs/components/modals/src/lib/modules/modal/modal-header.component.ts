import { Component } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

/**
 * Specifies a header for the modal.
 * @deprecated Use `headingText` on the `sky-modal` component, instead.
 */
@Component({
  selector: 'sky-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  imports: [SkyThemeModule, SkyTrimModule],
})
export class SkyModalHeaderComponent {}
