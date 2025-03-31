import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { PreviewWrapperModule } from '@skyux/storybook/components';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeModule,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridOptions,
  GridState,
  ModuleRegistry,
} from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import {
  DataType,
  columnDefinitions,
  data,
} from '../shared/baseball-players-data';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  imports: [
    AgGridAngular,
    CommonModule,
    PreviewWrapperModule,
    SkyAgGridModule,
    SkyThemeModule,
  ],
  selector: 'app-ag-grid-widgets',
  templateUrl: './ag-grid-widgets.component.html',
  styleUrl: './ag-grid-widgets.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sky-padding-even-md',
  },
})
export class AgGridWidgetsComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @Input()
  public compact = false;

  @Input()
  public domLayout: 'normal' | 'autoHeight' = 'normal';

  public readonly dataSets = [
    { id: 'columnGroups', data: data.slice(12, 20) },
    { id: 'overlay', data: data.slice(21, 28) },
    { id: 'noData', data: [] },
    { id: 'loading', data: [] },
    { id: 'rowPinning', data: data.slice(43, 52) },
  ];
  public gridOptions: Record<string, GridOptions> = {};
  public readonly isActive$ = new BehaviorSubject(true);
  public readonly addPreviewWrapper$ = new BehaviorSubject(false);
  public readonly ready = new BehaviorSubject(false);
  public skyTheme: SkyThemeSettings | undefined;

  readonly #agGridService = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #gridsReady = new Map<string, Observable<boolean>>();
  readonly #initialStates: Record<string, GridState> = {
    columnGroups: {
      filter: {
        filterModel: {
          seasons_played: {
            filterType: 'number',
            type: 'equals',
            filter: 19,
          },
        },
      },
    },
    overlay: {
      filter: {
        filterModel: {
          name: {
            filterType: 'text',
            type: 'contains',
            filter: 'andre',
          },
          birthday: {
            filterType: 'date',
            type: 'equals',
            dateFrom: '1954-07-10 00:00:00',
          },
        },
      },
    },
    rowPinning: {
      filter: {
        filterModel: {
          name: {
            filterType: 'text',
            type: 'contains',
            filter: 'catfish',
          },
        },
      },
    },
  };
  readonly #ngUnsubscribe = new Subscription();
  readonly #themeSvc = inject(SkyThemeService);

  public ngOnInit(): void {
    this.dataSets
      ?.filter((dataSet) => dataSet.data.length > 0)
      .forEach((dataSet) =>
        this.#gridsReady.set(dataSet.id, new BehaviorSubject(false)),
      );
    this.#gridsReady.set(
      'theme',
      this.#themeSvc.settingsChange.pipe(map(() => true)),
    );
    this.#ngUnsubscribe.add(
      this.#themeSvc.settingsChange.subscribe((settings) => {
        this.skyTheme = settings.currentSettings;
        this.isActive$.next(true);
        this.#changeDetectorRef.markForCheck();
      }),
    );
    this.dataSets?.forEach((dataSet) => {
      const columnDefs: (ColDef | ColGroupDef)[] = [];
      if (dataSet.id === 'columnGroups') {
        columnDefs.push(
          ...columnDefinitions
            .slice(0, 2)
            .map((colDef) => this.#buildColDef(dataSet.id, colDef)),
          {
            headerName: 'Stats',
            children: columnDefinitions.slice(3, 8).map((colDef, idx) =>
              this.#buildColDef(dataSet.id, {
                columnGroupShow: idx < 3 ? undefined : 'open',
                ...colDef,
              }),
            ),
          },
          {
            headerName: 'Achievements',
            children: columnDefinitions.slice(8, 14).map((colDef, idx) =>
              this.#buildColDef(dataSet.id, {
                columnGroupShow: idx < 3 ? undefined : 'open',
                ...colDef,
              }),
            ),
          },
          columnDefinitions[14],
        );
      } else {
        columnDefs.push(
          ...columnDefinitions
            .slice(0, 8)
            .map((colDef) => this.#buildColDef(dataSet.id, colDef)),
        );
      }
      const gridOptions: GridOptions = {
        columnDefs,
        columnMenu: 'new',
        domLayout: this.domLayout,
        initialState: this.#initialStates[dataSet.id],
        loading: dataSet.id === 'loading',
        stopEditingWhenCellsLoseFocus: false,
        suppressColumnVirtualisation: true,
        suppressHorizontalScroll: true,
        suppressRowVirtualisation: true,
        alwaysShowHorizontalScroll: true,
        alwaysShowVerticalScroll: true,
        onFirstDataRendered: () => {
          (this.#gridsReady.get(dataSet.id) as BehaviorSubject<boolean>).next(
            true,
          );
        },
        rowData: dataSet.data,
      };
      if (dataSet.id === 'rowPinning') {
        gridOptions.pinnedBottomRowData = [
          Object.fromEntries(
            columnDefs.map((col: ColDef) => {
              const field = col.field as keyof DataType;
              if (field && col.type === SkyCellType.Number) {
                return [
                  field,
                  dataSet.data.reduce(
                    (acc, row) => acc + Number(row[field]),
                    0,
                  ),
                ];
              }
              if (field === 'name') {
                return [field, 'Total'];
              }
              return [field, ''];
            }),
          ),
        ];
      }
      this.gridOptions[dataSet.id] = this.#agGridService.getGridOptions({
        gridOptions,
      });
    });
  }

  public ngAfterViewInit(): void {
    this.#ngUnsubscribe.add(
      combineLatest(Array.from(this.#gridsReady.values()))
        .pipe(
          filter((gridsReady) => gridsReady.every((ready) => ready)),
          delay(1000),
        )
        .subscribe(() => this.ready.next(true)),
    );
    if (!this.skyTheme) {
      this.#themeSvc.setTheme(
        new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
      );
    } else {
      this.isActive$.next(true);
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.unsubscribe();
  }

  #buildColDef(dataSetId: string, colDef: ColDef): ColDef {
    return {
      ...colDef,
      editable: colDef.field !== 'cya',
      filter:
        colDef.type === SkyCellType.Text
          ? 'agTextColumnFilter'
          : colDef.type === SkyCellType.Number
            ? 'agNumberColumnFilter'
            : colDef.type === SkyCellType.Date
              ? 'agDateColumnFilter'
              : undefined,
      floatingFilter:
        !['noData', 'loading'].includes(dataSetId) &&
        [SkyCellType.Text, SkyCellType.Number, SkyCellType.Date].includes(
          colDef.type as SkyCellType,
        ),
      headerTooltip: `This is the ${colDef.headerName} column`,
    };
  }
}
