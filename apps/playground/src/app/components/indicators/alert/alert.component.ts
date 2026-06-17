import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AlertDemoComponent {
  public alertCloseable = true;
}
