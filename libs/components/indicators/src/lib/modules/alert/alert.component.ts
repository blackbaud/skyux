import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subscription } from 'rxjs';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html',
})
export class SkyAlertComponent implements OnInit, OnDestroy {
  /**
   * Specifies a style for the alert to determine the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set alertType(value: SkyIndicatorIconType | undefined) {
    if (value !== this.alertTypeOrDefault) {
      this.alertTypeOrDefault = value || ALERT_TYPE_DEFAULT;
      this.#updateAlertIcon();
    }
  }

  /**
   * Indicates whether to include a close button for users to dismiss the alert.
   * @default false
   */
  @Input()
  public closeable: boolean | undefined;

  /**
   * Indicates whether the alert is closed.
   * @default false
   */
  @Input()
  public closed: boolean | undefined;

  /**
   * Specifies the predefined text to be read by screen readers for users who cannot see the alert icon.
   * This property is optional but will be required in future versions of SKY UX.
   */
  @Input()
  public set descriptionType(value: SkyIndicatorDescriptionType | undefined) {
    this.#_descriptionType = value;
    this.#updateDescriptionComputed();
  }

  /**
   * Specifies the text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string | undefined) {
    this.#_customDescription = value;
    this.#updateDescriptionComputed();
  }

  /**
   * Fires when users close the alert.
   */
  @Output()
  public closedChange = new EventEmitter<boolean>();

  public alertBaseIcon: SkyIconStackItem | undefined;

  public alertTopIcon: SkyIconStackItem | undefined;

  public alertTypeOrDefault: SkyIndicatorIconType = ALERT_TYPE_DEFAULT;

  public descriptionComputed: string | undefined;

  #_descriptionType: SkyIndicatorDescriptionType | undefined;

  #_customDescription: string | undefined;

  #descriptionTypeResourceSubscription: Subscription | undefined;

  #resources: SkyLibResourcesService;

  constructor(resources: SkyLibResourcesService) {
    this.#resources = resources;
  }

  public ngOnInit(): void {
    this.#updateAlertIcon();
  }

  public ngOnDestroy(): void {
    this.#unsubscribe();
  }

  public close(): void {
    this.closed = true;
    this.closedChange.emit(true);
  }

  #updateAlertIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.alertTypeOrDefault
    );

    this.alertBaseIcon = indicatorIcon.modernThemeBaseIcon;
    this.alertTopIcon = indicatorIcon.modernThemeTopIcon;
  }

  #updateDescriptionComputed(): void {
    this.#unsubscribe();

    if (this.#_descriptionType) {
      switch (this.#_descriptionType) {
        case 'none':
          this.descriptionComputed = undefined;
          break;
        case 'custom':
          this.descriptionComputed = this.#_customDescription;
          break;
        default:
          this.#descriptionTypeResourceSubscription = this.#resources
            .getString(
              'skyux_alert_sr_' + this.#_descriptionType.replace(/-/g, '_')
            )
            .subscribe((value) => {
              this.descriptionComputed = value;
            });

          break;
      }
    } else {
      this.descriptionComputed = undefined;
    }
  }

  #unsubscribe(): void {
    if (this.#descriptionTypeResourceSubscription) {
      this.#descriptionTypeResourceSubscription.unsubscribe();
      this.#descriptionTypeResourceSubscription = undefined;
    }
  }
}
