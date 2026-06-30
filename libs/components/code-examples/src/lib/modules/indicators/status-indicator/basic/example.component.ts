import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @title Status indicator with basic setup
 */
@Component({
  selector: 'app-indicators-status-indicator-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyStatusIndicatorModule],
})
export class IndicatorsStatusIndicatorBasicExampleComponent {}
