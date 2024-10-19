import { Component, Input, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

const FONTSIZECLASS_SMALL = '2x';
const FONTSIZECLASS_LARGE = '3x';

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
})
export class SkyActionButtonIconComponent {
  /**
   * The icon from the
   * [Font Awesome library](https://fontawesome.com/v4.7.0/).
   * For example, to display the `fa-filter` icon on the action button,
   * set `iconType` to `filter`. SKY UX supports version 4.7.0 of Font Awesome.
   * For more information about icons in SKY UX, see the
   * [icon component](https://developer.blackbaud.com/skyux/components/icon).
   */
  @Input()
  public iconType: string | undefined;

  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  protected fontSizeClass = computed(() => {
    return this.#breakpoint() === 'xs'
      ? FONTSIZECLASS_SMALL
      : FONTSIZECLASS_LARGE;
  });
}
