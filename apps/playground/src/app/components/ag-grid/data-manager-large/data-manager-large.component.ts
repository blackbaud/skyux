import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
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

interface GridSettingsType {
  enableTopScroll: FormControl<boolean>;
  useColumnGroups: FormControl<boolean>;
  domLayout: FormControl<'normal' | 'autoHeight' | 'print'>;
  compact: FormControl<boolean>;
  wrapText: FormControl<boolean>;
  autoHeightColumns: FormControl<boolean>;
  showSelect: FormControl<boolean>;
}

@Component({
  selector: 'app-data-manager-large',
  templateUrl: './data-manager-large.component.html',
  styleUrls: ['./data-manager-large.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DataManagerLargeComponent implements OnInit {
  @HostBinding('class.use-normal-dom-layout')
  public get useNormalDomLayout(): boolean {
    return this.domLayout === 'normal';
  }

  @HostBinding('class.use-auto-height-dom-layout')
  public get useAutoHeightDomLayout(): boolean {
    return this.domLayout === 'autoHeight';
  }

  @Input()
  public compact = false;

  @Input()
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';

  @Input()
  public enableTopScroll = true;

  @Input()
  public useColumnGroups = false;

  @Input()
  public showSelect = true;

  @Input()
  public wrapText = false;

  @Input()
  public autoHeightColumns = false;

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
          /* spell-checker:disable-next-line */
          'accessionyear',
          'repository',
          'object_wikidata_url',
          'artist_wikidata_url',
          'link_resource',
        ],
      },
    ],
  });

  public readonly viewId = 'gridView';

  public dataState: SkyDataManagerState | undefined;
  public items = data;
  public readonly settingsKey = 'large-test';
  public gridOptions: GridOptions = {};
  public readonly isActive$ = new BehaviorSubject(true);
  public readonly gridSettings: FormGroup<GridSettingsType>;

  readonly #agGridService = inject(SkyAgGridService);
  readonly #dataManagerService = inject(SkyDataManagerService);

  constructor(formBuilder: FormBuilder) {
    this.gridSettings = formBuilder.group<GridSettingsType>({
      enableTopScroll: formBuilder.nonNullable.control(this.enableTopScroll),
      useColumnGroups: formBuilder.nonNullable.control(this.useColumnGroups),
      showSelect: formBuilder.nonNullable.control(this.showSelect),
      domLayout: formBuilder.nonNullable.control(this.domLayout),
      compact: formBuilder.nonNullable.control(this.compact),
      wrapText: formBuilder.nonNullable.control(this.wrapText),
      autoHeightColumns: formBuilder.nonNullable.control(
        this.autoHeightColumns,
      ),
    });
  }

  public ngOnInit(): void {
    this.gridSettings.setValue({
      enableTopScroll: this.enableTopScroll,
      domLayout: this.domLayout,
      autoHeightColumns: this.autoHeightColumns,
      wrapText: this.wrapText,
      compact: this.compact,
      showSelect: this.showSelect,
      useColumnGroups: this.useColumnGroups,
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
          alwaysDisplayed:
            this.showSelect && ['select'].includes(col.field ?? ''),
        };
      }),
    });

    this.gridSettings.valueChanges.subscribe((value) => {
      this.isActive$.next(false);
      this.enableTopScroll = !!value.enableTopScroll;
      this.showSelect = !!value.showSelect;
      this.useColumnGroups = !!value.useColumnGroups;
      this.domLayout = value.domLayout ?? 'autoHeight';
      this.compact = !!value.compact;
      this.wrapText = !!value.wrapText;
      this.autoHeightColumns = !!value.autoHeightColumns;
      this.#applyGridOptions();
      setTimeout(() => this.isActive$.next(true));
    });
  }

  #applyGridOptions(): void {
    this.gridOptions = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs: [
          ...(this.showSelect
            ? [
                {
                  field: 'select',
                  headerName: '',
                  type: SkyCellType.RowSelector,
                },
              ]
            : []),
          ...(this.useColumnGroups
            ? columnDefinitionsGrouped
            : columnDefinitions),
        ],
        columnTypes: {
          custom_link: {
            cellRenderer: CustomLinkComponent,
          },
        },
        context: {
          enableTopScroll: this.enableTopScroll,
        },
        domLayout: this.domLayout,
        defaultColDef: {
          wrapText: this.wrapText,
          autoHeight: this.autoHeightColumns,
        },
      },
    });
  }
}
