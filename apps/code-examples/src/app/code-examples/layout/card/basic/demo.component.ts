import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyCardModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, SkyCardModule, SkyCheckboxModule, SkyDropdownModule],
})
export class DemoComponent {
  protected showAction = true;
  protected showCheckbox = true;
  protected showContent = true;
  protected showTitle = true;

  protected triggerAlert(): void {
    alert('Action clicked!');
  }
}
