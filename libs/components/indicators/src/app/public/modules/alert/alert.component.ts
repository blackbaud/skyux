import { Component, EventEmitter, Input, Output } from '@angular/core';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: ['./alert.component.scss'],
  templateUrl: './alert.component.html'
})
export class SkyAlertComponent {
  @Input()
  public set alertType(value: string) {
    this._alertType = value;
  }

  public get alertType() {
    return this._alertType || ALERT_TYPE_DEFAULT;
  }

  @Input()
  public closeable: boolean;

  @Input()
  public closed: boolean;

  @Output()
  public closedChange = new EventEmitter<boolean>();

  private _alertType: string;

  public close() {
    this.closed = true;
    this.closedChange.emit(true);
  }
}
