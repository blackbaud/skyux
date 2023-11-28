import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyDataManagerService } from '@skyux/data-manager';

import { AgGridModule } from 'ag-grid-angular';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { AG_GRID_DEMO_DATA } from './data';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [AgGridModule, SkyAgGridModule, NgIf, AsyncPipe],
})
export class DemoComponent implements AfterViewInit {
  @ViewChild('boldColumn', { static: true })
  protected boldColumn: TemplateRef<unknown> | undefined;

  @ViewChild('emphasizedColumn', { static: true })
  protected emphasizedColumn: TemplateRef<unknown> | undefined;

  protected gridData = AG_GRID_DEMO_DATA;
  protected gridOptions: GridOptions | undefined;
  protected ready = new BehaviorSubject(false);

  #gridApi: GridApi | undefined;

  readonly #agGridSvc = inject(SkyAgGridService);

  public ngAfterViewInit(): void {
    const gridOptions: GridOptions = {
      columnDefs: [
        {
          field: 'name',
          headerName: 'Name',
        },
        {
          field: 'age',
          headerName: 'Age',
          type: SkyCellType.Number,
          maxWidth: 60,
        },
        {
          field: 'department',
          headerName: 'Department',
          type: SkyCellType.Template,
          cellRendererParams: {
            template: this.boldColumn,
          },
        },
        {
          field: 'jobTitle',
          headerName: 'Title',
          type: SkyCellType.Template,
          cellRendererParams: {
            template: this.emphasizedColumn,
          },
        },
      ],
      onGridReady: (gridReadyEvent): void => this.onGridReady(gridReadyEvent),
    };

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions,
    });

    this.ready.next(true);
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#gridApi.sizeColumnsToFit();
  }
}
