import {
  Component,
  Signal,
  ViewEncapsulation,
  computed,
  effect,
  inject,
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
import { SkyAgGridModule, SkyAgGridRowDeleteConfirmArgs } from '@skyux/ag-grid';
import { SkyLogService, SkyUIConfigService } from '@skyux/core';
import { SkyDataGridModule } from '@skyux/data-grid';
import {
  SkyDataManagerConfig,
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import {
  SkyFilterBarFilterItem,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

import { BehaviorSubject, map, of } from 'rxjs';

import { CustomLinkComponent } from './custom-link/custom-link.component';
import { data } from './data-set-large';
import { LocalStorageConfigService } from './local-storage-config.service';

interface GridSettingsType {
  enableTopScroll: FormControl<boolean>;
  domLayout: FormControl<'normal' | 'autoHeight' | 'print'>;
  compact: FormControl<boolean>;
  showSelect: FormControl<boolean>;
  showDelete: FormControl<boolean>;
}

@Component({
  selector: 'app-data-manager-large',
  templateUrl: './data-manager-large.component.html',
  styleUrls: ['./data-manager-large.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SkyAgGridModule,
    SkyDataGridModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyRadioModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
    CustomLinkComponent,
    SkyFilterBarModule,
  ],
  providers: [
    SkyDataManagerService,
    {
      provide: SkyUIConfigService,
      useClass: LocalStorageConfigService,
    },
  ],
})
export class DataManagerLargeComponent {
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
          'object_date',
          'title',
          'object_wikidata_url',
          'artist_wikidata_url',
        ],
      },
    ],
  });

  public readonly viewId = 'gridView';

  public dataState: SkyDataManagerState | undefined;
  public readonly items = signal(
    data.map((item) => ({
      id: item.object_id,
      ...item,
    })),
  );
  public readonly settingsKey = 'data-grid-large-test';
  public readonly isActive$ = new BehaviorSubject(true);
  public readonly gridSettings: FormGroup<GridSettingsType>;
  public readonly gridSettingsChanges: Signal<typeof this.gridSettings.value>;
  public readonly enableTopScroll: Signal<boolean>;

  protected readonly appliedFilters = model<SkyFilterBarFilterItem[]>();
  protected readonly height = computed(() =>
    this.gridSettingsChanges()?.domLayout === 'normal' ? 500 : undefined,
  );
  protected readonly ready = signal(true);
  protected readonly rowDeleteIds = model<string[]>([]);
  protected readonly selectedColumnIds: Signal<string[]>;

  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #logger = inject(SkyLogService);

  constructor() {
    const formBuilder = inject(FormBuilder);
    this.gridSettings = formBuilder.group<GridSettingsType>({
      enableTopScroll: formBuilder.nonNullable.control(true),
      showSelect: formBuilder.nonNullable.control(true),
      showDelete: formBuilder.nonNullable.control(true),
      domLayout: formBuilder.nonNullable.control('autoHeight'),
      compact: formBuilder.nonNullable.control(false),
    });
    this.gridSettingsChanges = toSignal(this.gridSettings.valueChanges, {
      initialValue: this.gridSettings.value,
    });
    this.enableTopScroll = computed(
      () => this.gridSettingsChanges().enableTopScroll,
    );
    effect(() => {
      this.enableTopScroll();
      untracked(() => {
        this.ready.set(false);
        setTimeout(() => this.ready.set(true), 10);
      });
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
      columnPickerEnabled: true,
    });

    this.selectedColumnIds = toSignal(
      this.#dataManagerService
        .getDataStateUpdates(this.viewId)
        .pipe(
          map(
            (state) =>
              state.views.find((view) => view.viewId === this.viewId)
                .displayedColumnIds,
          ),
        ),
    );
  }

  public markForDelete(rowId: string): void {
    this.rowDeleteIds.update((rowIds) => {
      return [...new Set([...rowIds, rowId])];
    });
  }

  protected deleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.items.update((items) => items.filter((item) => item.id !== $event.id));
  }

  protected searchCulture(search: SkyFilterItemLookupSearchAsyncArgs): void {
    const options = [...new Set(this.items().map((item) => item.culture))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    search.result = of({
      items: options.map((culture) => Object.assign(`${culture}`, { culture })),
      totalCount: options.length,
    });
  }

  protected selectionChange($event: string[]): void {
    this.#logger.info(`selectionChange:`, [$event]);
  }
}
export default DataManagerLargeComponent;
