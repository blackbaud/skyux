import { Component, Type, model } from '@angular/core';

import { of } from 'rxjs';

import { SkyFilterBarModule } from '../filter-bar.module';
import { SkyFilterBarFilterItem } from '../models/filter-bar-filter-item';
import { SkyFilterBarFilterModalOpenedArgs } from '../models/filter-bar-filter-modal-opened-args';
import { SkyFilterBarFilterModalSizeType } from '../models/filter-bar-filter-modal-size';

@Component({
  selector: 'sky-test-cmp',
  imports: [SkyFilterBarModule],
  templateUrl: './filter-bar.component.fixture.html',
})
export class SkyFilterBarTestComponent {
  public appliedFilters = model<SkyFilterBarFilterItem[]>();

  public selectedFilterIds = model<string[] | undefined>(['1', '2', '3']);

  public modalComponent = model<Type<unknown>>(class {});

  public modalSize = model<SkyFilterBarFilterModalSizeType>();

  public onModalOpened(args: SkyFilterBarFilterModalOpenedArgs): void {
    args.data = of({ value: 'context' });
  }
}
