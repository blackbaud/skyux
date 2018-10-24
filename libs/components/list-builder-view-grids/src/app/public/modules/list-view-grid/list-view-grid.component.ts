import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import {
  getValue
} from 'microedge-rxstate/dist/helpers';

import {
  AsyncList
} from 'microedge-rxstate/dist';

import {
  SkyGridComponent,
  SkyGridColumnComponent,
  SkyGridColumnHeadingModelChange,
  SkyGridColumnModel
} from '@skyux/grids';

import {
  ListItemModel,
  ListSortFieldSelectorModel,
  ListSearchModel,
  ListStateDispatcher,
  ListState
} from '@skyux/list-builder/modules/list/state';

import {
  getData,
  isObservable
} from '@skyux/list-builder/modules/list/helpers';

import {
  ListViewComponent
} from '@skyux/list-builder';

import {
  GridState,
  GridStateDispatcher,
  GridStateModel
} from './state';

import { ListViewGridColumnsLoadAction } from './state/columns/actions';
import { ListViewDisplayedGridColumnsLoadAction } from './state/displayed-columns/actions';

@Component({
  selector: 'sky-list-view-grid',
  templateUrl: './list-view-grid.component.html',
  providers: [
    /* tslint:disable */
    { provide: ListViewComponent, useExisting: forwardRef(() => SkyListViewGridComponent) },
    /* tslint:enable */
    GridState,
    GridStateDispatcher,
    GridStateModel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListViewGridComponent
  extends ListViewComponent implements AfterContentInit, OnDestroy {

  @Input()
  public set name(value: string) {
    this.viewName = value;
  }

  @Input()
  public displayedColumns: Array<string> | Observable<Array<string>>;

  @Input()
  public hiddenColumns: Array<string> | Observable<Array<string>>;

  @Input()
  public fit: string = 'width';

  @Input()
  public width: number | Observable<number>;

  @Input()
  public height: number | Observable<number>;

  @Input()
  public highlightSearchText: boolean = true;

  @Output()
  public selectedColumnIdsChange = new EventEmitter<Array<string>>();

  @ViewChild(SkyGridComponent)
  public gridComponent: SkyGridComponent;

  public columns: Observable<Array<SkyGridColumnModel>>;

  public selectedColumnIds: Observable<Array<string>>;

  public items: Observable<ListItemModel[]>;

  public loading: Observable<boolean>;

  public sortField: Observable<ListSortFieldSelectorModel>;

  public currentSearchText: Observable<string>;

  /* tslint:disable */
  @Input('search')
  private searchFunction: (data: any, searchText: string) => boolean;
  /* tslint:enable */

  @ContentChildren(SkyGridColumnComponent, { descendants: true })
  private columnComponents: QueryList<SkyGridColumnComponent>;

  private ngUnsubscribe = new Subject();

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher,
    public gridState: GridState,
    public gridDispatcher: GridStateDispatcher
  ) {
    super(state, 'Grid View');
  }

  public ngAfterContentInit() {
    if (this.columnComponents.length === 0) {
      throw new Error('Grid view requires at least one sky-grid-column to render.');
    }

    let columnModels = this.columnComponents.map(columnComponent => {
      return new SkyGridColumnModel(columnComponent.template, columnComponent);
    });

    if (this.width && !isObservable(this.width)) {
      this.width = Observable.of(this.width);
    }

    if (this.height && !isObservable(this.height)) {
      this.height = Observable.of(this.height);
    }

    // Setup Observables for template
    this.columns = this.gridState.map(s => s.columns.items).distinctUntilChanged();

    this.selectedColumnIds = this.getSelectedIds();

    this.items = this.getGridItems();

    this.loading = this.state.map((s) => {
      return s.items.loading;
    }).distinctUntilChanged();

    this.sortField = this.state.map((s) => {
      /* istanbul ignore else */
      /* sanity check */
      if (s.sort && s.sort.fieldSelectors) {
        return s.sort.fieldSelectors[0];
      }
      /* istanbul ignore next */
      /* sanity check */
      return undefined;
    }).distinctUntilChanged();

    this.gridState.map(s => s.columns.items)
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe(columns => {
        if (this.hiddenColumns) {
          getValue(this.hiddenColumns, (hiddenColumns: string[]) => {
            this.gridDispatcher.next(
              new ListViewDisplayedGridColumnsLoadAction(
                columns.filter(x => {
                  /* istanbul ignore next */
                  /* sanity check */
                  let id = x.id || x.field;
                  return hiddenColumns.indexOf(id) === -1;
                }),
                true
              )
            );
          });

        } else if (this.displayedColumns) {
          getValue(this.displayedColumns, (displayedColumns: string[]) => {
            this.gridDispatcher.next(
              new ListViewDisplayedGridColumnsLoadAction(
                columns.filter(x => displayedColumns.indexOf(x.id || x.field) !== -1),
                true
              )
            );
          });

        } else {
          this.gridDispatcher.next(
            new ListViewDisplayedGridColumnsLoadAction(columns.filter(x => !x.hidden), true)
          );
        }
      });

      this.currentSearchText = this.state.map(s => s.search.searchText)
        .distinctUntilChanged();

    this.gridDispatcher.next(new ListViewGridColumnsLoadAction(columnModels, true));

    this.handleColumnChange();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public columnIdsChanged(selectedColumnIds: Array<string>) {
    this.gridState.map(s => s.columns.items)
      .take(1)
      .subscribe(columns => {
        let displayedColumns = selectedColumnIds.map(
          columnId => columns.filter(c => c.id === columnId)[0]
        );
        this.gridDispatcher.next(
          new ListViewDisplayedGridColumnsLoadAction(displayedColumns, true)
        );
      });
  }

  public sortFieldChanged(sortField: ListSortFieldSelectorModel) {
    this.dispatcher.sortSetFieldSelectors([sortField]);
  }

  public onViewActive() {
    this.gridState.map(s => s.displayedColumns.items)
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe(displayedColumns => {
        let setFunctions =
          this.searchFunction !== undefined ? [this.searchFunction] :
            displayedColumns
              .map(column => (data: any, searchText: string) =>
                column.searchFunction(getData(data, column.field), searchText)
              )
              .filter(c => c !== undefined);

        this.state.take(1).subscribe(s => {
          this.dispatcher.searchSetOptions(new ListSearchModel({
            searchText: s.search.searchText,
            functions: setFunctions,
            fieldSelectors: displayedColumns.map(d => d.field)
          }));
        });
      });
  }

  private handleColumnChange() {
    // watch for changes in column components
    this.columnComponents.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe((columnComponents) => {
        let columnModels = this.columnComponents.map(column => {
          return new SkyGridColumnModel(column.template, column);
        });
        this.gridDispatcher.next(new ListViewGridColumnsLoadAction(columnModels, true));
      });

    // Watch for column heading changes:
    this.columnComponents.forEach((comp: SkyGridColumnComponent) => {
      comp.headingModelChanges
        .takeUntil(this.ngUnsubscribe)
        .subscribe((change: SkyGridColumnHeadingModelChange) => {
          this.gridComponent.updateColumnHeading(change);
        });
    });
  }

  private getGridItems(): Observable<Array<ListItemModel>> {
    /*
      Ran into problem where state updates were consumed out of order. For example, on search text
      update, the searchText update was consumed after the resulting list item update. Scanning the
      previous value of items lastUpdate ensures that we only receive the latest items.
    */
    return this.state.map((s) => {
      return s.items;
    })
      .scan((previousValue: AsyncList<ListItemModel>, newValue: AsyncList<ListItemModel>) => {
        if (previousValue.lastUpdate > newValue.lastUpdate) {
          return previousValue;
        } else {
          return newValue;
        }
      })
      .map((result: AsyncList<ListItemModel>) => {
        return result.items;
      })
      .distinctUntilChanged();
  }

  private getSelectedIds(): Observable<Array<string>> {
    /*
      Same problem as above. We should move from having a state object observable with a bunch of
      static properties to a static state object with observable properties that you can subscribe
      to.
    */
    return this.gridState
      .map(s => s.displayedColumns)
      .scan(
        (previousValue: AsyncList<SkyGridColumnModel>, newValue: AsyncList<SkyGridColumnModel>) => {
          if (previousValue.lastUpdate > newValue.lastUpdate) {
            return previousValue;
          } else {
            return newValue;
          }
        })
      .map((result: AsyncList<SkyGridColumnModel>) => {
        /* istanbul ignore next */
        /* sanity check */
        return result.items.map((column: SkyGridColumnModel) => {
          return column.id || column.field;
        });
      }).distinctUntilChanged((previousValue: string[], newValue: string[]) => {
        return this.haveColumnIdsChanged(previousValue, newValue);
      });
  }

  private haveColumnIdsChanged(previousValue: string[], newValue: string[]) {
    if (previousValue.length !== newValue.length) {
      this.selectedColumnIdsChange.emit(newValue);
      return false;
    }

    for (let i = 0; i < previousValue.length; i++) {
      if (previousValue[i] !== newValue[i]) {
        this.selectedColumnIdsChange.emit(newValue);
        return false;
      }
    }
    return true;
  }
}
