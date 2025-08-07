import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewConfig } from '../models/data-view-config';

import { DataManagerTestItem } from './data-manager-test-item';

@Component({
  selector: 'sky-data-view-cards-fixture',
  templateUrl: './data-manager-card-view.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DataViewCardFixtureComponent implements OnInit {
  @Input()
  public items: DataManagerTestItem[] = [];

  public dataState: SkyDataManagerState | undefined;
  public displayedItems: DataManagerTestItem[] = [];
  public viewId = 'cardsView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Cards View',
    icon: 'th-large',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
    showSortButtonText: true,
  };

  #changeDetector: ChangeDetectorRef;
  #dataManagerService: SkyDataManagerService;

  constructor(
    changeDetector: ChangeDetectorRef,
    dataManagerService: SkyDataManagerService,
  ) {
    this.#changeDetector = changeDetector;
    this.#dataManagerService = dataManagerService;
  }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.#dataManagerService.initDataView(this.viewConfig);

    this.#dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.#changeDetector.detectChanges();
      });
  }
}
