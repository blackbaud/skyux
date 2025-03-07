import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyCardModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

/**
 * @title Card with basic setup
 */
@Component({
  selector: 'app-layout-card-basic-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, SkyCardModule, SkyCheckboxModule, SkyDropdownModule],
})
export class LayoutCardBasicExampleComponent {
  protected showAction = true;
  protected showCheckbox = true;
  protected showContent = true;
  protected showTitle = true;

  protected triggerAlert(): void {
    alert('Action clicked!');
  }
}
