import { Component, model } from '@angular/core';

import { SkyFilterBarModule } from '../filter-bar.module';
import { SkyFilterBarFilterItem } from '../models/filter-bar-filter-item';
import { SkyFilterBarFilterModalConfig } from '../models/filter-bar-filter-modal-config';

@Component({
  selector: 'sky-test-cmp',
  imports: [SkyFilterBarModule],
  templateUrl: './filter-bar.component.fixture.html',
})
export class SkyFilterBarTestComponent {
  public filters = model<SkyFilterBarFilterItem[]>();

  public selectedFilters = model<string[] | undefined>(['1', '2', '3']);

  public modalConfig: SkyFilterBarFilterModalConfig = {
    modalComponent: class {},
  };
}
