import { Component } from '@angular/core';
import { SkyFluidGridGutterSizeType, SkyFluidGridModule } from '@skyux/layout';

/**
 * @title Fluid grid with basic setup
 */
@Component({
  selector: 'app-layout-fluid-grid-example',
  templateUrl: './example.component.html',
  styles: [
    `
      .highlight-columns .sky-column {
        border: 1px solid var(--sky-theme-color-classify-1-heavy);
        overflow-wrap: break-word;
      }
    `,
  ],
  imports: [SkyFluidGridModule],
})
export class LayoutFluidGridExampleComponent {
  public gutterSize: SkyFluidGridGutterSizeType | undefined;
  public disableMargin = false;
}
