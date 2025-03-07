import { Component } from '@angular/core';
import { SkyFluidGridModule, SkyPageModule } from '@skyux/layout';

/**
 * @title Page with basic setup
 */
@Component({
  selector: 'app-layout-page-layout-fit-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [SkyFluidGridModule, SkyPageModule],
})
export class LayoutPageLayoutFitExampleComponent {}
