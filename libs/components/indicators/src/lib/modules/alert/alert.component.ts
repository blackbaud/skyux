import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SkyIndicatorIcon } from '../shared/indicator-icon';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAlertComponent {
  // TODO: Change alertType to SkyIndicatorIconType in a breaking change.
  /**
   * Specifies a style for the alert to determine the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set alertType(value: string | undefined) {
    this.#_alertType = value;
    if (this.alertType !== this.alertTypeOrDefault) {
      this.alertTypeOrDefault = this.alertType || ALERT_TYPE_DEFAULT;
      this.indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
        this.alertTypeOrDefault as SkyIndicatorIconType
      );
    }
  }

  public get alertType(): string | undefined {
    return this.#_alertType;
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

  public alertTypeOrDefault: string = ALERT_TYPE_DEFAULT;

  public indicatorIcon: SkyIndicatorIcon =
    SkyIndicatorIconUtility.getIconsForType(
      this.alertTypeOrDefault as SkyIndicatorIconType
    );

  #_alertType: string | undefined;

  public close(): void {
    this.closed = true;
    this.closedChange.emit(true);
  }
}
