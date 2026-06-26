import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
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
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
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
  GridOptions,
  ModuleRegistry,
  RowSelectionOptions,
} from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

ModuleRegistry.registerModules([AllCommunityModule]);

interface DemoRow {
  id: string;
  name: string;
  age: number;
  department: string;
}

const DEMO_DATA: DemoRow[] = [
  { id: '1', name: 'Billy Bob', age: 55, department: 'Customer Support' },
  { id: '2', name: 'Jane Deere', age: 33, department: 'Engineering' },
  { id: '3', name: 'John Doe', age: 38, department: 'Sales' },
  { id: '4', name: 'Sarah Smith', age: 28, department: 'Marketing' },
  { id: '5', name: 'Tom Jones', age: 45, department: 'Engineering' },
];

const COLUMN_DEFS: ColDef[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age', maxWidth: 80 },
  { field: 'department', headerName: 'Department' },
];

const ROW_SELECTION: RowSelectionOptions = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  selectAll: 'filtered',
};

@Component({
  imports: [
    AgGridAngular,
    AsyncPipe,
    NgTemplateOutlet,
    SkyAgGridModule,
    SkyThemeModule,
  ],
  selector: 'app-ag-grid-multiselect',
  templateUrl: './ag-grid-native-multiselect.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AgGridMultiselectComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @Input() public compact = false;

  public readonly dataSets = [
    {
      id: 'unchecked',
      label: 'Unchecked',
      initialState: undefined,
    },
    {
      id: 'indeterminate',
      label: 'Indeterminate',
      initialState: { rowSelection: ['1', '2'] },
    },
    {
      id: 'checked',
      label: 'All checked',
      initialState: { rowSelection: ['1', '2', '3', '4', '5'] },
    },
  ];

  public gridOptions: Record<string, GridOptions> = {};
  public readonly isActive$ = new BehaviorSubject(true);
  public readonly ready = new BehaviorSubject(false);
  public skyTheme: SkyThemeSettings | undefined;

  readonly #agGridService = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #gridsReady = new Map<string, Observable<boolean>>();
  readonly #ngUnsubscribe = new Subscription();
  readonly #themeSvc = inject(SkyThemeService);

  public ngOnInit(): void {
    this.dataSets.forEach((dataSet) =>
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
    this.dataSets.forEach((dataSet) => {
      this.gridOptions[dataSet.id] = this.#agGridService.getGridOptions({
        gridOptions: {
          columnDefs: COLUMN_DEFS,
          domLayout: 'autoHeight',
          getRowId: (params) => params.data.id,
          initialState: dataSet.initialState,
          rowData: DEMO_DATA,
          rowSelection: ROW_SELECTION,
          suppressColumnVirtualisation: true,
          suppressHorizontalScroll: true,
          onFirstDataRendered: () => {
            (this.#gridsReady.get(dataSet.id) as BehaviorSubject<boolean>).next(
              true,
            );
          },
        },
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
}
