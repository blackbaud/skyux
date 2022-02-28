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

@Component({
  selector: 'sky-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyStatusIndicatorComponent {
  /**
   * Specifies a style for the status indicator to determine the icon.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set indicatorType(value: SkyIndicatorIconType) {
    this._indicatorType = value;
    this.updateIcon();
  }

  public get indicatorType(): SkyIndicatorIconType {
    return this._indicatorType || INDICATOR_TYPE_DEFAULT;
  }

  /**
   * Specifies the predefined text to be read by screen readers for users
   * who cannot see the indicator icon. The valid options are `none`, `custom`,
   * `error`, `warning`, `completed`, and `important-info`.
   * @required
   */
  @Input()
  public set descriptionType(value: SkyIndicatorDescriptionType) {
    this._descriptionType = value;
    this.updateDescriptionComputed();
  }

  public get descriptionType(): SkyIndicatorDescriptionType {
    return this._descriptionType;
  }

  /**
   * Specifies the text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string) {
    this._customDescription = value;
    this.updateDescriptionComputed();
  }

  public get customDescription(): string {
    return this._customDescription;
  }

  public descriptionComputed: string;

  public baseIcon: SkyIconStackItem;

  public icon: string;

  public topIcon: SkyIconStackItem;

  private _indicatorType: SkyIndicatorIconType;

  private _descriptionType: SkyIndicatorDescriptionType;

  private _customDescription: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resources: SkyLibResourcesService
  ) {}

  private updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.indicatorType
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }

  private updateDescriptionComputed(): void {
    if (this.descriptionType) {
      switch (this.descriptionType) {
        case 'none':
          this.descriptionComputed = '';
          break;
        case 'custom':
          this.descriptionComputed = this.customDescription;
          break;
        default:
          this.resources
            .getString(
              'skyux_status_indicator_sr_' +
                this.descriptionType.replace(/-/g, '_')
            )
            .subscribe((value) => {
              this.descriptionComputed = value;
              this.changeDetector.markForCheck();
            });

          break;
      }
    } else {
      this.descriptionComputed = undefined;
    }
  }
}
