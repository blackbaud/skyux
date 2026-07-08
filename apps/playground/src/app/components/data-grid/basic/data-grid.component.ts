import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
  model,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

interface RowModel {
  id: string;
  column1: string;
  column2: string;
  column3: string;
  myId?: string;
}

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  imports: [
    SkyDataGrid,
    SkyDataGridColumn,
    SkyPopoverModule,
    SkyDropdownModule,
    JsonPipe,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DataGridComponent {
  public asyncPopover: any;

  public dataForSimpleGrid: RowModel[] = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg' },
  ];

  public dataForSimpleGridWithMultiselect: RowModel[] = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa', myId: '101' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb', myId: '102' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc', myId: '103' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd', myId: '104' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee', myId: '105' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff', myId: '106' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg', myId: '107' },
  ];

  public selectedRowIds: string[] = [];

  protected readonly hideCol3 = model<boolean>(false);
  protected toggleCol3(): void {
    this.hideCol3.update((show) => !show);
  }

  @ViewChild('asyncPopoverRef')
  private popoverTemplate: any;

  readonly #cdr = inject(ChangeDetectorRef);

  constructor() {
    setTimeout(() => {
      this.asyncPopover = this.popoverTemplate;
      this.#cdr.markForCheck();
    }, 1000);
  }

  public selectAll(): void {
    this.selectedRowIds = this.dataForSimpleGridWithMultiselect.map(
      (item) => item.myId,
    );
    this.#cdr.markForCheck();
  }

  public clearAll(): void {
    this.selectedRowIds = [];
    this.#cdr.markForCheck();
  }

  public selectRow(): void {
    this.selectedRowIds = ['1', '3', '5'];
    this.#cdr.markForCheck();
  }
}
