import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
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
export class SkyStatusIndicatorComponent implements OnInit {
  /**
   * The style for the status indicator, which determines the icon.
   * @default "warning"
   */
  @Input()
  public set indicatorType(value: SkyIndicatorIconType) {
    this.indicatorTypeOrDefault =
      value === undefined ? INDICATOR_TYPE_DEFAULT : value;

    this.#updateIcon();
  }

  /**
   * The predefined text to be read by screen readers for users
   * who cannot see the indicator icon.
   * @required
   */
  @Input()
  public set descriptionType(value: SkyIndicatorDescriptionType | undefined) {
    this.#_descriptionType = value;
    this.#updateDescriptionComputed();
  }

  public get descriptionType(): SkyIndicatorDescriptionType | undefined {
    return this.#_descriptionType;
  }

  /**
   * The text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string | undefined) {
    this.#_customDescription = value;
    this.#updateDescriptionComputed();
  }

  public get customDescription(): string | undefined {
    return this.#_customDescription;
  }

  public descriptionComputed: string | undefined;

  public baseIcon: SkyIconStackItem | undefined;

  public icon: string | undefined;

  public indicatorTypeOrDefault: SkyIndicatorIconType = INDICATOR_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem | undefined;

  #changeDetector: ChangeDetectorRef;
  #resourcesSvc: SkyLibResourcesService;

  #_descriptionType: SkyIndicatorDescriptionType | undefined;
  #_customDescription: string | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    resources: SkyLibResourcesService
  ) {
    this.#changeDetector = changeDetector;
    this.#resourcesSvc = resources;
  }

  public ngOnInit(): void {
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
          this.#resourcesSvc
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
