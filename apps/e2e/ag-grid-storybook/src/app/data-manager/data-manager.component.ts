import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  TemplateRef,
  ViewChild,
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

import { FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { BehaviorSubject, first, timer } from 'rxjs';

import { columnDefinitions, data } from '../shared/baseball-players-data';

interface GridSettingsType {
  enableTopScroll: FormControl<boolean>;
  domLayout: FormControl<'normal' | 'autoHeight' | 'print'>;
  compact: FormControl<boolean>;
  wrapText: FormControl<boolean>;
  autoHeightColumns: FormControl<boolean>;
  showSelect: FormControl<boolean>;
}

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SkyDataManagerService],
  standalone: false,
})
export class DataManagerComponent implements AfterViewInit {
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
  public showSelect = true;

  @Input()
  public wrapText = false;

  @Input()
  public autoHeightColumns = false;

  @ViewChild('link')
  public linkTemplate!: TemplateRef<unknown>;

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

  public readonly viewId = 'gridView';

  public dataState: SkyDataManagerState | undefined;
  public items = data.slice(0, 50);
  public readonly settingsKey = 'ag-grid-storybook-data-manager';
  public gridOptions: GridOptions = {};
  public readonly isActive$ = new BehaviorSubject(false);
  public readonly gridSettings: FormGroup<GridSettingsType>;
  public readonly ready = new BehaviorSubject(false);

  readonly #agGridService = inject(SkyAgGridService);
  readonly #dataManagerService = inject(SkyDataManagerService);

  constructor(formBuilder: FormBuilder) {
    this.gridSettings = formBuilder.group<GridSettingsType>({
      enableTopScroll: formBuilder.nonNullable.control(this.enableTopScroll),
      showSelect: formBuilder.nonNullable.control(this.showSelect),
      domLayout: formBuilder.nonNullable.control(this.domLayout),
      compact: formBuilder.nonNullable.control(this.compact),
      wrapText: formBuilder.nonNullable.control(this.wrapText),
      autoHeightColumns: formBuilder.nonNullable.control(
        this.autoHeightColumns,
      ),
    });
  }

  public ngAfterViewInit(): void {
    this.gridSettings.setValue({
      enableTopScroll: this.enableTopScroll,
      domLayout: this.domLayout,
      autoHeightColumns: this.autoHeightColumns,
      wrapText: this.wrapText,
      compact: this.compact,
      showSelect: this.showSelect,
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
      this.domLayout = value.domLayout ?? 'autoHeight';
      this.compact = !!value.compact;
      this.wrapText = !!value.wrapText;
      this.autoHeightColumns = !!value.autoHeightColumns;
      this.#applyGridOptions();
    });
  }

  #applyGridOptions(): void {
    if (this.gridOptions.defaultColDef?.wrapText !== this.wrapText) {
      if (this.wrapText) {
        this.items = data.slice(0, 50).map((item) => ({
          ...item,
          name: [item.name, item.name, item.name].join(' '),
        }));
      } else {
        this.items = data.slice(0, 50);
      }
    }
    const columnDefs = [
      ...(this.showSelect
        ? [
            {
              field: 'select',
              type: SkyCellType.RowSelector,
            },
          ]
        : []),
      ...columnDefinitions,
    ];
    const name = columnDefs.find((col) => col.field === 'name');
    if (name) {
      name.type = SkyCellType.Template;
      name.cellRendererParams = { template: this.linkTemplate };
      delete name.cellRenderer;
    }
    this.gridOptions = this.#agGridService.getGridOptions({
      gridOptions: {
        columnDefs,
        context: {
          enableTopScroll: this.enableTopScroll,
        },
        domLayout: this.domLayout,
        defaultColDef: {
          wrapText: this.wrapText,
          autoHeight: this.autoHeightColumns,
        },
        suppressColumnVirtualisation: true,
        suppressRowVirtualisation: true,
        alwaysShowHorizontalScroll: true,
        alwaysShowVerticalScroll: true,
        onFirstDataRendered: (event: FirstDataRenderedEvent) => {
          // Delay to allow the grid to render before capturing the screenshot.
          timer(1800)
            .pipe(first())
            .subscribe(() => {
              event.api.setFocusedCell(0, 'name');
              this.ready.next(true);
            });
        },
      },
    });
    setTimeout(() => this.isActive$.next(true));
  }

  protected readonly encodeURIComponent = encodeURIComponent;
}
