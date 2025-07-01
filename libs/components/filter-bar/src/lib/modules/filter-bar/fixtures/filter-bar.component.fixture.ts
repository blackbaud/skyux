import { Component, model } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SkyFilterBarModule } from '../filter-bar.module';
import { SkyFilterBarFilterItem } from '../models/filter-bar-filter-item';
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

  public selectedFilterIds = model<string[] | undefined>(['1', '2', '3']);

  public modalComponent = model(SkyFilterBarModalTestComponent);

  public modalSize = model<SkyFilterItemModalSizeType>();

  public onModalOpened(args: SkyFilterItemModalOpenedArgs): void {
    args.data = of({ value: 'context' });
  }
}
