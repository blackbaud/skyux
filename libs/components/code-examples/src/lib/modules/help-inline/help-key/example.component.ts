import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @title Help inline with help key
 */
@Component({
  imports: [SkyHelpInlineModule],
  selector: 'app-help-inline-help-key-example',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './example.component.html',
})
export class HelpInlineHelpKeyExampleComponent {}
