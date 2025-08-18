import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @title Help inline button with action click
 */
@Component({
  imports: [SkyHelpInlineModule],
  selector: 'app-help-inline-action-click-example',
  templateUrl: './example.component.html',
})
export class HelpInlineActionClickExampleComponent {
  public onActionClick(): void {
    alert('Use help inline to show supplemental information to the user.');
  }
}
