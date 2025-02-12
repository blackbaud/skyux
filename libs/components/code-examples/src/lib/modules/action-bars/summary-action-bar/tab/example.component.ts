import { Component } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyTabsModule } from '@skyux/tabs';

/**
 * @title Tab with summary action bar
 * @demoHidden
 */
@Component({
  selector: 'app-action-bars-summary-action-bar-tab-example',
  templateUrl: './example.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule, SkyTabsModule],
})
export class ActionBarsSummaryActionBarTabExampleComponent {
  protected onPrimaryActionClick(): void {
    alert('Primary action button clicked.');
  }

  protected onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  protected onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
