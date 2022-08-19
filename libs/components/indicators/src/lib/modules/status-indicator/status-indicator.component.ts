import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const INDICATOR_TYPE_DEFAULT: SkyIndicatorIconType = 'warning';
/**
 * Displays status text with an icon matching the specified indicator type.
 * To display a help button beside the label, include a help button element, such as
 * `sky-help-inline`, in the `sky-status-indicator` element and a `sky-control-help`
 * CSS class on that help button element.
 */
@Component({
  selector: 'sky-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyStatusIndicatorComponent {
  /**
   * Specifies a style for the status indicator to determine the icon.
   * @default "warning"
   */
  @Input()
  public set indicatorType(value: SkyIndicatorIconType) {
    this.indicatorTypeOrDefault =
      value === undefined ? INDICATOR_TYPE_DEFAULT : value;

    this.#updateIcon();
  }

  /**
   * Specifies the predefined text to be read by screen readers for users
   * who cannot see the indicator icon.
   * @required
   */
  @Input()
  public set descriptionType(value: SkyIndicatorDescriptionType) {
    this.#_descriptionType = value;
    this.#updateDescriptionComputed();
  }

  public get descriptionType(): SkyIndicatorDescriptionType {
    return this.#_descriptionType;
  }

  /**
   * Specifies the text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string) {
    this.#_customDescription = value;
    this.#updateDescriptionComputed();
  }

  public get customDescription(): string {
    return this.#_customDescription;
  }

  public descriptionComputed: string;

  public baseIcon: SkyIconStackItem;

  public icon: string;

  public indicatorTypeOrDefault: SkyIndicatorIconType = INDICATOR_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem;

  #changeDetector: ChangeDetectorRef;

  #resources: SkyLibResourcesService;

  #_descriptionType: SkyIndicatorDescriptionType;

  #_customDescription: string;

  constructor(
    changeDetector: ChangeDetectorRef,
    resources: SkyLibResourcesService
  ) {
    this.#changeDetector = changeDetector;
    this.#resources = resources;
    this.#updateIcon();
  }

  #updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.indicatorTypeOrDefault
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }

  #updateDescriptionComputed(): void {
    if (this.descriptionType) {
      switch (this.descriptionType) {
        case 'none':
          this.descriptionComputed = '';
          break;
        case 'custom':
          this.descriptionComputed = this.customDescription;
          break;
        default:
          this.#resources
            .getString(
              'skyux_status_indicator_sr_' +
                this.descriptionType.replace(/-/g, '_')
            )
            .subscribe((value) => {
              this.descriptionComputed = value;
              this.#changeDetector.markForCheck();
            });

          break;
      }
    } else {
      this.descriptionComputed = undefined;
    }
  }
}
