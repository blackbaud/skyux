import { Component, ViewChild } from '@angular/core';

import { SkyGridLegacyComponent } from '../grid-legacy.component';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <sky-grid [data]="data">
      <sky-grid-column field="column1" heading="Column1"> </sky-grid-column>
    </sky-grid>
  `,
})
export class GridLegacyUndefinedTestComponent {
  @ViewChild(SkyGridLegacyComponent)
  public grid: SkyGridLegacyComponent;

  public data: any[] = undefined;
}
