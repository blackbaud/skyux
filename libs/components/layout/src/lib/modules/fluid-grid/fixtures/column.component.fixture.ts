import { Component } from '@angular/core';

import { SkyFluidGridModule } from '../fluid-grid.module';

@Component({
  imports: [SkyFluidGridModule],
  selector: 'sky-test-cmp',
  templateUrl: './column.component.fixture.html',
})
export class ColumnTestComponent {
  public xsSize: number | undefined = 1;
  public smallSize: number | undefined = 1;
  public mediumSize: number | undefined = 2;
  public largeSize: number | undefined = 5;
}
