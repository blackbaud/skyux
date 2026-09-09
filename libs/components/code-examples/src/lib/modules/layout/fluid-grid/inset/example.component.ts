import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';

/**
 * @title Fluid grid with inset margins
 */
@Component({
  selector: 'app-layout-fluid-grid-inset-example',
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
export class LayoutFluidGridInsetExampleComponent {}
