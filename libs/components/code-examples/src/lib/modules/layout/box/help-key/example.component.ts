import { Component } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-layout-box-help-key-example',
  templateUrl: './example.component.html',
  imports: [SkyBoxModule, SkyDropdownModule],
})
export class LayoutBoxHelpKeyExampleComponent {}
