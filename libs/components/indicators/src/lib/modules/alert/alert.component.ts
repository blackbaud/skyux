import { NgClass } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeComponentClassDirective, SkyThemeModule } from '@skyux/theme';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

const ALERT_TYPE_DEFAULT = 'warning';

/**
 * Displays a contextual message that draws attention to important information,
 * such as a warning, error, or success confirmation.
 */
@Component({
  selector: 'sky-alert',
  styleUrls: [
    './alert.default.component.scss',
    './alert.modern.component.scss',
  ],
  templateUrl: './alert.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
  imports: [
    NgClass,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
  ],
})
export class SkyAlert implements AfterViewChecked {
  /**
   * The style for the alert, which determines the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  public readonly alertType = input<SkyIndicatorIconType>();

  /**
   * Whether to include a close button for users to dismiss the alert.
   * @default false
   */
  public readonly closeable = input<boolean>();

  /**
   * Whether the alert is closed. Supports two-way binding and emits through the
   * `closedChange` output when users close the alert.
   * @default false
   */
  public readonly closed = model<boolean>();

  /**
   * The predefined text to be read by screen readers for users who cannot see the alert icon.
   * This property is optional but will be required in future versions of SKY UX.
   */
  public readonly descriptionType = input<SkyIndicatorDescriptionType>();

  /**
   * The text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  public readonly customDescription = input<string>();

  /**
   * The alert type to render, falling back to the default when none is set.
   */
  protected readonly alertTypeOrDefault = computed<SkyIndicatorIconType>(
    () => this.alertType() || ALERT_TYPE_DEFAULT,
  );

  /**
   * The name of the icon to display for the current alert type.
   */
  protected readonly iconName = computed(() =>
    SkyIndicatorIconUtility.getIconNameForType(this.alertTypeOrDefault()),
  );

  /**
   * The resource key for the screen reader description of the current
   * `descriptionType`, or `undefined` when no predefined description applies.
   */
  protected readonly descriptionResourceKey = computed(() => {
    const descriptionType = this.descriptionType();

    if (!descriptionType || descriptionType === 'none') {
      return undefined;
    }

    return `skyux_alert_sr_${descriptionType.replace(/-/g, '_')}`;
  });

  #descriptionTypeWarned: boolean | undefined;

  readonly #logSvc = inject(SkyLogService);

  public ngAfterViewChecked(): void {
    if (!this.descriptionType() && !this.#descriptionTypeWarned) {
      this.#logSvc.deprecated('SkyAlert without `descriptionType`', {
        deprecationMajorVersion: 8,
        replacementRecommendation:
          'Always specify a `descriptionType` property.',
      });

      this.#descriptionTypeWarned = true;
    }
  }

  protected close(): void {
    this.closed.set(true);
  }
}
