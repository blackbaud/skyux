import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyFluidGridGutterSizeType } from '../types/fluid-grid-gutter-size-type';

@Component({
  selector: 'sky-test-fluid-grid',
  templateUrl: './fluid-grid.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FluidGridTestComponent {
  public disableMargin: boolean | undefined;

  public gutterSize: SkyFluidGridGutterSizeType | undefined;
}
