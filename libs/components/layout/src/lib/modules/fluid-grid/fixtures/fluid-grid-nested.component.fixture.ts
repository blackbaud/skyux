import { Component, input } from '@angular/core';

import { SkyFluidGridGutterSizeType } from '../types/fluid-grid-gutter-size-type';

@Component({
  selector: 'sky-test-fluid-grid-nested',
  templateUrl: './fluid-grid-nested.component.fixture.html',
  standalone: false,
})
export class FluidGridNestedTestComponent {
  public outerGutterSize = input<SkyFluidGridGutterSizeType>('large');

  public innerGutterSize = input<SkyFluidGridGutterSizeType>('large');

  public innerInset = input(false);
}
