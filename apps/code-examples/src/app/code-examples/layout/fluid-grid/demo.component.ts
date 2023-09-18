import { Component } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  standalone: true,
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
export class DemoComponent {}
