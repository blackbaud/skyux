import { Component } from '@angular/core';

import { SkyFilterBarModule } from '../filter-bar.module';

import { SkyFilterBarModalTestComponent } from './filter-modal-test.component.fixture';

@Component({
  selector: 'sky-filter-bar-for-loop-test',
  imports: [SkyFilterBarModule],
  template: `
    <sky-filter-bar>
      @for (filter of filterItems; track filter.filterId) {
        <sky-filter-item-modal
          labelText="Hide Orange"
          modalSize="small"
          [filterId]="filter.filterId"
          [modalComponent]="filter.modalComponent"
        />
      }
    </sky-filter-bar>
  `,
})
export class SkyFilterBarForLoopTestComponent {
  public filterItems = [
    { filterId: 'filter-1', modalComponent: SkyFilterBarModalTestComponent },
  ];
}
