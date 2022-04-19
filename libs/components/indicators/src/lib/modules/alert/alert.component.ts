import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html',
})
export class SkyAlertComponent implements OnInit {
  /**
   * Specifies a style for the alert to determine the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set alertType(value: string) {
    this._alertType = value;
    this.updateAlertIcon();
  }

  public get alertType(): string {
    return this._alertType || ALERT_TYPE_DEFAULT;
  }

  /**
   * Indicates whether to include a close button for users to dismiss the alert.
   * @default false
   */
  @Input()
  public closeable: boolean;

  /**
   * Indicates whether the alert is closed.
   * @default false
   */
  @Input()
  public closed: boolean;

  /**
   * Fires when users close the alert.
   */
  @Output()
  public closedChange = new EventEmitter<boolean>();

  public alertBaseIcon: SkyIconStackItem;

  public alertTopIcon: SkyIconStackItem;

  private _alertType: string;

  public ngOnInit(): void {
    this.updateAlertIcon();
  }

  public close(): void {
    this.closed = true;
    this.closedChange.emit(true);
  }

  private updateAlertIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.alertType as SkyIndicatorIconType
    );

    this.alertBaseIcon = indicatorIcon.modernThemeBaseIcon;
    this.alertTopIcon = indicatorIcon.modernThemeTopIcon;
  }
}
