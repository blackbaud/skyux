import { Component, model } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import { SkyDataManagerModule, SkyDataManagerState } from '@skyux/data-manager';
import { SkyFilterBarModule } from '@skyux/filter-bar';

import { of } from 'rxjs';

import { DataViewGridComponent } from './data-view-grid.component';
import { DataViewRepeaterComponent } from './data-view-repeater.component';
import { FRUIT_TYPE_LOOKUP_ITEMS } from './filters/fruit-type-lookup-data';
import { HideOrangeFilterModalComponent } from './filters/hide-orange-filter-modal.component';
import { FruitItem } from './fruit-item';
import { LocalStorageConfigService } from './local-storage-config.service';

@Component({
  selector: 'app-data-manager-visual',
  imports: [
    SkyDataManagerModule,
    DataViewGridComponent,
    DataViewRepeaterComponent,
    SkyFilterBarModule,
  ],
  templateUrl: './data-manager-visual.component.html',
  providers: [
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService,
    },
  ],
})
export class DataManagerVisualComponent {
  public sortOptions = [
    {
      id: 'az',
      label: 'Name (A - Z)',
      descending: false,
      propertyName: 'name',
    },
    {
      id: 'za',
      label: 'Name (Z - A)',
      descending: true,
      propertyName: 'name',
    },
  ];

  public defaultDataState = {
    additionalData: {
      currentPage: 1,
    },
    filterData: {
      filtersApplied: true,
      filters: {
        appliedFilters: [
          {
            filterId: 'hideOrange',
            filterValue: { value: true, displayValue: 'Hide orange fruits' },
          },
        ],
      },
    },
  };

  public items: FruitItem[] = [
    {
      id: '1',
      name: 'Orange',
      description: 'A round, orange fruit. A great source of vitamin C.',
      type: 'citrus',
      color: 'orange',
    },
    {
      id: '2',
      name: 'Mango',
      description:
        "Very difficult to peel. Delicious in smoothies, but don't eat the skin.",
      type: 'other',
      color: 'orange',
    },
    {
      id: '3',
      name: 'Lime',
      description:
        'A sour, green fruit used in many drinks. It grows on trees.',
      type: 'citrus',
      color: 'green',
    },
    {
      id: '4',
      name: 'Strawberry',
      description:
        'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
      type: 'berry',
      color: 'red',
    },
    {
      id: '5',
      name: 'Blueberry',
      description:
        'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
      type: 'berry',
      color: 'blue',
    },
    {
      id: '6',
      name: 'Banana',
      description:
        'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
      type: 'other',
      color: 'yellow',
    },
    {
      id: '7',
      name: 'Orange',
      description: 'A round, orange fruit. A great source of vitamin C.',
      type: 'citrus',
      color: 'orange',
    },
    {
      id: '8',
      name: 'Mango',
      description:
        "Very difficult to peel. Delicious in smoothies, but don't eat the skin.",
      type: 'other',
      color: 'orange',
    },
    {
      id: '9',
      name: 'Lime',
      description:
        'A sour, green fruit used in many drinks. It grows on trees.',
      type: 'citrus',
      color: 'green',
    },
    {
      id: '10',
      name: 'Strawberry',
      description:
        'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
      type: 'berry',
      color: 'red',
    },
    {
      id: '11',
      name: 'Blueberry',
      description:
        'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
      type: 'berry',
      color: 'blue',
    },
    {
      id: '12',
      name: 'Banana',
      description:
        'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
      type: 'other',
      color: 'yellow',
    },
  ];
  public settingsKey = 'test4';

  protected readonly hideOrangeModalComponent = HideOrangeFilterModalComponent;

  protected readonly searchText = model('');
  protected readonly state = model<SkyDataManagerState>();
  protected activeViewId: string | undefined;

  public searchSo(): void {
    this.searchText.set('so');
  }

  public onFruitTypeSearchAsync(args: { result?: unknown }): void {
    args.result = of({
      items: FRUIT_TYPE_LOOKUP_ITEMS,
      totalCount: FRUIT_TYPE_LOOKUP_ITEMS.length,
    });
  }
}
