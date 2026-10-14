import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyPageModule } from '@skyux/pages';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

@Component({
  imports: [SkyButton, SkyPageModule, SkyVerticalTabsetModule],
  selector: 'app-vertical-tabs-fit-layout',
  templateUrl: './vertical-tabs-fit-layout.component.html',
  styleUrls: ['./vertical-tabs-fit-layout.component.scss'],
})
export class VerticalTabsFitLayoutComponent {}
export default VerticalTabsFitLayoutComponent;
