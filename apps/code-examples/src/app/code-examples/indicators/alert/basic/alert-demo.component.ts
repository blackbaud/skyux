import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-demo',
  templateUrl: './alert-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDemoComponent {
  @Input()
  public days = 9;

  public onClosedChange(event: boolean): void {
    alert(`Alert closed with: ${event}`);
  }
}
