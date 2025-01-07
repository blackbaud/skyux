import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyHelpInlineModule],
})
export class DemoComponent {
  public onActionClick(): void {
    alert('Use help inline to show supplemental information to the user.');
  }
}
