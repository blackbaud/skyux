import { CommonModule } from '@angular/common';
import {
  Component,
  Signal,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';

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
  domLayoutNormal: FormControl<boolean>;
  compact: FormControl<boolean>;
  wrapText: FormControl<boolean>;
  autoHeightColumns: FormControl<boolean>;
  showSelect: FormControl<boolean>;
  showDelete: FormControl<boolean>;
}

interface GridSettingsValueType {
  enableTopScroll: boolean;
  useColumnGroups: boolean;
  domLayoutNormal: boolean;
  compact: boolean;
  wrapText: boolean;
  autoHeightColumns: boolean;
  showSelect: boolean;
  showDelete: boolean;
}

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-data-manager-large',
  templateUrl: './data-manager-large.component.html',
  styleUrls: ['./data-manager-large.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    AgGridModule,
    CommonModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyAgGridModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyRadioModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
  ],
  providers: [
    SkyDataManagerService,
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService,
    },
  ],
  host: {
    '[class.use-normal-dom-layout]': 'useNormalDomLayout()',
    '[class.use-auto-height-dom-layout]': 'useAutoHeightDomLayout()',
  },
})
export class DataManagerLargeComponent {
  public readonly autoHeightColumns = input(false);
  public readonly compact = input(false);
  public readonly domLayout = input<'normal' | 'autoHeight' | 'print'>(
    'autoHeight',
  );
  public readonly enableTopScroll = input(true);
  public readonly showDelete = input(false);
  public readonly showSelect = input(false);
  public readonly useColumnGroups = input(false);
  public readonly wrapText = input(false);

  public useNormalDomLayout = computed(
    () => this.gridOptions().domLayout === 'normal',
  );
  public useAutoHeightDomLayout = computed(
    () => this.gridOptions().domLayout === 'autoHeight',
  );

  public dataManagerConfig: SkyDataManagerConfig = {};

  public readonly viewId = 'gridView';

  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {},
    },
    views: [
      {
        viewId: this.viewId,
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

  public dataState: SkyDataManagerState | undefined;
  public items = data.map((item) => ({
    id: item.object_id,
    ...item,
  }));
  public readonly settingsKey = 'large-test';
  public gridOptions: Signal<GridOptions>;
  public readonly isActive = signal(true);
  public readonly gridSettings: FormGroup<GridSettingsType>;

  protected readonly rowDeleteIds = model<string[]>([]);
  protected readonly gridSettingsValue: Signal<Partial<GridSettingsValueType>>;

  readonly #agGridService = inject(SkyAgGridService);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #gridApi = signal<GridApi | undefined>(undefined);

  constructor() {
    const formBuilder = inject(FormBuilder);
    this.gridSettings = formBuilder.group<GridSettingsType>({
      autoHeightColumns: formBuilder.nonNullable.control(false),
      compact: formBuilder.nonNullable.control(false),
      domLayoutNormal: formBuilder.nonNullable.control(false),
      enableTopScroll: formBuilder.nonNullable.control(false),
      showDelete: formBuilder.nonNullable.control(false),
      showSelect: formBuilder.nonNullable.control(false),
      useColumnGroups: formBuilder.nonNullable.control(false),
      wrapText: formBuilder.nonNullable.control(false),
    });
    effect(() => {
      this.gridSettings.patchValue({
        autoHeightColumns: this.autoHeightColumns(),
        compact: this.compact(),
        domLayoutNormal: this.domLayout() === 'normal',
        enableTopScroll: this.enableTopScroll(),
        showDelete: this.showDelete(),
        showSelect: this.showSelect(),
        useColumnGroups: this.useColumnGroups(),
        wrapText: this.wrapText(),
      });
    });
    this.gridSettingsValue = toSignal(this.gridSettings.valueChanges, {
      initialValue: this.gridSettings.getRawValue(),
    });
    this.gridOptions = computed(() => {
      const settings = this.gridSettingsValue();
      return this.#agGridService.getGridOptions({
        gridOptions: {
          columnDefs: [
            ...(settings.showSelect
              ? [
                  {
                    field: 'select',
                    headerName: 'Select',
                    type: SkyCellType.RowSelector,
                    lockVisible: true,
                  } as ColDef,
                ]
              : []),
            ...(settings.showDelete
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
            ...(settings.useColumnGroups
              ? columnDefinitionsGrouped
              : columnDefinitions.map((col) =>
                  col.field === 'object_name'
                    ? { ...col, rowDrag: settings.domLayoutNormal }
                    : col,
                )),
          ],
          columnTypes: {
            custom_link: {
              cellRenderer: CustomLinkComponent,
            },
          },
          context: {
            enableTopScroll: settings.enableTopScroll,
          },
          domLayout: settings.domLayoutNormal ? 'normal' : 'autoHeight',
          defaultColDef: {
            wrapText: settings.wrapText,
            autoHeight: settings.autoHeightColumns,
          },
          onGridReady: (ready) => {
            this.#gridApi.set(ready.api);
          },
          onGridPreDestroyed: () => {
            this.#gridApi.set(undefined);
          },
          rowDragManaged: !settings.useColumnGroups && settings.domLayoutNormal,
        },
      });
    });
    effect(() => {
      const api = untracked(() => this.#gridApi());
      this.gridOptions();
      if (api) {
        this.#pauseAndShowGrid();
      }
    });

    this.#dataManagerService.initDataManager({
      activeViewId: this.viewId,
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
  }

  public markForDelete(rowId: string): void {
    this.rowDeleteIds.update((rowIds) => {
      return [...new Set([...rowIds, rowId])];
    });
  }

  protected deleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.items = this.items.filter((item) => item.id !== $event.id);
    this.#gridApi()?.setGridOption('rowData', this.items);
  }

  #pauseAndShowGrid(): void {
    this.isActive.set(false);
    setTimeout(() => this.isActive.set(true));
  }
}
