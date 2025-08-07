import { Component } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyTabsModule } from '@skyux/tabs';

/**
 * @title Tab with summary action bar
 * @docsDemoHidden
 */
@Component({
  selector: 'app-action-bars-summary-action-bar-tab-example',
  templateUrl: './example.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule, SkyTabsModule],
})
export class ActionBarsSummaryActionBarTabExampleComponent {
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
