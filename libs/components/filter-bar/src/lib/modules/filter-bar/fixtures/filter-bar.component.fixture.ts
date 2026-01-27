import { Component, model } from '@angular/core';

import { of } from 'rxjs';

import { SkyFilterBarModule } from '../filter-bar.module';
import { SkyFilterBarFilterItem } from '../models/filter-bar-filter-item';
import { SkyFilterItemLookupSearchAsyncArgs } from '../models/filter-item-lookup-search-async-args';
import { SkyFilterItemModalOpenedArgs } from '../models/filter-item-modal-opened-args';
import { SkyFilterItemModalSizeType } from '../models/filter-item-modal-size';

import { SkyFilterBarModalTestComponent } from './filter-modal-test.component.fixture';

@Component({
  selector: 'sky-test-cmp',
  imports: [SkyFilterBarModule],
  templateUrl: './filter-bar.component.fixture.html',
})
export class SkyFilterBarTestComponent {
  public appliedFilters = model<SkyFilterBarFilterItem[]>();

  public selectedFilterIds = model<string[] | undefined>(['1', '2', '3', '4']);

  public modalComponent = model(SkyFilterBarModalTestComponent);

  public modalSize = model<SkyFilterItemModalSizeType>('medium');

  public onModalOpened(args: SkyFilterItemModalOpenedArgs): void {
    args.data = of({ value: 'context' });
  }

  public searchCalls: SkyFilterItemLookupSearchAsyncArgs[] = [];

  public onSearchAsync(args: SkyFilterItemLookupSearchAsyncArgs): void {
    this.searchCalls.push({ ...args });
    args.result = of({
      items: [
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
      ],
      totalCount: 3,
    });
  }
}
