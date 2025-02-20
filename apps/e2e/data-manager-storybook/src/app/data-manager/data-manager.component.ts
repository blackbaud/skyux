import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.scss'],
  providers: [SkyDataManagerService],
  standalone: false,
})
export class DataManagerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public activeView = 'view-1';

  public readonly ready = new BehaviorSubject(false);

  #dataManagerService = inject(SkyDataManagerService);
  #fontLoadingService = inject(FontLoadingService);
  #subscriptions = new Subscription();

  public ngOnInit(): void {
    this.#dataManagerService.initDataManager({
      activeViewId: this.activeView,
      dataManagerConfig: {
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
      },
      defaultDataState: new SkyDataManagerState({
        filterData: {
          filtersApplied: true,
          filters: {
            hideOrange: true,
          },
        },
        views: [
          {
            viewId: 'view-1',
          },
          {
            viewId: 'view-2',
            displayedColumnIds: ['selected', 'name', 'description'],
          },
        ],
      }),
    });

    this.#dataManagerService.initDataView({
      id: 'view-1',
      name: 'View 1',
      icon: 'list-ul',
      searchEnabled: true,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: false,
    });

    this.#dataManagerService.initDataView({
      id: 'view-2',
      name: 'View 2',
      icon: 'table',
      searchEnabled: true,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: false,
    });
  }

  public ngAfterViewInit(): void {
    this.#subscriptions.add(
      this.#fontLoadingService.ready(true).subscribe(() => {
        this.ready.next(true);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
