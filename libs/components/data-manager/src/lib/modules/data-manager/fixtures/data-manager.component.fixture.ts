import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { SkyDataManagerComponent } from '../data-manager.component';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerConfig } from '../models/data-manager-config';
import { SkyDataManagerState } from '../models/data-manager-state';

import { DataViewRepeaterFixtureComponent } from './data-manager-repeater-view.component.fixture';
import { DataManagerTestItem } from './data-manager-test-item';

@Component({
  selector: 'sky-data-manager-fixture',
  templateUrl: './data-manager.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DataManagerFixtureComponent implements OnInit {
  @ViewChild(SkyDataManagerComponent)
  public dataManagerComponent!: SkyDataManagerComponent;

  @ViewChild(DataViewRepeaterFixtureComponent)
  public repeaterView!: DataViewRepeaterFixtureComponent;

  public activeViewId = 'repeaterView';

  public dataManagerConfig: SkyDataManagerConfig = {
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

  public dataManagerSourceId = 'dataManagerFixture';

  public items: DataManagerTestItem[] = [
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
  ];

  public settingsKey: string | undefined;

  public get dataState(): SkyDataManagerState {
    return this.#dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this.#dataState = value;
    this.#dataManagerService.updateDataState(value, this.dataManagerSourceId);
  }

  #dataState: SkyDataManagerState = new SkyDataManagerState({
    filterData: {
      filtersApplied: true,
      filters: {
        hideOrange: true,
      },
    },
  });

  #dataManagerService: SkyDataManagerService;

  constructor(dataManagerService: SkyDataManagerService) {
    this.#dataManagerService = dataManagerService;
    dataManagerService
      .getDataStateUpdates(this.dataManagerSourceId)
      .subscribe((state) => {
        this.#dataState = state;
      });
    dataManagerService
      .getActiveViewIdUpdates()
      .subscribe((activeViewId) => (this.activeViewId = activeViewId));
  }

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.dataState,
      settingsKey: this.settingsKey,
    });
  }
}
