import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  standalone: false,
})
export class AlertDemoComponent {
  public alertCloseable = true;
}
