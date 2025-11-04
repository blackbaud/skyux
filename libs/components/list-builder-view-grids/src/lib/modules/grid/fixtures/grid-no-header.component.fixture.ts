import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyGridLegacyColumnModel } from '../grid-column.model';
import { SkyGridLegacyComponent } from '../grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-no-header.component.fixture.html',
  standalone: false,
})
export class GridNoHeaderTestComponent {
  public columns: SkyGridLegacyColumnModel[];

  public data: any[] = [
    {
      id: '1',
      column1: '1',
      column2: 'Apple',
    },
    {
      id: '2',
      column1: '01',
      column2: 'Banana',
    },
  ];

  public selectedColumnIds: string[];

  public settingsKey: string;

  @ViewChild(SkyGridLegacyComponent)
  public grid: SkyGridLegacyComponent;

  @ViewChild(TemplateRef)
  public template: TemplateRef<unknown>;
}
