import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  public variations = ['info', 'success', 'warning', 'danger'];
  public closeable = [true, false];
}
