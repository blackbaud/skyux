import {
  Component
} from '@angular/core';

import {
  SkyFluidGridGutterSize
} from '../fluid-grid-gutter-size';

@Component({
  selector: 'sky-test-fluid-grid',
  templateUrl: './fluid-grid.component.fixture.html'
})
export class FluidGridTestComponent {

  public disableMargin: boolean;

  public gutterSize: SkyFluidGridGutterSize;

}
