import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerConfig,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject, timer } from 'rxjs';
import { first } from 'rxjs/operators';

import { columnDefinitions, data } from '../shared/baseball-players-data';

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

  public dataState: SkyDataManagerState;
  public items = data.slice(0, 50);
  public settingsKey = 'ag-grid-storybook-data-manager';
  public gridOptions: GridOptions;
  public isActive$ = new BehaviorSubject(true);
  public gridSettings: UntypedFormGroup;
  public ready = new BehaviorSubject(false);

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dataManagerService: SkyDataManagerService,
    private agGridService: SkyAgGridService
  ) {}

  public ngOnInit(): void {
    this.gridSettings = this.formBuilder.group({
      enableTopScroll: this.enableTopScroll,
      domLayout: this.domLayout,
    });

    this.applyGridOptions();

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive$.next(id === this.viewId);
    });

    this.dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
      settingsKey: this.settingsKey,
    });

    this.dataManagerService.initDataView({
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
          id: col.field,
          label: col.headerName,
          alwaysDisplayed: ['select'].includes(col.field),
        };
      }),
    });

    this.gridSettings.valueChanges.subscribe((value) => {
      this.isActive$.next(false);
      this.enableTopScroll = value.enableTopScroll;
      this.domLayout = value.domLayout;
      this.applyGridOptions();
      setTimeout(() => this.isActive$.next(true));
    });
  }

  private applyGridOptions() {
    this.gridOptions = this.agGridService.getGridOptions({
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
        onGridReady: () => {
          // Delay to allow the grid to render before capturing the screenshot.
          timer(800)
            .pipe(first())
            .subscribe(() => this.ready.next(true));
        },
      },
    });
  }
}
