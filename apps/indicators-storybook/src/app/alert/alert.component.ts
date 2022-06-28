import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AlertComponent {
  public readonly variations = ['info', 'success', 'warning', 'danger'];
  public readonly closeable = [true, false];
}
