import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  SkyIconStackItem
} from '../icon/icon-stack-item';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html'
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
    let baseIcon: string;
    let topIcon: string;

    // tslint:disable-next-line: switch-default
    switch (this.alertType) {
      case 'danger':
      case 'warning':
        baseIcon = 'triangle-solid';
        topIcon = 'exclamation';
        break;
      case 'info':
        baseIcon = 'circle-solid';
        topIcon = 'help-i';
        break;
      case 'success':
        baseIcon = 'circle-solid';
        topIcon = 'check';
        break;
    }

    this.alertBaseIcon = {
      icon: baseIcon,
      iconType: 'skyux'
    };

    this.alertTopIcon = {
      icon: topIcon,
      iconType: 'skyux'
    };
  }
}
