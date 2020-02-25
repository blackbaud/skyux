import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html'
})
export class SkyAlertComponent {
  /**
   * Specifies a style for the alert to determine the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set alertType(value: string) {
    this._alertType = value;
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

  private _alertType: string;

  public close(): void {
    this.closed = true;
    this.closedChange.emit(true);
  }
}
