import { Component } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

/**
 * @title Basic summary action bar
 * @docsDemoHidden
 */
@Component({
  selector: 'app-action-bars-summary-action-bar-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule],
})
export class ActionBarsSummaryActionBarBasicExampleComponent {
  public onPrimaryActionClick(): void {
    alert('Primary action button clicked.');
  }

  public onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  public onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
