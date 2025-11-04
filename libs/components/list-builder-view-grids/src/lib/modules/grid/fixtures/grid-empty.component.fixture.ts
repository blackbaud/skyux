import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyGridLegacyColumnModel } from '../grid-column.model';
import { SkyGridLegacyComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-empty.component.fixture.html',
  standalone: false,
})
export class GridEmptyTestComponent {
  @ViewChild(SkyGridLegacyComponent, {
    read: SkyGridLegacyComponent,
    static: true,
  })
  public grid: SkyGridLegacyComponent;

  @ViewChild(TemplateRef)
  public template: TemplateRef<unknown>;

  public columns: SkyGridLegacyColumnModel[];
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
