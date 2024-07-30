import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyHelpInlineModule, SkyStatusIndicatorModule],
})
export class DemoComponent {
  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
