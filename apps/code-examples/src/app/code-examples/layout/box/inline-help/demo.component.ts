import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyBoxModule, SkyDropdownModule, SkyHelpInlineModule],
})
export class DemoComponent {
  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
