import { Component, ViewChild, TemplateRef } from '@angular/core';

import { SkyGridColumnModel } from '../grid-column.model';

import { SkyGridComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-empty.component.fixture.html',
})
export class GridEmptyTestComponent {
  @ViewChild(SkyGridComponent, {
    read: SkyGridComponent,
    static: true,
  })
  public grid: SkyGridComponent;

  @ViewChild(TemplateRef)
  public template: TemplateRef<any>;

  public columns: Array<SkyGridColumnModel>;
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
