import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  imports: [SkyIconModule, SkyPageModule, SkyTabsModule],
  selector: 'app-fit-layout',
  templateUrl: './fit-layout.component.html',
  styleUrls: ['./fit-layout.component.scss'],
})
export class FitLayoutComponent {}
export default FitLayoutComponent;
