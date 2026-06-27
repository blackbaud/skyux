import { Component, signal } from '@angular/core';
import { SkyFilterBarFilterItem, SkyFilterBarModule } from '@skyux/filter-bar';

import { FilterModalComponent } from './filter-modal.component';

/**
 * @title Filter bar with modal filter example
 */
@Component({
  selector: 'app-filter-bar-modal-example',
  imports: [SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilterBarModalExampleComponent {
  protected readonly appliedFilters = signal<
    SkyFilterBarFilterItem[] | undefined
  >(undefined);

  protected modalComponent = FilterModalComponent;
}
