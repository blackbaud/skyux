import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';
import {
  SkyListViewGridMessage,
  SkyListViewGridMessageType,
  SkyListViewGridModule,
  SkyListViewGridRowDeleteCancelArgs,
  SkyListViewGridRowDeleteConfirmArgs,
} from '@skyux/list-builder-view-grids';
import { SkyDropdownModule } from '@skyux/popovers';

import { Subject } from 'rxjs';

interface GridItem {
  id: string;
  column1: number;
  column2: string;
  column3: string;
}

@Component({
  selector: 'app-list-view-grid',
  templateUrl: './list-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyAlertModule,
    SkyDropdownModule,
    SkyListModule,
    SkyListViewGridModule,
    SkyListToolbarModule,
  ],
})
export default class ListViewGridTestComponent {
  public gridController = new Subject<SkyListViewGridMessage>();

  public rowHighlightedId = signal<string | undefined>(undefined);

  public selectedIds = signal<string[] | undefined>(undefined);

  private itemsSignal = signal<GridItem[]>([
    { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples' },
    { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
    { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
    { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
    { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
    { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
    {
      id: '7',
      column1: 707,
      column2: 'Strawberry',
      column3: 'Sally eats strawberries',
    },
  ]);

  public items = this.itemsSignal.asReadonly();

  public onToggleRowHighlightClick(): void {
    this.rowHighlightedId.update((id) => (id ? undefined : '2'));
  }

  public onSelectedIdsChange(event: string[]): void {
    console.log(event);
  }

  public onRowDeleteCancel(
    cancelArgs: SkyListViewGridRowDeleteCancelArgs,
  ): void {
    this.gridController.next({
      type: SkyListViewGridMessageType.AbortDeleteRow,
      data: {
        abortDeleteRow: {
          id: cancelArgs.id,
        },
      },
    });
  }

  public onRowDeleteConfirm(
    confirmArgs: SkyListViewGridRowDeleteConfirmArgs,
  ): void {
    const exists = this.itemsSignal().some(
      (item) => item.id === confirmArgs.id,
    );
    if (exists) {
      setTimeout(() => {
        this.itemsSignal.update((items) =>
          items.filter((item) => item.id !== confirmArgs.id),
        );
        console.log('Item with id ' + confirmArgs.id + ' has been deleted.');
      }, 1000);
    }
  }

  public onDeleteItemClick(id: string): void {
    this.gridController.next({
      type: SkyListViewGridMessageType.PromptDeleteRow,
      data: {
        promptDeleteRow: {
          id: id,
        },
      },
    });
  }
}
