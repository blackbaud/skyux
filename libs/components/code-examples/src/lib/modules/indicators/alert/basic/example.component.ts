import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyAlert } from '@skyux/indicators';

/**
 * @title Alert with basic setup
 */
@Component({
  selector: 'app-indicators-alert-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyAlert],
})
export class IndicatorsAlertBasicExampleComponent {
  @Input()
  public days = 9;

  protected onClosedChange(event: boolean | undefined): void {
    alert(`Alert closed with: ${event}`);
  }
}
