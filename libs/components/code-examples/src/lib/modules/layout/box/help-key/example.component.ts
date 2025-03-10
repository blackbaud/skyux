import { Component } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

/**
 * @title Box with help key
 */
@Component({
  selector: 'app-layout-box-help-key-example',
  templateUrl: './example.component.html',
  imports: [SkyBoxModule, SkyDropdownModule],
})
export class LayoutBoxHelpKeyExampleComponent {}
