import {
  Component,
  OnInit
} from '@angular/core';

import {
  GridReadyEvent,
  GridOptions,
  ICellRendererParams
} from 'ag-grid-community';

import {
  READONLY_GRID_DATA,
  RowStatusNames
} from './readonly-grid-data';

import {
  SkyAgGridService,
  SkyCellType
} from '../../public';

import {
  Observable,
  Subject
} from 'rxjs';

let nextId = 0;

@Component({
  selector: 'readonly-grid-visual',
  templateUrl: './readonly-grid.component.html',
  styleUrls: ['./readonly-grid.component.scss']
})
export class ReadonlyGridComponent implements OnInit {
  public gridData = READONLY_GRID_DATA;
  public hasMore = true;
  public gridOptions: GridOptions;
  public columnDefs = [
    {
      field: 'selected',
      headerName: '',
      sortable: false,
      type: SkyCellType.RowSelector
    },
    {
      field: 'name',
      headerName: 'Goal Name',
      autoHeight: true,
      headerClass: 'sticky'
    },
    {
      field: 'value',
      headerName: 'Current Value',
      type: SkyCellType.Number,
      maxWidth: 200
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      type: SkyCellType.Date
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      type: SkyCellType.Date
    },
    {
      field: 'comment',
      headerName: 'Comment',
      maxWidth: 500,
      autoHeight: true,
      cellRenderer: (params: ICellRendererParams) => {
        return `<div style="white-space: normal">${params.value || ''}</div>`;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      cellRenderer: this.statusRenderer,
      minWidth: 300
    }];

  constructor(private agGridService: SkyAgGridService) { }

  public ngOnInit(): void {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: gridReadyEvent => this.onGridReady(gridReadyEvent),
      domLayout: 'autoHeight',
      alignedGrids: []
    };
    this.gridOptions = this.agGridService.getGridOptions({ gridOptions: this.gridOptions });
  }

  public onScrollEnd(): void {
    if (this.hasMore) {
      // MAKE API REQUEST HERE
      // I am faking an API request because I don't have one to work with
      this.mockRemote().subscribe((result: any) => {
        this.gridData = this.gridData.concat(result.data);
        this.hasMore = result.hasMore;
      });
    }
  }

  public mockRemote(): Observable<any> {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam. Tempor orci eu lobortis elementum nibh tellus molestie. Tempus imperdiet nulla malesuada pellentesque elit.';
    const data: any[] = [];

    for (let i = 0; i < 8; i++) {
      data.push({
        name: `Item #${++nextId}`,
        comment: i % 3 === 0 ? lorem : ''
      });
    }

    let results = new Subject<any>();

    setTimeout(() => {
      results.next({
        data,
        hasMore: (nextId < 50)
      });
    }, 1000);

    return results;
  }

  public statusRenderer(cellRendererParams: ICellRendererParams): string {
    const iconClassMap = {
      [RowStatusNames.BEHIND]: 'fa-warning',
      [RowStatusNames.CURRENT]: 'fa-clock-o',
      [RowStatusNames.COMPLETE]: 'fa-check'
    };
    if (cellRendererParams.value) {
    return `<div class="status ${cellRendererParams.value.toLowerCase()}">
              <i class="fa ${iconClassMap[cellRendererParams.value]}"></i> ${cellRendererParams.value}
            </div>`;
    } else {
      return '';
    }
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    gridReadyEvent.api.sizeColumnsToFit();
    gridReadyEvent.api.resetRowHeights();
  }
}
