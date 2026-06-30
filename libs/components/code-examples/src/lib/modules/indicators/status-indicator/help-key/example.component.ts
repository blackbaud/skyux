import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @title Status indicator with help key
 */
@Component({
  selector: 'app-indicators-status-indicator-help-key-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyStatusIndicatorModule],
})
export class IndicatorsStatusIndicatorHelpKeyExampleComponent {}
