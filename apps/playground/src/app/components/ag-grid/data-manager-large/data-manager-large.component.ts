import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerConfig,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { CustomLinkComponent } from './custom-link/custom-link.component';
import {
  columnDefinitions,
  columnDefinitionsGrouped,
  data,
} from './data-set-large';

@Component({
  selector: 'app-data-manager-large',
  templateUrl: './data-manager-large.component.html',
  styleUrls: ['./data-manager-large.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DataManagerLargeComponent implements OnInit {
  @HostBinding('class.use-normal-dom-layout')
  public get useNormalDomLayout(): boolean {
    return this.domLayout === 'normal';
  }

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
          'credit_line',
          'object_date',
          'title',
          'artist_display_name',
          'artist_display_bio',
          'accessionyear',
          'repository',
          'object_wikidata_url',
          'artist_wikidata_url',
          'link_resource',
        ],
      },
    ],
  });

  public viewId = 'gridView';

  public dataState: SkyDataManagerState;
  public items = data;
  public settingsKey = 'large-test';
  public gridOptions: GridOptions;
  public isActive$ = new BehaviorSubject(true);
  public gridSettings: UntypedFormGroup;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  public enableTopScroll = true;
  public useColumnGroups = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dataManagerService: SkyDataManagerService,
    private agGridService: SkyAgGridService
  ) {
    this.gridSettings = this.formBuilder.group({
      enableTopScroll: this.enableTopScroll,
      useColumnGroups: this.useColumnGroups,
      domLayout: this.domLayout,
    });
  }

  public ngOnInit(): void {
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
      searchEnabled: true,
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
      this.useColumnGroups = value.useColumnGroups;
      this.domLayout = value.domLayout;
      this.applyGridOptions();
      setTimeout(() => this.isActive$.next(true));
    });
  }

  private applyGridOptions() {
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        defaultColGroupDef: {
          columnGroupShow: 'open',
        },
        columnDefs: this.useColumnGroups
          ? columnDefinitionsGrouped
          : columnDefinitions,
        columnTypes: {
          custom_link: {
            cellRendererFramework: CustomLinkComponent,
          },
        },
        context: {
          enableTopScroll: this.enableTopScroll,
        },
        domLayout: this.domLayout,
      },
    });
  }
}
