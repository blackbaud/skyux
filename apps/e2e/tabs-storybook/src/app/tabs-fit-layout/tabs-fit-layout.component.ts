import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  imports: [SkyButton, SkyPageModule, SkyTabsModule],
  selector: 'app-tabs-fit-layout',
  templateUrl: './tabs-fit-layout.component.html',
  styleUrls: ['./tabs-fit-layout.component.scss'],
})
export class TabsFitLayoutComponent {}
export default TabsFitLayoutComponent;
