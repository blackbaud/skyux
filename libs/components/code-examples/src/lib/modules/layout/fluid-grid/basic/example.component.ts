import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyFluidGridGutterSizeType, SkyFluidGridModule } from '@skyux/layout';

/**
 * @title Fluid grid with basic setup
 */
@Component({
  selector: 'app-layout-fluid-grid-basic-example',
  templateUrl: './example.component.html',
  styles: [
    `
      .highlight-columns .sky-column {
        border: 1px solid var(--sky-theme-color-classify-1-heavy);
        overflow-wrap: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyFluidGridModule],
})
export class LayoutFluidGridBasicExampleComponent {
  public gutterSize: SkyFluidGridGutterSizeType | undefined;
}
