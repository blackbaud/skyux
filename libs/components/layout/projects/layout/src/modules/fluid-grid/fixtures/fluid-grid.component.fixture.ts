import {
  Component
} from '@angular/core';

import {
  SkyFluidGridGutterSizeType
} from '../types/fluid-grid-gutter-size-type';

@Component({
  selector: 'sky-test-fluid-grid',
  templateUrl: './fluid-grid.component.fixture.html'
})
export class FluidGridTestComponent {

  public disableMargin: boolean;

  public gutterSize: SkyFluidGridGutterSizeType;

}
