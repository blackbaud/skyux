import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  DataViewRepeaterFixtureComponent
} from './data-manager-repeater-view.component.fixture';

import {
  SkyDataManagerComponent
} from '../data-manager.component';

import {
  SkyDataManagerService,
  SkyDataManagerState
} from '../../../public_api';

@Component({
  selector: 'data-manager-fixture',
  templateUrl: './data-manager.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataManagerFixtureComponent implements OnInit {

  @ViewChild(SkyDataManagerComponent)
  public dataManagerComponent: SkyDataManagerComponent;

  @ViewChild(DataViewRepeaterFixtureComponent)
  public repeaterView: DataViewRepeaterFixtureComponent;

  public activeViewId = 'repeaterView';

  public dataManagerConfig = {
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A - Z)',
        descending: false,
        propertyName: 'name'
      },
      {
        id: 'za',
        label: 'Name (Z - A)',
        descending: true,
        propertyName: 'name'
      }
    ]
  };

  public dataManagerSourceId = 'dataManagerFixture';

  public items: any[] = [
    {
      id: '1',
      name: 'Orange',
      description: 'A round, orange fruit. A great source of vitamin C.',
      type: 'citrus',
      color: 'orange'
    },
    {
      id: '2',
      name: 'Mango',
      description: 'Very difficult to peel. Delicious in smoothies, but don\'t eat the skin.',
      type: 'other',
      color: 'orange'
    },
    {
      id: '3',
      name: 'Lime',
      description: 'A sour, green fruit used in many drinks. It grows on trees.',
      type: 'citrus',
      color: 'green'
    },
    {
      id: '4',
      name: 'Strawberry',
      description: 'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
      type: 'berry',
      color: 'red'
    },
    {
      id: '5',
      name: 'Blueberry',
      description: 'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
      type: 'berry',
      color: 'blue'
    },
    {
      id: '6',
      name: 'Banana',
      description: 'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
      type: 'other',
      color: 'yellow'
    }
  ];

  public settingsKey: string = undefined;

  public get dataState(): SkyDataManagerState {
    return this._dataState;
  }

  public set dataState(value: SkyDataManagerState) {
    this._dataState = value;
    this.dataManagerService.updateDataState(value, this.dataManagerSourceId);
  }

  private _dataState: SkyDataManagerState = new SkyDataManagerState({
    filterData: {
      filtersApplied: true,
      filters: {
        hideOrange: true
      }
    }
  });

  constructor(
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService.getDataStateUpdates(this.dataManagerSourceId).subscribe(state => {
      this._dataState = state;
    });
    this.dataManagerService.getActiveViewIdUpdates().subscribe(activeViewId => this.activeViewId = activeViewId);
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.dataState
    });
  }
}
