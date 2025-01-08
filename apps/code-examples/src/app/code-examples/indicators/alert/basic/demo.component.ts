import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyAlertModule],
})
export class DemoComponent {
  @Input()
  public days = 9;

  protected onClosedChange(event: boolean): void {
    alert(`Alert closed with: ${event}`);
  }
}
