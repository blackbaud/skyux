import { Component } from '@angular/core';
import {
  SkySummaryActionBarError,
  SkySummaryActionBarModule,
} from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

/**
 * @title Summary action bar with errors
 * @docsDemoHidden
 */
@Component({
  selector: 'app-action-bars-summary-action-bar-error-example',
  templateUrl: './example.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule],
})
export class ActionBarsSummaryActionBarErrorExampleComponent {
  public error: SkySummaryActionBarError[] | undefined;

  public onPrimaryActionClick(): void {
    alert('Primary action button clicked.');
  }

  public onSecondaryActionClick(): void {}

  public onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
