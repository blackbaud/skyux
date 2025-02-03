import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

@Component({
  selector: 'app-help-inline-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyHelpInlineModule],
})
export class HelpInlineBasicExampleComponent {
  public onActionClick(): void {
    alert('Use help inline to show supplemental information to the user.');
  }
}
