import {
  Component,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  SkyGridColumnModel
} from '../grid-column.model';

import { SkyGridComponent
} from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  template: require('./grid-no-header.component.fixture.html')
})
export class GridNoHeaderTestComponent {

  public columns: Array<SkyGridColumnModel>;

  public data: any[] = [
    {
      id: '1',
      column1: '1',
      column2: 'Apple'
    },
    {
      id: '2',
      column1: '01',
      column2: 'Banana'
    }
  ];

  public selectedColumnIds: string[];

  public settingsKey: string;

  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent;

  @ViewChild(TemplateRef)
  public template: TemplateRef<any>;
}
