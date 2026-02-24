import {
  Component,
  booleanAttribute,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyDataManagerModule } from '@skyux/data-manager';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  ModuleRegistry,
} from 'ag-grid-community';
import { map } from 'rxjs/operators';

import { CourseCatalogRow, data } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

const VIEW_ID = 'grid';

@Component({
  selector: 'app-course-catalog',
  template: `
    @if (dataManager()) {
      <sky-data-manager dock="fill">
        <sky-data-manager-toolbar />
        <sky-data-view skyAgGridDataManagerAdapter viewId="grid">
          <sky-ag-grid-wrapper>
            <ag-grid-angular [gridOptions]="gridOptions" />
          </sky-ag-grid-wrapper>
        </sky-data-view>
      </sky-data-manager>
    } @else {
      <sky-ag-grid-wrapper>
        <ag-grid-angular [gridOptions]="gridOptions" />
      </sky-ag-grid-wrapper>
    }
  `,
  imports: [AgGridAngular, SkyAgGridModule, SkyDataManagerModule],
  providers: [SkyDataManagerService],
})
export class CourseCatalogComponent {
  public readonly dataManager = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  readonly #gridApi = signal<GridApi | undefined>(undefined);

  protected readonly gridOptions = inject(
    SkyAgGridService,
  ).getGridOptions<CourseCatalogRow>({
    gridOptions: {
      columnDefs: [
        { colId: 'select', type: SkyCellType.RowSelector, lockVisible: true },
        {
          field: 'courseId',
          headerName: 'Course ID',
        },
        { field: 'year', headerName: 'Year' },
        { field: 'term', headerName: 'Term' },
        { field: 'yearTerm', headerName: 'Year term' },
        { field: 'subject', headerName: 'Subject' },
        { field: 'courseNumber', headerName: 'Course number' },
        { field: 'section', headerName: 'Section' },
        { field: 'title', headerName: 'Title' },
        { field: 'description', headerName: 'Description' },
        { field: 'creditHours', headerName: 'Credit hours' },
        { field: 'format', headerName: 'Format' },
        { field: 'meetingDays', headerName: 'Meeting days' },
        { field: 'startTime', headerName: 'Start time' },
        { field: 'endTime', headerName: 'End time' },
        { field: 'location', headerName: 'Location' },
        { field: 'instructor', headerName: 'Instructor' },
        { field: 'capacity', headerName: 'Capacity' },
        { field: 'enrolled', headerName: 'Enrolled' },
        { field: 'status', headerName: 'Status' },
        { field: 'degreeAttributes', headerName: 'Degree attributes' },
      ],
      domLayout: 'normal',
      autoSizeStrategy: { type: 'fitCellContents' },
      rowSelection: { mode: 'multiRow', checkboxes: false },
      rowData: data.map((row) => ({
        id: `${row.courseId}-${row.section}-${row.yearTerm}`,
        ...row,
      })),
      onGridReady: (ready) => {
        this.#gridApi.set(ready.api);
      },
      onGridPreDestroyed: () => {
        this.#gridApi.set(undefined);
      },
    },
  });

  constructor() {
    const dm = inject(SkyDataManagerService);
    dm.initDataManager({
      activeViewId: VIEW_ID,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: VIEW_ID,
            columnIds: this.gridOptions.columnDefs.map(
              (col: ColDef<CourseCatalogRow>) => String(col.field ?? col.colId),
            ),
            displayedColumnIds: [
              'select',
              'subject',
              'courseNumber',
              'section',
              'title',
              'description',
              'creditHours',
            ],
          },
        ],
      }),
    });
    dm.initDataView({
      id: VIEW_ID,
      name: 'Course catalog',
      columnPickerEnabled: true,
      searchEnabled: true,
    });

    const searchTextSignal = toSignal(
      dm
        .getDataStateUpdates(VIEW_ID)
        .pipe(map((state) => state.searchText ?? '')),
      { initialValue: '' },
    );
    effect(() => {
      const searchText = searchTextSignal();
      const gridApi = untracked(this.#gridApi);
      gridApi?.setGridOption('quickFilterText', searchText);
    });
  }
}
