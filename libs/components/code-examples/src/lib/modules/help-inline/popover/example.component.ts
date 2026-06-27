import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @title Help inline button with popover
 */
@Component({
  imports: [SkyHelpInlineModule],
  selector: 'app-help-inline-popover-example',
  templateUrl: './example.component.html',
})
export class HelpInlinePopoverExampleComponent {}
