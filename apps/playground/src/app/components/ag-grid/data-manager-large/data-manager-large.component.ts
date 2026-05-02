import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  Signal,
  ViewEncapsulation,
  computed,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
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
  domLayout: FormControl<'normal' | 'autoHeight' | 'print'>;
  compact: FormControl<boolean>;
  wrapText: FormControl<boolean>;
  autoHeightColumns: FormControl<boolean>;
  showSelect: FormControl<boolean>;
  showDelete: FormControl<boolean>;
}

interface GridSettingsValueType {
  enableTopScroll: boolean;
  useColumnGroups: boolean;
  domLayout: 'normal' | 'autoHeight' | 'print';
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
export class DataManagerLargeComponent implements OnInit {
  public useNormalDomLayout = computed(
    () => this.gridOptions().domLayout === 'normal',
  );
  public useAutoHeightDomLayout = computed(
    () => this.gridOptions().domLayout === 'autoHeight',
  );

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
  public showDelete = false;

  @Input()
  public wrapText = false;

  @Input()
  public autoHeightColumns = false;

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

  protected readonly agGrid = viewChild(AgGridAngular);
  protected readonly rowDeleteIds = model<string[]>([]);
  protected readonly gridSettingsValue: Signal<Partial<GridSettingsValueType>>;

  readonly #agGridService = inject(SkyAgGridService);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #destroyRef = inject(DestroyRef);

  constructor() {
    const formBuilder = inject(FormBuilder);
    this.gridSettings = formBuilder.group<GridSettingsType>({
      enableTopScroll: formBuilder.nonNullable.control(this.enableTopScroll),
      useColumnGroups: formBuilder.nonNullable.control(this.useColumnGroups),
      showSelect: formBuilder.nonNullable.control(this.showSelect),
      showDelete: formBuilder.nonNullable.control(this.showDelete),
      domLayout: formBuilder.nonNullable.control(this.domLayout),
      compact: formBuilder.nonNullable.control(this.compact),
      wrapText: formBuilder.nonNullable.control(this.wrapText),
      autoHeightColumns: formBuilder.nonNullable.control(
        this.autoHeightColumns,
      ),
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
                    headerComponentParams: {
                      headerHidden: true,
                    },
                    type: SkyCellType.RowSelector,
                  },
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
                    ? { ...col, rowDrag: settings.domLayout === 'normal' }
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
          domLayout: settings.domLayout,
          defaultColDef: {
            wrapText: settings.wrapText,
            autoHeight: settings.autoHeightColumns,
          },
          rowDragManaged:
            !settings.useColumnGroups && settings.domLayout === 'normal',
        },
      });
    });
  }

  public ngOnInit(): void {
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

    this.gridSettings.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#pauseAndShowGrid());
    this.#pauseAndShowGrid();
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

  #pauseAndShowGrid(): void {
    this.isActive.set(false);
    setTimeout(() => this.isActive.set(true));
  }
}
