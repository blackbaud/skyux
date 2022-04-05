import { Component, OnInit } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { SkyDataManagerFiltersModalVisualComponent } from './data-filter-modal.component';
import { LocalStorageConfigService } from './local-storage-config.service';

@Component({
  selector: 'app-data-manager-visual',
  templateUrl: './data-manager-visual.component.html',
  providers: [
    SkyDataManagerService,
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService,
    },
  ],
})
export class DataManagerVisualComponent implements OnInit {
  public dataManagerConfig = {
    filterModalComponent: SkyDataManagerFiltersModalVisualComponent,
    sortOptions: [
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
    ],
  };

  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: true,
      filters: {
        hideOrange: true,
      },
    },
    views: [
      {
        viewId: 'gridView',
        displayedColumnIds: ['selected', 'name', 'description'],
      },
    ],
  });

  public dataState: SkyDataManagerState;

  public items: any[] = [
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
  public activeViewId = 'repeaterView';
  public settingsKey = 'test';

  constructor(private dataManagerService: SkyDataManagerService) {
    this.dataManagerService
      .getDataStateUpdates('dataManager')
      .subscribe((state) => (this.dataState = state));
    this.dataManagerService
      .getActiveViewIdUpdates()
      .subscribe((activeViewId) => (this.activeViewId = activeViewId));
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
      settingsKey: this.settingsKey,
    });
  }

  public searchSo() {
    this.dataState.searchText = 'so';
    this.dataManagerService.updateDataState(this.dataState, 'dataManager');
  }
}
