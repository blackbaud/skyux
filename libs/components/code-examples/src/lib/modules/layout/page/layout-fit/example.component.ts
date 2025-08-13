import { Component } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

/**
 * @title Page with basic setup
 * @docsDemoHidden
 */
@Component({
  selector: 'app-layout-page-layout-fit-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [SkyFluidGridModule, SkyPageModule],
})
export class LayoutPageLayoutFitExampleComponent {}
