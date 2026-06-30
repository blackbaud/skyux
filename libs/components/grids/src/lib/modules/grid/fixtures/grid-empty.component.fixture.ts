import { Component, TemplateRef, ViewChild, input } from '@angular/core';

import { SkyGridColumnModel } from '../grid-column.model';
import { SkyGridComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-empty.component.fixture.html',
  standalone: false,
})
export class GridEmptyTestComponent {
  @ViewChild(SkyGridComponent, {
    read: SkyGridComponent,
    static: true,
  })
  public grid: SkyGridComponent;

  @ViewChild(TemplateRef)
  public template: TemplateRef<unknown>;

  public columns = input<SkyGridColumnModel[] | undefined>(undefined);
  public selectedColumnIds = input<string[] | undefined>(undefined);
  public settingsKey = input<string | undefined>(undefined);

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
