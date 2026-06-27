import { Component, signal } from '@angular/core';
import { SkyFluidGridGutterSizeType, SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'sky-fluid-grid-fixture',
  templateUrl: './fluid-grid-test.component.html',
  styles: [
    `
      .highlight-columns .sky-column {
        background-color: #97eced;
        border: 1px solid #56e0e1;
        overflow-wrap: break-word;
      }
    `,
  ],
  imports: [SkyFluidGridModule],
})
export class FluidGridHarnessTestComponent {
  public gutterSize = signal<SkyFluidGridGutterSizeType | undefined>(undefined);

  public disableMargin = signal(false);
}
