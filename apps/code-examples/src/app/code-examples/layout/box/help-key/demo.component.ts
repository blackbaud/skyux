import { Component } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyBoxModule, SkyDropdownModule],
})
export class DemoComponent {}
