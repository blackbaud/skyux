import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  imports: [SkyIconModule, SkyPageModule, SkyTabsModule],
  selector: 'app-tabs-fit-layout',
  templateUrl: './tabs-fit-layout.component.html',
  styleUrls: ['./tabs-fit-layout.component.scss'],
})
export class TabsFitLayoutComponent {}
export default TabsFitLayoutComponent;
