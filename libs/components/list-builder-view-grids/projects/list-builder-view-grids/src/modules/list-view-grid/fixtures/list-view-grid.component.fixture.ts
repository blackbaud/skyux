import {
  Component,
  ContentChildren,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { SkyGridSelectedRowsModelChange } from '@skyux/grids';

import { BehaviorSubject } from 'rxjs';

import { Subject } from 'rxjs';

import { SkyListViewGridMessage } from '../types/list-view-grid-message';

import { SkyListViewGridMessageType } from '../types/list-view-grid-message-type';

import { SkyListViewGridRowDeleteCancelArgs } from '../types/list-view-grid-row-delete-cancel-args';

import { SkyListViewGridRowDeleteConfirmArgs } from '../types/list-view-grid-row-delete-confirm-args';

import { SkyListViewGridComponent } from '../list-view-grid.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-grid.component.fixture.html',
})
export class ListViewGridFixtureComponent implements OnInit {
  public hiddenColumns: string[] = ['hiddenCol1', 'hiddenCol2'];
  public asyncHeading = new BehaviorSubject<string>('');
  public asyncDescription = new BehaviorSubject<string>('');
  public gridController = new Subject<SkyListViewGridMessage>();
  public settingsKey: string;

  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;

  @ContentChildren(TemplateRef)
  public templates: QueryList<TemplateRef<any>>;

  @ViewChildren(TemplateRef)
  public viewtemplates: QueryList<TemplateRef<any>>;

  public rowHighlightedId: string;

  public enableMultiselect = false;

  public searchFn: (data: any, searchText: string) => boolean;

  public showNgIfCol: boolean = false;

  public ngOnInit() {
    setTimeout(() => {
      this.asyncHeading.next('Column1');
      this.asyncDescription.next('Column1 Description');
    }, 100);
  }

  public multiselectSelectionChange(
    multiselectSelectionChange: SkyGridSelectedRowsModelChange
  ) {
    console.log(multiselectSelectionChange);
  }

  public cancelRowDelete(cancelArgs: SkyListViewGridRowDeleteCancelArgs): void {
    this.gridController.next({
      type: SkyListViewGridMessageType.AbortDeleteRow,
      data: {
        abortDeleteRow: {
          id: cancelArgs.id,
        },
      },
    });
  }

  public deleteItem(id: string): void {
    this.gridController.next({
      type: SkyListViewGridMessageType.PromptDeleteRow,
      data: {
        promptDeleteRow: {
          id: id,
        },
      },
    });
  }

  public finishRowDelete(
    confirmArgs: SkyListViewGridRowDeleteConfirmArgs
  ): void {
    return;
  }
}
