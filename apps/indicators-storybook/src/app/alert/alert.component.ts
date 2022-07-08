import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  public readonly variations = ['info', 'success', 'warning', 'danger'];
  public readonly closeable = [true, false];
}
