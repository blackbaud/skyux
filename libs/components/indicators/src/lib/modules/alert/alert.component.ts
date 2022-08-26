import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorIcon } from '../shared/indicator-icon';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html',
})
export class SkyAlertComponent implements OnInit {
  // TODO: Change alertType to SkyIndicatorIconType in a breaking change.
  /**
   * Specifies a style for the alert to determine the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set alertType(value: string | undefined) {
    if (value !== this.alertTypeOrDefault) {
      this.alertTypeOrDefault =
        (value as SkyIndicatorIconType) || ALERT_TYPE_DEFAULT;
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
   * Fires when users close the alert.
   */
  @Output()
  public closedChange = new EventEmitter<boolean>();

  public alertTypeOrDefault: SkyIndicatorIconType = ALERT_TYPE_DEFAULT;

  public alertBaseIcon: SkyIconStackItem | undefined;

  public alertTopIcon: SkyIconStackItem | undefined;

  public ngOnInit(): void {
    this.#updateAlertIcon();
  }

  public close(): void {
    this.closed = true;
    this.closedChange.emit(true);
  }

  #updateAlertIcon(): void {
    const indicatorIcon: SkyIndicatorIcon =
      SkyIndicatorIconUtility.getIconsForType(this.alertTypeOrDefault);

    this.alertBaseIcon = indicatorIcon.modernThemeBaseIcon;
    this.alertTopIcon = indicatorIcon.modernThemeTopIcon;
  }
}
