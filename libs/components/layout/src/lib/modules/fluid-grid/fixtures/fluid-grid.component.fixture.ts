import { Component, input } from '@angular/core';

import { SkyFluidGridGutterSizeType } from '../types/fluid-grid-gutter-size-type';

@Component({
  selector: 'sky-test-fluid-grid',
  templateUrl: './fluid-grid.component.fixture.html',
  standalone: false,
})
export class FluidGridTestComponent {
  public disableMargin = input<boolean | undefined>(undefined);

  public gutterSize = input<SkyFluidGridGutterSizeType | undefined>(undefined);
}
