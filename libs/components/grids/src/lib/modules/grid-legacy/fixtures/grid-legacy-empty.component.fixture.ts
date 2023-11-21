import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyGridLegacyColumnModel } from '../grid-legacy-column.model';
import { SkyGridLegacyComponent } from '../grid-legacy.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-legacy-empty.component.fixture.html',
})
export class GridLegacyEmptyTestComponent {
  @ViewChild(SkyGridLegacyComponent, {
    read: SkyGridLegacyComponent,
    static: true,
  })
  public grid: SkyGridLegacyComponent;

  @ViewChild(TemplateRef)
  public template: TemplateRef<unknown>;

  public columns: Array<SkyGridLegacyColumnModel>;
  public selectedColumnIds: string[];
  public settingsKey: string;

  public data: any[] = [
    {
      id: '1',
      column1: '1',
      column2: 'Apple',
      column3: 'Fruit',
    },
    {
      id: '2',
      column1: '01',
      column2: 'Banana',
      column3: 'Fruit',
    },
  ];
}
