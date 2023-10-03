import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyHelpInlineModule, SkyProgressIndicatorModule],
})
export class DemoComponent {
  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
