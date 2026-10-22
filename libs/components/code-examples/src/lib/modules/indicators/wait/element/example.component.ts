import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';

/**
 * @title Wait applied to an element
 */
@Component({
  selector: 'app-indicators-wait-element-example',
  styles: `
    .wrapper {
      height: 200px;
      width: 200px;
      margin: 10px;
    }
  `,
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton, SkyWaitModule],
})
export class IndicatorsWaitElementExampleComponent {
  protected isWaiting = false;
}
