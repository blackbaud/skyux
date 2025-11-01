import { Component } from '@angular/core';
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

import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-list-view-grid',
  standalone: true,
  templateUrl: './list-view-grid.component.html',
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

  public itemSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  public items = this.itemSubject.asObservable();

  public rowHighlightedId: string;

  public selectedIds: string[];

  private defaultItems = [
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
  ];

  constructor() {
    this.itemSubject.next(this.defaultItems);
  }

  public onToggleRowHighlightClick(): void {
    this.rowHighlightedId = this.rowHighlightedId ? undefined : '2';
  }

  public onSelectedIdsChange(event: any): void {
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
    const removeIndex = this.defaultItems
      .map((item) => {
        return item.id;
      })
      .indexOf(confirmArgs.id);

    if (removeIndex) {
      setTimeout(() => {
        this.defaultItems = this.defaultItems.filter(
          (data: any) => data.id !== confirmArgs.id,
        );
        this.itemSubject.next(this.defaultItems);
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
