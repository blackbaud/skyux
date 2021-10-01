import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService
} from '../../../public-api';

@Component({
  selector: 'sky-data-view-cards-fixture',
  templateUrl: './data-manager-card-view.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewCardFixtureComponent implements OnInit {
  @Input()
  public items: any[];

  public dataState: SkyDataManagerState;
  public displayedItems: any[];
  public viewId = 'cardsView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Cards View',
    icon: 'th-large',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
    showSortButtonText: true
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
    ) { }

  public ngOnInit(): void {
    this.displayedItems = this.items;

    this.dataManagerService.initDataView(this.viewConfig);

    this.dataManagerService.getDataStateUpdates(this.viewId).subscribe(state => {
      this.dataState = state;
      this.changeDetector.detectChanges();
    });
  }
}
