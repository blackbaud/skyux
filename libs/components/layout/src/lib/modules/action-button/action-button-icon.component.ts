import { Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

/**
 * Specifies an icon to display on the action button.
 */
@Component({
  selector: 'sky-action-button-icon',
  styleUrls: [
    './action-button-icon.default.component.scss',
    './action-button-icon.modern.component.scss',
  ],
  templateUrl: './action-button-icon.component.html',
  imports: [SkyIconModule, SkyThemeModule],
})
export class SkyActionButtonIconComponent {
  /**
   * The name of the Blackbaud SVG icon to display.
   */
  @Input({ required: true })
  public iconName!: string;

  protected readonly breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
