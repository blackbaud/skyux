import { Component, inject } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';

import { SkyFilterBarFilterValue } from '../models/filter-bar-filter-value';
import { SkyFilterItemModal } from '../models/filter-item-modal';
import { SkyFilterItemModalInstance } from '../models/filter-item-modal-instance';

@Component({
  selector: 'sky-test-modal',
  imports: [SkyModalModule],
  template: '',
})
export class SkyFilterBarModalTestComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);

  public save(filterValue: SkyFilterBarFilterValue): void {
    this.modalInstance.save(filterValue);
  }

  public cancel(): void {
    this.modalInstance.cancel();
  }
}
