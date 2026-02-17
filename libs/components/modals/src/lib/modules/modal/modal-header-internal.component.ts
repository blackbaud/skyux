import { Component } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

/**
 * @internal
 * Internal-only component used to render modal headers when using the headingText input.
 * This is not exported publicly and should not be used by consumers.
 */
@Component({
  selector: 'sky-modal-header-internal',
  templateUrl: './modal-header-internal.component.html',
  styleUrls: ['./modal-header-internal.component.scss'],
  imports: [SkyThemeModule, SkyTrimModule],
})
export class SkyModalHeaderInternalComponent {}
