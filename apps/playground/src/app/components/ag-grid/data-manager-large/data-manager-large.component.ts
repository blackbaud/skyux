import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  SkyAgGridModule,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerConfig,
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { CustomLinkComponent } from './custom-link/custom-link.component';
import {
  columnDefinitions,
  columnDefinitionsGrouped,
  data,
} from './data-set-large';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { LocalStorageConfigService } from './local-storage-config.service';

interface GridSettingsType {
  enableTopScroll: FormControl<boolean>;
  useColumnGroups: FormControl<boolean>;
  domLayout: FormControl<'normal' | 'autoHeight' | 'print'>;
  compact: FormControl<boolean>;
  wrapText: FormControl<boolean>;
  autoHeightColumns: FormControl<boolean>;
  showSelect: FormControl<boolean>;
  showDelete: FormControl<boolean>;
}

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-data-manager-large',
  templateUrl: './data-manager-large.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AgGridModule,
    CommonModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyAgGridModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyPageModule,
    SkyRadioModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
  ],
  host: {
    '[class.use-normal-dom-layout]': 'domLayout() === "normal"',
    '[class.use-auto-height-dom-layout]': 'domLayout() === "autoHeight"',
  },
  providers: [
    SkyDataManagerService,
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService,
    },
  ],
})
export class DataManagerLargeComponent implements OnInit {
  public readonly compact = model(false);

  public readonly dock = input<'none' | 'fill'>('none');
  public readonly domLayout = model<'normal' | 'autoHeight' | 'print'>(
    'autoHeight',
  );
  protected readonly dockComputed = computed(() => {
    const dock = this.dock();
    const domLayout = this.domLayout();
    if (dock === 'none' && domLayout === 'normal') {
      return 'fill';
    }
    return dock;
  });

  public readonly enableTopScroll = model(true);

  public readonly useColumnGroups = model(false);

  public readonly showSelect = model(true);

  public readonly showDelete = model(false);

  public readonly wrapText = model(false);

  public readonly autoHeightColumns = model(false);

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
  public items = data.map((item) => ({
    id: item.object_id,
    ...item,
  }));
  public readonly settingsKey = 'large-test';
  public gridOptions: GridOptions = {};
  public readonly isActive$ = new BehaviorSubject(true);
  public readonly gridSettings: FormGroup<GridSettingsType>;

  protected readonly agGrid = viewChild(AgGridAngular);
  protected readonly rowDeleteIds = model<string[]>([]);
  protected readonly isActiveRoute =
    inject(ActivatedRoute).component === DataManagerLargeComponent;

  readonly #agGridService = inject(SkyAgGridService);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.gridSettings = this.#formBuilder.group<GridSettingsType>({
      enableTopScroll: this.#formBuilder.nonNullable.control(
        this.enableTopScroll(),
      ),
      useColumnGroups: this.#formBuilder.nonNullable.control(
        this.useColumnGroups(),
      ),
      showSelect: this.#formBuilder.nonNullable.control(this.showSelect()),
      showDelete: this.#formBuilder.nonNullable.control(this.showDelete()),
      domLayout: this.#formBuilder.nonNullable.control(this.domLayout()),
      compact: this.#formBuilder.nonNullable.control(this.compact()),
      wrapText: this.#formBuilder.nonNullable.control(this.wrapText()),
      autoHeightColumns: this.#formBuilder.nonNullable.control(
        this.autoHeightColumns(),
      ),
    });
  }

  public ngOnInit(): void {
    this.gridSettings.setValue({
      enableTopScroll: this.enableTopScroll(),
      domLayout: this.domLayout(),
      autoHeightColumns: this.autoHeightColumns(),
      wrapText: this.wrapText(),
      compact: this.compact(),
      showSelect: this.showSelect(),
      showDelete: this.showDelete(),
      useColumnGroups: this.useColumnGroups(),
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
      iconName: 'table',
      searchEnabled: false,
      sortEnabled: true,
      multiselectToolbarEnabled: false,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: true,
      columnOptions: columnDefinitions.map((col) => {
        return {
          id: col.field ?? '',
          label: col.headerName ?? '',
          alwaysDisplayed:
            this.showSelect() && ['select'].includes(col.field ?? ''),
        };
      }),
    });

    this.gridSettings.valueChanges.subscribe((value) => {
      this.isActive$.next(false);
      this.enableTopScroll.set(!!value.enableTopScroll);
      this.showSelect.set(!!value.showSelect);
      this.showDelete.set(!!value.showDelete);
      this.useColumnGroups.set(!!value.useColumnGroups);
      this.domLayout.set(value.domLayout ?? 'autoHeight');
      this.compact.set(!!value.compact);
      this.wrapText.set(!!value.wrapText);
      this.autoHeightColumns.set(!!value.autoHeightColumns);
      this.#applyGridOptions();
      setTimeout(() => this.isActive$.next(true));
    });
  }

  public markForDelete(rowId: string): void {
    this.rowDeleteIds.update((rowIds) => {
      return [...new Set([...rowIds, rowId])];
    });
  }

  protected deleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.items = this.items.filter((item) => item.id !== $event.id);
    this.agGrid().api.setGridOption('rowData', this.items);
  }

  #applyGridOptions(): void {
    this.gridOptions = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs: [
          ...(this.showSelect()
            ? [
                {
                  field: 'select',
                  headerName: 'Select',
                  headerComponentParams: {
                    headerHidden: true,
                  },
                  type: SkyCellType.RowSelector,
                },
              ]
            : []),
          ...(this.showDelete()
            ? [
                {
                  field: 'delete',
                  headerName: 'Delete',
                  headerComponentParams: {
                    headerHidden: true,
                  },
                  cellRenderer: DeleteButtonComponent,
                },
              ]
            : []),
          ...(this.useColumnGroups()
            ? columnDefinitionsGrouped
            : columnDefinitions.map((col) => {
                if (col.field === 'object_name') {
                  return { ...col, rowDrag: this.domLayout() === 'normal' };
                }
                return col;
              })),
        ],
        columnTypes: {
          custom_link: {
            cellRenderer: CustomLinkComponent,
          },
        },
        context: {
          enableTopScroll: this.enableTopScroll(),
        },
        domLayout: this.domLayout(),
        defaultColDef: {
          wrapText: this.wrapText(),
          autoHeight: this.autoHeightColumns(),
        },
        rowDragManaged:
          !this.useColumnGroups() && this.domLayout() === 'normal',
      },
    });
  }
}
