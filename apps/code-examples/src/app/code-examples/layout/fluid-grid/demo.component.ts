import { Component } from '@angular/core';
import { SkyFluidGridGutterSizeType, SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
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
export class DemoComponent {
  public gutterSize: SkyFluidGridGutterSizeType | undefined;
  public disableMargin = false;
}
