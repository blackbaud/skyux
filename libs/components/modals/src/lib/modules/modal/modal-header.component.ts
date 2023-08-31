import { Component } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

/**
 * Specifies a header for the modal.
 */
@Component({
  standalone: true,
  selector: 'sky-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  imports: [SkyThemeModule, SkyTrimModule],
})
export class SkyModalHeaderComponent {}
