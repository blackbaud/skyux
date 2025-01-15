import { Component } from '@angular/core';

import { SkyFluidGridModule } from '../fluid-grid.module';
import { SkyFluidGridGutterSizeType } from '../types/fluid-grid-gutter-size-type';

@Component({
  imports: [SkyFluidGridModule],
  selector: 'sky-test-fluid-grid',
  templateUrl: './fluid-grid.component.fixture.html',
})
export class FluidGridTestComponent {
  public disableMargin: boolean | undefined;

  public gutterSize: SkyFluidGridGutterSizeType | undefined;
}
