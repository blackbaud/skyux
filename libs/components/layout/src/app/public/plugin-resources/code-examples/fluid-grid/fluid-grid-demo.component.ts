import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-fluid-grid-demo',
  templateUrl: './fluid-grid-demo.component.html',
  styles: [`
    .highlight-columns .sky-column {
      background-color: #97eced;
      border: 1px solid #56e0e1;
      overflow-wrap: break-word;
    }`
  ]
})
export class FluidGridDemoComponent { }
