import { Component, ViewChild } from '@angular/core';

import { SkyGridComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <sky-grid class="legacy" [data]="data">
      <sky-grid-column class="legacy" field="column1" heading="Column1" />
    </sky-grid>
  `,
  standalone: false,
})
export class GridUndefinedTestComponent {
  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent;

  public data: any[] = undefined;
}
