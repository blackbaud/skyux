import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SkyGridColumnModel } from '@skyux/grids';
import {
  ListState,
  ListStateDispatcher,
  ListToolbarItemModel,
  SkyListSecondaryActionsComponent,
} from '@skyux/list-builder';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map as observableMap,
  take,
} from 'rxjs/operators';

import {
  SkyColumnSelectorContext,
  SkyColumnSelectorModel,
} from '../column-selector/column-selector-context';
import { SkyColumnSelectorComponent } from '../column-selector/column-selector-modal.component';
import { SkyListViewGridComponent } from '../list-view-grid/list-view-grid.component';
import { ListViewDisplayedGridColumnsLoadAction } from '../list-view-grid/state/displayed-columns/load.action';
import { GridStateModel } from '../list-view-grid/state/grid-state.model';

/**
 * Provides a column selector modal for a list grid view when placed in a
 * [list toolbar](https://developer.blackbaud.com/skyux/components/list/toolbar).
 */
@Component({
  selector: 'sky-list-column-selector-action',
  templateUrl: './list-column-selector-action.component.html',
})
export class SkyListColumnSelectorActionComponent implements AfterContentInit {
  /**
   * Enables the column selector in the list toolbar. Set this attribute to the instance of
   * the `sky-grid-view` component using the component's template reference variable.
   */
  @Input()
  public gridView: SkyListViewGridComponent;

  /**
   * Specifies a `helpKey` string and displays a help button in the grid header. When users select
   * the button, the `helpOpened` event broadcasts the `helpKey` parameter.
   */
  @Input()
  public helpKey: string;

  /**
   * Fires when users click the help button and broadcasts the `helpKey`.
   */
  @Output()
  public helpOpened = new EventEmitter<string>();

  @ViewChild('columnChooser', {
    static: true,
  })
  private columnChooserTemplate: TemplateRef<any>;

  private columnSelectorActionItemToolbarIndex = 7000;

  constructor(
    public listState: ListState,
    private modalService: SkyModalService,
    private dispatcher: ListStateDispatcher,
    @Optional() public secondaryActions: SkyListSecondaryActionsComponent
  ) {}

  public ngAfterContentInit() {
    if (!this.secondaryActions) {
      const columnChooserItem = new ListToolbarItemModel({
        id: 'column-chooser',
        template: this.columnChooserTemplate,
        location: 'left',
      });

      this.dispatcher.toolbarAddItems(
        [columnChooserItem],
        this.columnSelectorActionItemToolbarIndex
      );
    }
  }

  get isInGridView(): Observable<boolean> {
    return this.listState.pipe(
      observableMap((s) => s.views.active),
      observableMap((activeView) => {
        return this.gridView && activeView === this.gridView.id;
      }),
      distinctUntilChanged()
    );
  }

  get isInGridViewAndSecondary(): Observable<boolean> {
    return this.listState.pipe(
      observableMap((s) => s.views.active),
      observableMap((activeView) => {
        return (
          this.secondaryActions &&
          this.gridView &&
          activeView === this.gridView.id
        );
      }),
      distinctUntilChanged()
    );
  }

  public openColumnSelector() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.gridView) {
      let columns: Array<SkyColumnSelectorModel> = [];
      let selectedColumnIds: Array<string> = [];
      this.gridView.gridState
        .pipe(take(1))
        .subscribe((state: GridStateModel) => {
          columns = state.columns.items
            .filter((item: SkyGridColumnModel) => {
              return !item.locked;
            })
            .map((item: SkyGridColumnModel) => {
              return {
                id: item.id,
                heading: item.heading,
                description: item.description,
              };
            });
          selectedColumnIds = state.displayedColumns.items
            .filter((item: SkyGridColumnModel) => {
              return !item.locked;
            })
            .map((item: SkyGridColumnModel) => {
              return item.id;
            });
        });

      const modalInstance = this.modalService.open(SkyColumnSelectorComponent, {
        providers: [
          {
            provide: SkyColumnSelectorContext,
            useValue: {
              columns,
              selectedColumnIds,
            },
          },
        ],
        helpKey: this.helpKey,
      });

      modalInstance.helpOpened.subscribe((helpKey: string) => {
        this.helpOpened.emit(helpKey);
        this.helpOpened.complete();
      });

      modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save' && result.data) {
          const newSelectedIds = result.data;
          let newDisplayedColumns: Array<SkyGridColumnModel> = [];
          this.gridView.gridState
            .pipe(take(1))
            .subscribe((state: GridStateModel) => {
              newDisplayedColumns = state.columns.items.filter((item) => {
                return newSelectedIds.indexOf(item.id) > -1 || item.locked;
              });
            });
          this.gridView.gridDispatcher.next(
            new ListViewDisplayedGridColumnsLoadAction(
              newDisplayedColumns,
              true
            )
          );
        }
      });
    }
  }
}
