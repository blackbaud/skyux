import {
  Component,
  Input,
  OnDestroy,
  Output,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  AfterContentInit,
  ChangeDetectorRef,
  SimpleChanges,
  EventEmitter,
  OnChanges,
  HostListener,
  ElementRef,
  ViewChildren,
  ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {
  DragulaService
} from 'ng2-dragula/ng2-dragula';

import {
  ListItemModel,
  ListSortFieldSelectorModel
} from '@skyux/list-builder/modules/list/state';

import {
  SkyGridColumnComponent
} from './grid-column.component';
import {
  SkyGridColumnModel
} from './grid-column.model';
import {
  SkyGridAdapterService
} from './grid-adapter.service';

import {
  SkyGridColumnHeadingModelChange,
  SkyGridColumnWidthModelChange
} from './types';

let nextId = 0;

@Component({
  selector: 'sky-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  viewProviders: [ DragulaService ],
  providers: [
    SkyGridAdapterService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyGridComponent implements AfterContentInit, OnChanges, OnDestroy {
  @Input()
  public selectedColumnIds: Array<string>;

  @Input()
  public fit: string = 'width';

  @Input()
  public width: number;

  @Input()
  public height: number;

  @Input()
  public data: Array<any>;

  @Input()
  public columns: Array<SkyGridColumnModel>;

  @Input()
  public hasToolbar: boolean = false;

  @Input()
  public sortField: ListSortFieldSelectorModel;

  @Input()
  public highlightText: string;

  @Output()
  public selectedColumnIdsChange = new EventEmitter<Array<string>>();

  @Output()
  public sortFieldChange = new EventEmitter<ListSortFieldSelectorModel>();

  @Output()
  public columnWidthChange = new EventEmitter<Array<SkyGridColumnWidthModelChange>>();

  public items: Array<any>;
  public displayedColumns: Array<SkyGridColumnModel>;
  public currentSortField: BehaviorSubject<ListSortFieldSelectorModel>;

  @ContentChildren(SkyGridColumnComponent, { descendants: true })
  private columnComponents: QueryList<SkyGridColumnComponent>;

  private subscriptions: Subscription[] = [];

  // Column resizing.
  public gridId: number = ++nextId;
  public minColWidth = 50;
  public maxColWidth = 9999; // This is an arbitrary number, as the input range picker won't work without a value.
  public columnResizeStep = 10;
  public showResizeBar: boolean = false;
  @ViewChildren('gridCol')
  private columnElementRefs: QueryList<ElementRef>;
  @ViewChildren('colSizeRange')
  private columnRangeInputElementRefs: QueryList<ElementRef>;
  @ViewChild('gridContainer')
  private tableContainerElementRef: ElementRef;
  @ViewChild('gridTable')
  private tableElementRef: ElementRef;
  @ViewChild('resizeBar')
  private resizeBar: ElementRef;
  private tableWidth: number;
  private isDraggingResizeHandle: boolean = false;
  private activeResizeColumnIndex: string;
  private startColumnWidth: number;
  private xPosStart: number;
  private isResized: boolean;

  constructor(
    private dragulaService: DragulaService,
    private ref: ChangeDetectorRef,
    private gridAdapter: SkyGridAdapterService
  ) {
    this.displayedColumns = new Array<SkyGridColumnModel>();
    this.items = new Array<any>();
    this.currentSortField = new BehaviorSubject<ListSortFieldSelectorModel>({
      fieldSelector: '',
      descending: false
    });
  }

  public ngAfterContentInit() {
    if (this.columnComponents.length !== 0 || this.columns !== undefined) {
      /* istanbul ignore else */
      /* sanity check */
      if (this.columnComponents.length > 0) {
        this.getColumnsFromComponent();
      }

      this.transformData();
      this.setDisplayedColumns(true);
    }

    // Watch for added/removed columns:
    this.subscriptions.push(
      this.columnComponents.changes.subscribe(() => this.updateColumns())
    );

    // Watch for column heading changes:
    this.columnComponents.forEach((comp: SkyGridColumnComponent) => {
      this.subscriptions.push(
        comp.headingModelChanges
          .subscribe((change: SkyGridColumnHeadingModelChange) => {
            this.updateColumnHeading(change);
          })
      );
    });

    this.gridAdapter.initializeDragAndDrop(
      this.dragulaService,
      (selectedColumnIds: Array<string>) => {
        this.onHeaderDrop(selectedColumnIds);
      }
    );
  }

  // Do an ngOnChanges where changes to selectedColumnIds and data are watched
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['columns'] && this.columns) {
      this.setDisplayedColumns(true);
    } else if (changes['selectedColumnIds'] && this.columns) {
      this.setDisplayedColumns();
      if (changes['selectedColumnIds'].previousValue !== changes['selectedColumnIds'].currentValue) {
        this.selectedColumnIdsChange.emit(this.selectedColumnIds);
      }
    }

    if (changes['data'] && this.data) {
      this.transformData();
    }

    if (changes['sortField']) {
      this.setSortHeaders();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  public getTableClassNames() {
    let classNames: string[] = [];

    if (this.fit !== 'scroll') {
      classNames.push('sky-grid-fit');
    }

    if (this.hasToolbar) {
      classNames.push('sky-grid-has-toolbar');
    }

    return this.addDelimeter(classNames, ' ');
  }

  public getTableHeaderClassNames(column: SkyGridColumnModel) {
    let classNames: string[] = [];

    if (column.locked) {
      classNames.push('sky-grid-header-locked');
    }

    return this.addDelimeter(classNames, ' ');
  }

  public getCaretIconNames(column: SkyGridColumnModel) {
    let iconNames: string[] = [];

    this.getSortDirection(column.field).subscribe((sortDir) => {
      if (sortDir === 'asc') {
        iconNames.push('caret-up');
      }
      if (sortDir === 'desc') {
        iconNames.push('caret-down');
      }
    });

    return this.addDelimeter(iconNames, ' ');
  }

  public onKeydown(event: KeyboardEvent, column: SkyGridColumnModel) {
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      this.sortByColumn(column);
    }
  }

  public sortByColumn(column: SkyGridColumnModel) {
    if (!this.isDraggingResizeHandle && column.isSortable) {
      this.currentSortField
      .take(1)
      .map(field => {
        let selector = {
          fieldSelector: column.field,
          descending: true
        };

        if (field && field.fieldSelector === column.field && field.descending) {
          selector = {
            fieldSelector: column.field,
            descending: false
          };
        }
        this.sortFieldChange.emit(selector);
        this.currentSortField.next(selector);
      })
      .subscribe();
    }
  }

  public getSortDirection(columnField: string): Observable<string> {
    return this.currentSortField
      .distinctUntilChanged()
      .map(field => {
        return field.fieldSelector === columnField ?
          (field.descending ? 'desc' : 'asc') : undefined;
      });
  }

  public getAriaSortDirection(column: SkyGridColumnModel): Observable<string> {
    return this.currentSortField
      .distinctUntilChanged()
      .map(field => {
      return field.fieldSelector === column.field ?
        (field.descending ? 'descending' : 'ascending') : (column.isSortable ? 'none' : undefined);
    });
  }

  public updateColumnHeading(change: SkyGridColumnHeadingModelChange) {
    const foundColumnModel = this.columns.find((column: SkyGridColumnModel) => {
      return (
        change.id !== undefined && change.id === column.id ||
        change.field !== undefined && change.field === column.field
      );
    });

    /* istanbul ignore else */
    if (foundColumnModel) {
      foundColumnModel.heading = change.value;
      this.ref.markForCheck();
    }
  }

  public onMouseDownResizeCol(event: MouseEvent) {
    // If this table hasn't been resized, initialize all the resize widths.
    if (!this.isResized) {
      this.initColumnWidths();
      this.isResized = true;
    }

    this.initializeResizeColumn(event);

    this.isDraggingResizeHandle = true;
    this.xPosStart = event.pageX;
    this.showResizeBar = true;

    // Show visual indicator of where mouse is dragging (resizeBar).
    this.ref.detectChanges();
    let parentScroll = this.tableContainerElementRef.nativeElement.scrollLeft;
    let resizeBarX = event.pageX - this.tableElementRef.nativeElement.getBoundingClientRect().left - parentScroll;
    this.gridAdapter.setStyle(this.resizeBar, 'left', resizeBarX + 'px');

    event.preventDefault();
    event.stopPropagation();
  }

  public onKeydownResizeCol(event: KeyboardEvent) {
    // If this table hasn't been resized, initialize all the resize widths.
    if (!this.isResized) {
      this.initColumnWidths();
      this.isResized = true;
    }

    this.initializeResizeColumn(event);
  }

  public onInputChangeResizeCol(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = Number(input.value);
    let deltaX = newValue - this.startColumnWidth;
    this.resizeColumnByIndex(this.activeResizeColumnIndex, newValue, deltaX);
  }

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent) {
    if (!this.isDraggingResizeHandle) {
      return;
    }

    let deltaX = event.pageX - this.xPosStart;
    let newColWidth = this.startColumnWidth + deltaX;

    if (newColWidth <= this.minColWidth) {
      event.stopPropagation();
      return;
    }

    let max = this.getMaxRangeByIndex(this.activeResizeColumnIndex);
    if (this.fit === 'width' && newColWidth > max) {
      event.stopPropagation();
      return;
    }

    let parentScroll = this.tableContainerElementRef.nativeElement.scrollLeft;
    let resizeBarX = event.pageX - this.tableElementRef.nativeElement.getBoundingClientRect().left - parentScroll;
    this.gridAdapter.setStyle(this.resizeBar, 'left', resizeBarX + 'px');
  }

  @HostListener('document:mouseup', ['$event'])
  public onResizeHandleRelease(event: MouseEvent) {
    if (this.isDraggingResizeHandle) {
      this.showResizeBar = false;
      let deltaX = event.pageX - this.xPosStart;
      let newColWidth = this.startColumnWidth + deltaX;
      this.resizeColumnByIndex(this.activeResizeColumnIndex, newColWidth, deltaX);
      this.isDraggingResizeHandle = false;
      this.activeResizeColumnIndex = undefined;

      event.stopPropagation();
    }
  }

  private onHeaderDrop(newColumnIds: Array<string>) {
    // update selected columnIds
    this.selectedColumnIds = newColumnIds;
    this.selectedColumnIdsChange.emit(newColumnIds);

    // set new displayed columns
    this.displayedColumns = this.selectedColumnIds.map(
      columnId => this.columns.filter(column => column.id === columnId)[0]
    );

    // mark for check because we are using ChangeDetectionStrategy.onPush
    this.ref.markForCheck();
  }

  private setDisplayedColumns(respectHidden: boolean = false) {
    if (this.selectedColumnIds !== undefined) {
      // setup displayed columns
      this.displayedColumns = this.selectedColumnIds.map(
        columnId => this.columns.filter(column => column.id === columnId)[0]
      );
    } else if (respectHidden) {
      this.displayedColumns = this.columns.filter(column => {
        return !column.hidden;
      });
    } else {
      this.displayedColumns = this.columns;
    }
  }

  private transformData() {
    // Transform data into object with id and data properties
    if (this.data.length > 0 && this.data[0].id && !this.data[0].data) {
      this.items = this.data.map(item => new ListItemModel(item.id, item));
    } else {
      this.items = this.data;
    }
  }

  private setSortHeaders() {
    this.currentSortField.next(this.sortField || { fieldSelector: '', descending: false });
  }

  private getColumnsFromComponent() {
    this.columns = this.columnComponents.map(columnComponent => {
      return new SkyGridColumnModel(columnComponent.template, columnComponent);
    });
  }

  private updateColumns() {
    this.getColumnsFromComponent();
    this.setDisplayedColumns(true);
    this.ref.markForCheck();
  }

  private resizeColumnByIndex(columnIndex: string, newColWidth: number, deltaX: number) {
    let column = this.getColumnModelByIndex(columnIndex);

    // Prevent accidental shrinkage below minimum width.
    if (newColWidth <= this.minColWidth) {
      deltaX = deltaX + this.minColWidth - newColWidth;
      newColWidth = this.minColWidth;
    }

    // fit=width adds/removes width from the last column
    // fit=scroll adds/removes width from the table
    if (this.fit === 'width') {
      let lastColumn = this.getLastDisplayedColumn();

      // Prevent accidental growth that would bump last column off screen.
      let max = this.getMaxRangeByIndex(columnIndex);
      if (newColWidth > max) {
        newColWidth = max;
        deltaX = max - this.startColumnWidth;
      }
      column.width = newColWidth;
      lastColumn.width = lastColumn.width - deltaX;
      this.updateMaxRange();
    } else {
      this.gridAdapter.setStyle(this.tableElementRef, 'width', `${this.tableWidth + deltaX}px`);
      column.width = newColWidth;
    }

    this.ref.detectChanges();
    this.columnWidthChange.emit(this.getColumnWidthModelChange());

    // If in "scroll" mode, reset the full table width.
    // This prevents pixel "hopping" for the non-resized columns
    if (this.fit === 'scroll') {
      this.tableWidth = this.tableElementRef.nativeElement.offsetWidth;
    }
  }

  private initColumnWidths() {
    // Establish table width.
    this.tableWidth = this.tableElementRef.nativeElement.offsetWidth;

    // Set column widths based on the width initially given by the browser.
    // computedWidth prevents accidental overflow for browsers with sub-pixel widths.
    this.columnElementRefs.forEach((col, index) => {
      let computedWidth = parseFloat(window.getComputedStyle(col.nativeElement).width);
      let offsetWidth = col.nativeElement.offsetWidth;
      let width = Math.max(computedWidth || offsetWidth, this.minColWidth);
      this.getColumnModelByIndex(index).width = width;
    });

    // 'scroll' tables should be allowed to expand outside of their constraints.
    if (this.fit === 'scroll') {
      this.gridAdapter.setStyle(this.tableElementRef, 'min-width', 'auto');
    }

    // Update max limits for input ranges.
    if (this.fit === 'width') {
      this.updateMaxRange();
    }

    this.ref.detectChanges();
  }

  private getColumnWidthModelChange() {
    let columnWidthModelChange = new Array<SkyGridColumnWidthModelChange>();
    this.displayedColumns.forEach(column => {
      columnWidthModelChange.push({
        id: column.id,
        field: column.field,
        width: column.width
      });
    });
    return columnWidthModelChange;
  }

  private updateMaxRange() {
    let leftoverWidth = this.getLastDisplayedColumn().width - this.minColWidth;
    this.displayedColumns.forEach((column, index) => {
      let newMaxRange = column.width + leftoverWidth;
      let rangeInput = this.getRangeInputByIndex(index);
      rangeInput.nativeElement.max = newMaxRange;
      rangeInput.nativeElement.setAttribute('aria-valuemax', newMaxRange);
    });
  }

  private initializeResizeColumn(event: any) {
    const clickTarget = event.target as HTMLElement;
    this.activeResizeColumnIndex = clickTarget.getAttribute('sky-cmp-index');
    let column = this.getColumnModelByIndex(this.activeResizeColumnIndex);
    this.startColumnWidth = column.width;
  }

  private getRangeInputByIndex(index: string | number) {
    return this.columnRangeInputElementRefs.find(input =>
      input.nativeElement.getAttribute('sky-cmp-index') === index.toString()
    );
  }

  private getColumnModelByIndex(index: string | number) {
    return this.displayedColumns[Number(index)];
  }

  private getMaxRangeByIndex(index: string) {
    let columnElementRef = this.columnElementRefs.find(th =>
      th.nativeElement.getAttribute('sky-cmp-index') === index
    );
    let rangeInput = columnElementRef.nativeElement.querySelector('.sky-grid-column-input-aria-only');
    return Number(rangeInput.max);
  }

  private getLastDisplayedColumn() {
    return this.getColumnModelByIndex(this.displayedColumns.length - 1);
  }

  private addDelimeter(text: string[], delimiter: string) {
    return text.filter(val => val).join(delimiter);
  }
}
