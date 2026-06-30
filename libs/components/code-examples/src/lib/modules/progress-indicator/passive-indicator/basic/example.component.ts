import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

/**
 * @title Passive progress indicator
 */
@Component({
  selector: 'app-progress-indicator-passive-indicator-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyProgressIndicatorModule],
})
export class ProgressIndicatorPassiveIndicatorBasicExampleComponent {}
