import { Component, model } from '@angular/core';

import { SkyFilterBarModule } from '../filter-bar.module';
import { SkyFilterBarFilterItem } from '../models/filter-bar-filter-item';

@Component({
  selector: 'sky-test-cmp',
  imports: [SkyFilterBarModule],
  templateUrl: './filter-bar.component.fixture.html',
})
export class SkyFilterBarTestComponent {
  public filters = model<SkyFilterBarFilterItem[]>([
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]);

  public enableSelectionModal = model<boolean>(true);
}
