import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerConfig,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject, Observable, combineLatest, timer } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { columnDefinitions, data } from '../shared/baseball-players-data';
import { FontLoadingService } from '../shared/font-loading/font-loading.service';

type GridSettingsType = {
  enableTopScroll: FormControl<boolean>;
  domLayout: FormControl<'normal' | 'autoHeight' | 'print'>;
};

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataManagerComponent implements OnInit {
  @HostBinding('class.use-normal-dom-layout')
  public get useNormalDomLayout(): boolean {
    return this.domLayout === 'normal';
  }

  @HostBinding('class.use-auto-height-dom-layout')
  public get useAutoHeightDomLayout(): boolean {
    return this.domLayout === 'autoHeight';
  }

  @Input()
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';

  @Input()
  public enableTopScroll = true;

  public dataManagerConfig: SkyDataManagerConfig = {};

  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {},
    },
    views: [
      {
        viewId: 'gridView',
        displayedColumnIds: [
          'select',
          'name',
          'birthday',
          'seasons_played',
          'all-star',
          /* spell-checker:disable-next-line */
          'triplecrown',
          'mvp',
          'cya',
          '3000h',
          '500hr',
          '1500rbi',
          '3000k',
          '300w',
          '300sv',
          'vote%',
        ],
      },
    ],
  });

  public viewId = 'gridView';

  public dataState: SkyDataManagerState | undefined;
  public items = data.slice(0, 50);
  public settingsKey = 'ag-grid-storybook-data-manager';
  public gridOptions: GridOptions = {};
  public isActive$ = new BehaviorSubject(true);
  public gridSettings: FormGroup<GridSettingsType>;
  public ready: Observable<boolean>;

  readonly #agGridService: SkyAgGridService;
  readonly #dataManagerService: SkyDataManagerService;
  readonly #gridReady = new BehaviorSubject(false);
  readonly #fontLoadingService: FontLoadingService;

  constructor(
    formBuilder: FormBuilder,
    dataManagerService: SkyDataManagerService,
    agGridService: SkyAgGridService,
    fontLoadingService: FontLoadingService
  ) {
    this.#agGridService = agGridService;
    this.#dataManagerService = dataManagerService;
    this.#fontLoadingService = fontLoadingService;

    this.gridSettings = formBuilder.group<GridSettingsType>({
      enableTopScroll: formBuilder.nonNullable.control(this.enableTopScroll),
      domLayout: formBuilder.nonNullable.control(this.domLayout),
    });
    this.ready = combineLatest([
      this.#gridReady,
      this.#fontLoadingService.ready(),
    ]).pipe(
      filter(([gridReady, fontsLoaded]) => gridReady && fontsLoaded),
      first(),
      map(() => true)
    );
  }

  public ngOnInit(): void {
    this.gridSettings.setValue({
      enableTopScroll: this.enableTopScroll,
      domLayout: this.domLayout,
    });
    this.#applyGridOptions();

    this.#dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive$.next(id === this.viewId);
    });

    this.#dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
      settingsKey: this.settingsKey,
    });

    this.#dataManagerService.initDataView({
      id: this.viewId,
      name: 'Grid View',
      icon: 'table',
      searchEnabled: false,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: true,
      columnOptions: columnDefinitions.map((col) => {
        return {
          id: col.field ?? '',
          label: col.headerName ?? '',
          alwaysDisplayed: ['select'].includes(col.field ?? ''),
        };
      }),
    });

    this.gridSettings.valueChanges.subscribe((value) => {
      this.isActive$.next(false);
      this.enableTopScroll = !!value.enableTopScroll;
      this.domLayout = value.domLayout ?? 'autoHeight';
      this.#applyGridOptions();
      setTimeout(() => this.isActive$.next(true));
    });
  }

  #applyGridOptions() {
    this.gridOptions = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs: [
          {
            field: 'select',
            headerName: '',
            width: 30,
            type: SkyCellType.RowSelector,
          },
          ...columnDefinitions,
        ],
        context: {
          enableTopScroll: this.enableTopScroll,
        },
        domLayout: this.domLayout,
        suppressColumnVirtualisation: true,
        suppressRowVirtualisation: true,
        onFirstDataRendered: () => {
          // Delay to allow the grid to render before capturing the screenshot.
          timer(800)
            .pipe(first())
            .subscribe(() => this.#gridReady.next(true));
        },
      },
    });
  }
}
