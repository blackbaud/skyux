import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAppWindowRef,
  SkyOverlayService,
  SkyUIConfigService,
} from '@skyux/core';
import {
  ListItemModel,
  ListSortFieldSelectorModel,
} from '@skyux/list-builder-common';

import { DragulaService } from 'ng2-dragula';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  fromEvent,
  merge,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  take,
  takeUntil,
  takeWhile,
} from 'rxjs/operators';

import { SkyGridAdapterService } from './grid-adapter.service';
import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridColumnModel } from './grid-column.model';
import { SkyGridColumnDescriptionModelChange } from './types/grid-column-description-model-change';
import { SkyGridColumnHeadingModelChange } from './types/grid-column-heading-model-change';
import { SkyGridColumnInlineHelpPopoverModelChange } from './types/grid-column-inline-help-popover-model-change';
import { SkyGridColumnWidthModelChange } from './types/grid-column-width-model-change';
import { SkyGridMessage } from './types/grid-message';
import { SkyGridMessageType } from './types/grid-message-type';
import { SkyGridRowDeleteCancelArgs } from './types/grid-row-delete-cancel-args';
import { SkyGridRowDeleteConfig } from './types/grid-row-delete-config';
import { SkyGridRowDeleteConfirmArgs } from './types/grid-row-delete-confirm-args';
import { SkyGridRowDeleteContents } from './types/grid-row-delete-contents';
import { SkyGridSelectedRowsModelChange } from './types/grid-selected-rows-model-change';
import { SkyGridSelectedRowsSource } from './types/grid-selected-rows-source';
import { SkyGridUIConfig } from './types/grid-ui-config';

let nextId = 0;

@Component({
  selector: 'sky-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  viewProviders: [DragulaService],
  providers: [SkyGridAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyGridComponent
  implements OnInit, AfterContentInit, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * Specifies columns and column properties for the grid.
   */
  @Input()
  public set columns(newColumns: Array<SkyGridColumnModel>) {
    const oldColumns = this.columns;
    this._columns = newColumns;
    if (oldColumns) {
      this.transferColumnWidths(oldColumns, this.columns);
      this.isResized = false;
      this.setDisplayedColumns(true);
    }
    this.changeDetector.markForCheck();
  }

  public get columns(): Array<SkyGridColumnModel> {
    return this._columns;
  }

  /**
   * Specifies the data for the grid. Each item requires an `id` and a property that maps
   * to the `field` or `id` property of each column in the grid.
   */
  @Input()
  public data: Array<any>;

  /**
   * Indicates whether to enable the multiselect feature to display a column of
   * checkboxes on the left side of the grid. You can specify a unique ID with
   * the `multiselectRowId` property, but multiselect defaults to the `id` property on
   * the `data` object. To include options to select and clear all multiselect checkboxes,
   * we recommend the [list view grid](https://developer.blackbaud.com/skyux/components/list/grid) component.
   * @default false
   */
  @Input()
  public enableMultiselect = false;

  /**
   * Specifies how the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default "width"
   */
  @Input()
  public fit = 'width';

  /**
   * Indicates whether to display a toolbar with the grid.
   */
  @Input()
  public hasToolbar = false;

  /**
   * Specifies the height of the grid.
   */
  @Input()
  public height: number;

  /**
   * Specifies text to highlight within the grid.
   * Typically, this property is used in conjunction with search.
   */
  @Input()
  public highlightText: string;

  /**
   * Provides an observable to send commands to the grid.
   */
  @Input()
  public messageStream = new Subject<SkyGridMessage>();

  /**
   * Specifies a unique ID that matches a property on the `data` object.
   * By default, this property uses the `id` property.
   */
  @Input()
  public multiselectRowId: string;

  /**
   * Specifies the ID of the row to highlight. The ID matches the `id` property
   * of the `data` object. Typically, this property is used in conjunction with
   * the flyout component to indicate the currently selected row.
   */
  @Input()
  public rowHighlightedId: string;

  /**
   * Specifies the columns to display in the grid based on the `id` or `field` properties
   * of the columns. If no columns are specified, then the grid displays all columns.
   */
  @Input()
  public set selectedColumnIds(value: Array<string>) {
    const currentIds = this._selectedColumnIds;
    this._selectedColumnIds = value;

    if (this.columns) {
      this.setDisplayedColumns();
    }

    // Ensure that the ids have changed.
    if (!currentIds || !value || !this.arraysEqual(value, currentIds)) {
      // This variable ensures that we do not set user config options or fire the change event
      // on the first time that the columns are set up
      if (this.selectedColumnIdsSet) {
        this.setUserConfig({
          selectedColumnIds: value,
        });

        this.selectedColumnIdsChange.emit(this._selectedColumnIds);

        if (this.isResized) {
          this.resetTableWidth();
        }
      }
    }

    this.selectedColumnIdsSet = true;
  }

  public get selectedColumnIds(): Array<string> {
    return this._selectedColumnIds;
  }

  /**
   * Specifies a set of IDs for the rows to select in a multiselect grid.
   * The IDs match the `id` properties of the `data` objects.
   * Rows with IDs that are not included are de-selected in the grid.
   */
  @Input()
  public set selectedRowIds(value: Array<string>) {
    if (value) {
      this._selectedRowIds = value;
      this.applySelectedRows();
      this.emitSelectedRows(SkyGridSelectedRowsSource.SelectedRowIdsChange);
    }
  }

  public get selectedRowIds(): Array<string> {
    return this._selectedRowIds;
  }

  /**
   * Specifies a unique key for the UI Config Service to retrieve stored settings from a database.
   * The UI Config Service saves configuration settings for users and returns
   * `selectedColumnIds` to preserve the columns to display and the preferred column order. You  must provide `id` values for your `sky-grid-column` elements because the UI Config Service depends on those values to organize columns based on user settings. For more information about the UI Config Service, see [the sticky settings documentation](https://developer.blackbaud.com/skyux/learn/get-started/sticky-settings).
   */
  @Input()
  public settingsKey: string;

  /**
   * Displays a caret in the column that was used to sort the grid. This is particularly useful
   * when you programmatically sort data and want to visually indicate how the grid was sorted.
   * This property accepts a `ListSortFieldSelectorModel` value with the following properties:
   * - `fieldSelector` Represents the current sort field. This property accepts `string` values.
   * - `descending` Indicates whether to sort in descending order. The caret that visually
   * indicates the sort order points down for descending order and up for ascending order.
   * This property accepts `boolean` values. Default is `false`.
   */
  @Input()
  public sortField: ListSortFieldSelectorModel;

  /**
   * Specifies the width of the grid in pixels.
   */
  @Input()
  public width: number;

  /**
   * Fires when the width of a column changes.
   */
  @Output()
  public columnWidthChange = new EventEmitter<
    Array<SkyGridColumnWidthModelChange>
  >();

  /**
   * Fires when the selection of multiselect checkboxes changes.
   * Emits an array of IDs for the selected rows based on the `multiselectRowId` property
   * that the consumer provides.
   */
  @Output()
  public multiselectSelectionChange = new EventEmitter<SkyGridSelectedRowsModelChange>();

  /**
   * @internal
   */
  @Output()
  public rowDeleteCancel = new EventEmitter<SkyGridRowDeleteCancelArgs>();

  /**
   * @internal
   */
  @Output()
  public rowDeleteConfirm = new EventEmitter<SkyGridRowDeleteConfirmArgs>();

  /**
   * Fires when the columns to display in the grid change or when the order of the columns changes.
   * The event emits an array of IDs for the displayed columns that reflects the column order.
   */
  @Output()
  public selectedColumnIdsChange = new EventEmitter<Array<string>>();

  /**
   * Fires when the active sort field changes.
   */
  @Output()
  public sortFieldChange = new EventEmitter<ListSortFieldSelectorModel>();

  public columnResizeStep = 10;
  public currentSortField: BehaviorSubject<ListSortFieldSelectorModel>;
  public displayedColumns: Array<SkyGridColumnModel>;
  public gridId: number = ++nextId;
  public rowDeleteConfigs: SkyGridRowDeleteConfig[] = [];
  public items: Array<any>;
  public maxColWidth = 9999; // This is an arbitrary number, as the input range picker won't work without a value.
  public minColWidth = 50;
  public showResizeBar = false;
  public showTopScroll = false;

  public get tableWidth() {
    return this.tableElementRef.nativeElement.offsetWidth;
  }

  @ContentChildren(SkyGridColumnComponent)
  private columnComponents: QueryList<SkyGridColumnComponent>;

  @ViewChildren('gridCol')
  private columnElementRefs: QueryList<ElementRef>;
  @ViewChildren('colSizeRange')
  private columnRangeInputElementRefs: QueryList<ElementRef>;
  @ViewChildren('inlineDeleteRef')
  private inlineDeleteRefs: QueryList<ElementRef>;
  @ViewChild('inlineDeleteTemplateRef', { read: TemplateRef })
  private inlineDeleteTemplateRef: TemplateRef<any>;
  @ViewChild('gridContainer')
  private tableContainerElementRef: ElementRef;
  @ViewChild('gridTable')
  private tableElementRef: ElementRef;
  @ViewChild('topScrollContainer')
  private topScrollContainerElementRef: ElementRef;
  @ViewChild('resizeBar')
  private resizeBar: ElementRef;

  private activeResizeColumnIndex: string;
  private isDraggingResizeHandle = false;
  private isResized = false;
  private ngUnsubscribe = new Subject();
  private rowDeleteContents: { [id: string]: SkyGridRowDeleteContents } = {};
  private startColumnWidth: number;
  private subscriptions: Subscription[] = [];
  private scrollTriggered = false;
  private selectedColumnIdsSet = false;
  private xPosStart: number;

  private _columns: Array<SkyGridColumnModel>;
  private _selectedColumnIds: Array<string>;
  private _selectedRowIds: Array<string>;

  constructor(
    private affixService: SkyAffixService,
    private changeDetector: ChangeDetectorRef,
    private dragulaService: DragulaService,
    private gridAdapter: SkyGridAdapterService,
    private overlayService: SkyOverlayService,
    private skyWindow: SkyAppWindowRef,
    private uiConfigService: SkyUIConfigService
  ) {
    this.displayedColumns = new Array<SkyGridColumnModel>();
    this.items = new Array<any>();
    this.currentSortField = new BehaviorSubject<ListSortFieldSelectorModel>({
      fieldSelector: '',
      descending: false,
    });
  }

  public ngOnInit() {
    this.messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyGridMessage) => {
        this.handleIncomingMessages(message);
      });
  }

  public ngAfterContentInit() {
    if (this.settingsKey) {
      this.applyUserConfig().then(() => {
        this.initColumns();
      });
    } else {
      this.initColumns();
    }

    // Setup column drag-and-drop.
    this.gridAdapter.initializeDragAndDrop(
      this.dragulaService,
      (selectedColumnIds: Array<string>) => {
        this.onHeaderDrop(selectedColumnIds);
      }
    );

    this.applySelectedRows();
  }

  public ngAfterViewInit() {
    this.checkUserColumnWidthsForScroll();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.columns && this.columns) {
      if (this.selectedColumnIds) {
        this.selectedColumnIds = this.selectedColumnIds.filter((columnId) => {
          return this.columns.find((column) => column.id === columnId);
        });
      }
      this.setDisplayedColumns(true);
    }

    if (changes.data && this.data) {
      this.transformData();

      // This set timeout is necessary to ensure the data has rendered in the grid
      setTimeout(() => {
        // This cleans up any lingering row deletes for items that have been removed.
        Object.keys(this.rowDeleteContents).forEach((id) => {
          if (!this.data.find((item) => item.id === id)) {
            this.destroyRowDelete(id);
          } else {
            // The rows re-render thus messing up the affixers. We must reaffix them so that things
            // continue to render correctly.
            const rowElement: HTMLElement =
              this.tableElementRef.nativeElement.querySelector(
                '[sky-cmp-id="' + id + '"]'
              );

            this.rowDeleteContents[id].affixer.affixTo(rowElement, {
              autoFitContext: SkyAffixAutoFitContext.Viewport,
              isSticky: true,
              placement: 'above',
              verticalAlignment: 'top',
              horizontalAlignment: 'left',
              enableAutoFit: false,
            });
          }
        });

        this.checkUserColumnWidthsForScroll();
      });
    }

    if (changes.sortField) {
      this.setSortHeaders();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.multiselectSelectionChange.complete();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    Object.keys(this.rowDeleteContents).forEach((id) => {
      this.destroyRowDelete(id);
    });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.checkUserColumnWidthsForScroll();
  }

  public getTopScrollWidth(): string {
    return this.tableElementRef.nativeElement.scrollWidth;
  }

  public getTableClassNames() {
    const classNames: string[] = [];

    if (this.fit !== 'scroll') {
      classNames.push('sky-grid-fit');
    }

    if (this.hasToolbar) {
      classNames.push('sky-grid-has-toolbar');
    }

    return this.addDelimeter(classNames, ' ');
  }

  public getTableHeaderClassNames(column: SkyGridColumnModel) {
    const classNames: string[] = [];

    if (column && column.locked) {
      classNames.push('sky-grid-header-locked');
    }

    return this.addDelimeter(classNames, ' ');
  }

  public getCaretIconNames(column: SkyGridColumnModel) {
    const iconNames: string[] = [];

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
        .pipe(
          take(1),
          map((field) => {
            let selector = {
              fieldSelector: column.field,
              descending: true,
            };

            if (
              field &&
              field.fieldSelector === column.field &&
              field.descending
            ) {
              selector = {
                fieldSelector: column.field,
                descending: false,
              };
            }
            this.sortFieldChange.emit(selector);
            this.currentSortField.next(selector);
          })
        )
        .subscribe();
    }
  }

  public getSortDirection(columnField: string): Observable<string> {
    return this.currentSortField.pipe(
      distinctUntilChanged(),
      map((field) => {
        return field.fieldSelector === columnField
          ? field.descending
            ? 'desc'
            : 'asc'
          : undefined;
      })
    );
  }

  public getAriaSortDirection(column: SkyGridColumnModel): Observable<string> {
    return this.currentSortField.pipe(
      distinctUntilChanged(),
      map((field) => {
        return field.fieldSelector === column.field
          ? field.descending
            ? 'descending'
            : 'ascending'
          : column.isSortable
          ? 'none'
          : undefined;
      })
    );
  }

  public getCaretVisibility(columnField: string): Observable<string> {
    return this.currentSortField.pipe(
      distinctUntilChanged(),
      map((field) => {
        return field.fieldSelector === columnField ? 'visible' : 'hidden';
      })
    );
  }

  public getHelpInlineClass(columnField: string): Observable<boolean> {
    return this.getCaretVisibility(columnField).pipe(
      map((visibility: string) => {
        return visibility === 'hidden';
      })
    );
  }

  public onMultiselectCheckboxChange() {
    this.emitSelectedRows(SkyGridSelectedRowsSource.CheckboxChange);
  }

  public updateColumnHeading(change: SkyGridColumnHeadingModelChange) {
    const foundColumnModel = this.columns.find((column: SkyGridColumnModel) => {
      return (
        (change.id !== undefined && change.id === column.id) ||
        (change.field !== undefined && change.field === column.field)
      );
    });

    /* istanbul ignore else */
    if (foundColumnModel) {
      foundColumnModel.heading = change.value;
      this.changeDetector.markForCheck();
    }
  }

  public updateInlineHelpPopover(
    change: SkyGridColumnInlineHelpPopoverModelChange
  ) {
    const foundColumnModel = this.columns.find((column: SkyGridColumnModel) => {
      return (
        (change.id !== undefined && change.id === column.id) ||
        (change.field !== undefined && change.field === column.field)
      );
    });

    /* istanbul ignore else */
    if (foundColumnModel) {
      foundColumnModel.inlineHelpPopover = change.value;
      this.changeDetector.markForCheck();
    }
  }

  public updateColumnDescription(change: SkyGridColumnDescriptionModelChange) {
    const foundColumnModel = this.columns.find((column: SkyGridColumnModel) => {
      return (
        (change.id !== undefined && change.id === column.id) ||
        (change.field !== undefined && change.field === column.field)
      );
    });

    /* istanbul ignore else */
    if (foundColumnModel) {
      foundColumnModel.description = change.value;
      this.changeDetector.markForCheck();
    }
  }

  public onResizeColumnStart(event: MouseEvent): void {
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
    this.changeDetector.detectChanges();
    this.setResizeBarPosition(event.pageX);

    event.preventDefault();
    event.stopPropagation();

    const mouseMoveEvent = fromEvent(document, 'mousemove');
    const touchMoveEvent = fromEvent(document, 'touchmove');

    merge(mouseMoveEvent, touchMoveEvent)
      .pipe(
        takeWhile(() => {
          return this.isDraggingResizeHandle;
        })
      )
      .subscribe((moveEvent: any) => {
        this.onResizeHandleMove(moveEvent);
      });

    const mouseUpEvent = fromEvent(document, 'mouseup');
    const touchEndEvent = fromEvent(document, 'touchend');

    merge(mouseUpEvent, touchEndEvent)
      .pipe(
        takeWhile(() => {
          return this.isDraggingResizeHandle;
        })
      )
      .subscribe((endEvent: any) => {
        this.onResizeHandleRelease(endEvent);
      });
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
    const newValue = Number(input.value);
    const deltaX = newValue - this.startColumnWidth;
    this.resizeColumnByIndex(this.activeResizeColumnIndex, newValue, deltaX);
    const left = input.getBoundingClientRect().left;
    this.setResizeBarPosition(left);
  }

  public onResizeHandleMove(event: MouseEvent) {
    const deltaX = event.pageX - this.xPosStart;
    const newColWidth = this.startColumnWidth + deltaX;

    if (newColWidth <= this.minColWidth) {
      event.stopPropagation();
      return;
    }

    const max = this.getMaxRangeByIndex(this.activeResizeColumnIndex);
    if (this.fit === 'width' && newColWidth > max) {
      event.stopPropagation();
      return;
    }

    this.setResizeBarPosition(event.pageX);
  }

  public onResizeHandleBlur(event: Event) {
    this.showResizeBar = false;
  }

  public onResizeHandleFocus(event: KeyboardEvent) {
    this.showResizeBar = true;
    this.changeDetector.detectChanges();

    const target = event.target as HTMLElement;
    const left = target.getBoundingClientRect().left;
    this.setResizeBarPosition(left);
  }

  public onResizeHandleRelease(event: MouseEvent) {
    this.showResizeBar = false;
    const deltaX = event.pageX - this.xPosStart;
    const newColWidth = this.startColumnWidth + deltaX;
    this.resizeColumnByIndex(this.activeResizeColumnIndex, newColWidth, deltaX);
    this.isDraggingResizeHandle = false;
    this.activeResizeColumnIndex = undefined;

    event.stopPropagation();
    this.changeDetector.markForCheck();
  }

  public onRowClick(event: any, selectedItem: ListItemModel) {
    /* istanbul ignore else */
    if (this.enableMultiselect) {
      if (
        event.target === event.currentTarget ||
        !this.isInteractiveElement(event)
      ) {
        selectedItem.isSelected = !selectedItem.isSelected;
        this.changeDetector.markForCheck();
        this.emitSelectedRows(SkyGridSelectedRowsSource.RowClick);
      }
    }
  }

  public isRowHighlighted(id: string): boolean {
    if (this.rowHighlightedId) {
      return id === this.rowHighlightedId;
    }
    return false;
  }

  public getRowHeight(index: number): string {
    return this.gridAdapter.getRowHeight(this.tableElementRef, index);
  }

  public cancelRowDelete(id: string) {
    this.rowDeleteConfigs = this.rowDeleteConfigs.filter(
      (config) => config.id !== id
    );
    this.rowDeleteCancel.emit({ id: id });

    this.destroyRowDelete(id);
  }

  public confirmRowDelete(id: string) {
    this.rowDeleteConfigs.find((config) => config.id === id).pending = true;
    this.rowDeleteConfirm.emit({ id: id });
  }

  public getRowDeleteItem(id: string): SkyGridRowDeleteConfig {
    return this.rowDeleteConfigs.find((rowDelete) => rowDelete.id === id);
  }

  // Prevent touch devices from inadvertently scrolling grid while dragging columns.
  public onTouchMove(event: any): void {
    event.preventDefault();
  }

  public onTopScroll(event: any): void {
    /* sanity check */
    /* istanbul ignore else */
    if (this.tableContainerElementRef) {
      if (this.scrollTriggered) {
        this.scrollTriggered = false;
        this.tableContainerElementRef.nativeElement.scrollLeft =
          this.topScrollContainerElementRef.nativeElement.scrollLeft;
      } else {
        this.scrollTriggered = true;
      }
    }
  }

  public onGridScroll(event: any): void {
    /* sanity check */
    /* istanbul ignore else */
    if (this.topScrollContainerElementRef) {
      if (this.scrollTriggered) {
        this.scrollTriggered = false;
        this.topScrollContainerElementRef.nativeElement.scrollLeft =
          this.tableContainerElementRef.nativeElement.scrollLeft;
      } else {
        this.scrollTriggered = true;
      }
    }
  }

  private checkUserColumnWidthsForScroll(): void {
    if (
      !this.showTopScroll &&
      this.columnElementRefs &&
      this.columnElementRefs.length > 0
    ) {
      let columnsWidthTotal = 0;
      const windowSize = this.skyWindow.nativeWindow.innerWidth;
      this.columnElementRefs.forEach((col) => {
        if (!this.showTopScroll) {
          const computedWidth = parseFloat(
            window.getComputedStyle(col.nativeElement).width
          );
          const offsetWidth = col.nativeElement.offsetWidth;
          const width = Math.max(
            computedWidth || offsetWidth,
            this.minColWidth
          );
          columnsWidthTotal = columnsWidthTotal + width;
          if (columnsWidthTotal > windowSize) {
            this.showTopScroll = true;
            setTimeout(() => {
              this.changeDetector.markForCheck();
            });
          }
        }
      });
    }
  }

  private multiselectSelectAll() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].isSelected = true;
    }
    this.changeDetector.markForCheck();
    this.emitSelectedRows(SkyGridSelectedRowsSource.SelectAll);
  }

  private multiselectClearAll() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].isSelected = false;
    }
    this.changeDetector.markForCheck();
    this.emitSelectedRows(SkyGridSelectedRowsSource.ClearAll);
  }

  private handleIncomingMessages(message: SkyGridMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkyGridMessageType.SelectAll:
        this.multiselectSelectAll();
        break;

      case SkyGridMessageType.ClearAll:
        this.multiselectClearAll();
        break;
      case SkyGridMessageType.PromptDeleteRow:
        /* sanity check */
        /* istanbul ignore else */
        if (message.data && message.data.promptDeleteRow) {
          const existingConfig = this.rowDeleteConfigs.find(
            (config) => config.id === message.data.promptDeleteRow.id
          );
          if (existingConfig) {
            existingConfig.pending = false;
          } else {
            this.rowDeleteConfigs.push({
              id: message.data.promptDeleteRow.id,
              pending: false,
            });
            const overlay = this.overlayService.create({
              enableScroll: true,
              showBackdrop: false,
              closeOnNavigation: true,
              enableClose: false,
              enablePointerEvents: true,
            });

            overlay.attachTemplate(this.inlineDeleteTemplateRef, {
              $implicit: this.data.find(
                (item) => item.id === message.data.promptDeleteRow.id
              ),
            });

            /**
             * We are manually setting the z-index here because overlays will always be on top of
             * the omnibar. This manual setting is 1 less than the omnibar's z-index of 1000. We
             * discussed changing the overlay service to allow for this but decided against that
             * change at this time due to its niche nature.
             */
            overlay.componentRef.instance.zIndex = '999';

            setTimeout(() => {
              const inlineDeleteRef = this.inlineDeleteRefs
                .toArray()
                .find((elRef) => {
                  return (
                    elRef.nativeElement.id ===
                    'row-delete-ref-' + message.data.promptDeleteRow.id
                  );
                });
              const affixer = this.affixService.createAffixer(inlineDeleteRef);

              const rowElement: HTMLElement =
                this.tableElementRef.nativeElement.querySelector(
                  '[sky-cmp-id="' + message.data.promptDeleteRow.id + '"]'
                );

              affixer.affixTo(rowElement, {
                autoFitContext: SkyAffixAutoFitContext.Viewport,
                isSticky: true,
                placement: 'above',
                verticalAlignment: 'top',
                horizontalAlignment: 'left',
                enableAutoFit: false,
              });

              this.rowDeleteContents[message.data.promptDeleteRow.id] = {
                affixer: affixer,
                overlay: overlay,
              };
            });
          }
        }
        break;
      case SkyGridMessageType.AbortDeleteRow:
        /* sanity check */
        /* istanbul ignore else */
        if (message.data && message.data.abortDeleteRow) {
          this.rowDeleteConfigs = this.rowDeleteConfigs.filter(
            (config) => config.id !== message.data.abortDeleteRow.id
          );

          this.destroyRowDelete(message.data.abortDeleteRow.id);
        }
        break;
    }
    this.changeDetector.markForCheck();
  }

  private onHeaderDrop(newColumnIds: Array<string>) {
    // update selected columnIds
    this.selectedColumnIdsSet = true;
    this.selectedColumnIds = newColumnIds;

    // mark for check because we are using ChangeDetectionStrategy.onPush
    this.changeDetector.markForCheck();
  }

  private setDisplayedColumns(respectHidden: boolean = false) {
    /* sanity check */
    /* istanbul ignore else */
    if (this.columns) {
      if (this.selectedColumnIds !== undefined) {
        // setup displayed columns
        this.displayedColumns = this.selectedColumnIds
          .filter((columnId) => {
            return this.columns.find((column) => column.id === columnId);
          })
          .map((columnId) => {
            return this.columns.filter((column) => column.id === columnId)[0];
          });
      } else if (respectHidden) {
        this.displayedColumns = this.columns.filter((column) => {
          return !column.hidden;
        });
      } else {
        this.displayedColumns = this.columns;
      }
    }
  }

  private transformData() {
    // Transform data into object with id and data properties
    if (
      this.data &&
      this.data.length > 0 &&
      this.data[0].id &&
      !this.data[0].data
    ) {
      if (this.multiselectRowId) {
        this.items = this.getGridDataWithSelectedRows();
      } else {
        this.items = this.data.map((item) => new ListItemModel(item.id, item));
      }
    } else {
      this.items = this.data;
    }
  }

  private getGridDataWithSelectedRows() {
    const selectedRows = this.getSelectedRows();
    return this.data.map((item) => {
      let checked;
      if (Object.prototype.hasOwnProperty.call(item, this.multiselectRowId)) {
        checked = selectedRows.indexOf(item[this.multiselectRowId]) > -1;
      } else {
        checked = selectedRows.indexOf(item.id) > -1;
      }
      return new ListItemModel(item.id, item, checked);
    });
  }

  private applySelectedRows(): void {
    if (this.items && this.items.length > 0 && this.selectedRowIds) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].isSelected =
          this.selectedRowIds.indexOf(this.items[i].id) > -1;
      }
      this.changeDetector.markForCheck();
    }
  }

  private setSortHeaders() {
    this.currentSortField.next(
      this.sortField || { fieldSelector: '', descending: false }
    );
  }

  private getColumnsFromComponent() {
    this.columns = this.columnComponents.map((columnComponent) => {
      return new SkyGridColumnModel(columnComponent.template, columnComponent);
    });
  }

  private updateColumns() {
    this.getColumnsFromComponent();

    // This set timeout is necessary to ensure the columns have rendered in the grid
    setTimeout(() => {
      this.checkUserColumnWidthsForScroll();
    });
  }

  private resizeColumnByIndex(
    columnIndex: string,
    newColWidth: number,
    deltaX: number
  ) {
    const column = this.getColumnModelByIndex(columnIndex);

    // Prevent accidental shrinkage below minimum width.
    if (newColWidth <= this.minColWidth) {
      deltaX = deltaX + this.minColWidth - newColWidth;
      newColWidth = this.minColWidth;
    }

    // fit=width adds/removes width from the last column
    // fit=scroll adds/removes width from the table
    if (this.fit === 'width') {
      const lastColumn = this.getLastDisplayedColumn();

      // Prevent accidental growth that would bump last column off screen.
      const max = this.getMaxRangeByIndex(columnIndex);
      if (newColWidth > max) {
        newColWidth = max;
        deltaX = max - this.startColumnWidth;
      }
      column.width = newColWidth;
      lastColumn.width = lastColumn.width - deltaX;
      this.updateMaxRange();
    } else {
      this.gridAdapter.setStyle(
        this.tableElementRef,
        'width',
        `${this.tableWidth + deltaX}px`
      );
      column.width = newColWidth;
    }

    this.changeDetector.detectChanges();
    this.columnWidthChange.emit(this.getColumnWidthModelChange());
  }

  private initColumnWidths() {
    // Establish table width.
    this.showTopScroll = true;

    // Set column widths based on the width initially given by the browser.
    // computedWidth prevents accidental overflow for browsers with sub-pixel widths.
    this.columnElementRefs.forEach((col, index) => {
      const computedWidth = parseFloat(
        window.getComputedStyle(col.nativeElement).width
      );
      const offsetWidth = col.nativeElement.offsetWidth;
      /* istanbul ignore next */
      this.getColumnModelByIndex(index).width = Math.max(
        computedWidth || offsetWidth,
        this.minColWidth
      );
    });

    // 'scroll' tables should be allowed to expand outside of their constraints.
    if (this.fit === 'scroll') {
      this.gridAdapter.setStyle(this.tableElementRef, 'min-width', 'auto');
    }

    // Update max limits for input ranges.
    if (this.fit === 'width') {
      this.updateMaxRange();
    }

    this.changeDetector.detectChanges();
  }

  private transferColumnWidths(
    oldColumns: SkyGridColumnModel[],
    newColumns: SkyGridColumnModel[]
  ) {
    /* sanity check */
    /* istanbul ignore else */
    if (oldColumns && newColumns) {
      for (const oldColumn of oldColumns) {
        if (oldColumn.width) {
          const matchingColumn = newColumns.find(
            (newColumn) => oldColumn.id === newColumn.id
          );
          if (matchingColumn && !matchingColumn.width) {
            matchingColumn.width = oldColumn.width;
          }
        }
      }
    }
    this.changeDetector.markForCheck();
  }

  private getColumnWidthModelChange() {
    const columnWidthModelChange = new Array<SkyGridColumnWidthModelChange>();
    this.columns.forEach((column) => {
      columnWidthModelChange.push({
        id: column.id,
        field: column.field,
        width: column.width,
      });
    });
    return columnWidthModelChange;
  }

  private updateMaxRange() {
    const leftoverWidth =
      this.getLastDisplayedColumn().width - this.minColWidth;
    this.displayedColumns.forEach((column, index) => {
      const newMaxRange = column.width + leftoverWidth;
      const rangeInput = this.getRangeInputByIndex(index);
      rangeInput.nativeElement.max = newMaxRange;
      rangeInput.nativeElement.setAttribute('aria-valuemax', newMaxRange);
    });
  }

  private initializeResizeColumn(event: any) {
    const clickTarget = event.target as HTMLElement;
    this.activeResizeColumnIndex = clickTarget.getAttribute('sky-cmp-index');
    const column = this.getColumnModelByIndex(this.activeResizeColumnIndex);
    this.startColumnWidth = column.width;
  }

  private resetTableWidth() {
    this.skyWindow.nativeWindow.setTimeout(() => {
      this.gridAdapter.setStyle(this.tableElementRef, 'width', `auto`);
      this.changeDetector.detectChanges();
      this.gridAdapter.setStyle(
        this.tableElementRef,
        'width',
        `${this.tableWidth}px`
      );
      this.changeDetector.detectChanges();
    });
  }

  private getRangeInputByIndex(index: string | number) {
    return this.columnRangeInputElementRefs.find(
      (input) =>
        input.nativeElement.getAttribute('sky-cmp-index') === index.toString()
    );
  }

  private getColumnModelByIndex(index: string | number) {
    return this.displayedColumns[Number(index)];
  }

  private getMaxRangeByIndex(index: string) {
    const columnElementRef = this.columnElementRefs.find(
      (th) => th.nativeElement.getAttribute('sky-cmp-index') === index
    );
    const rangeInput = columnElementRef.nativeElement.querySelector(
      '.sky-grid-column-input-aria-only'
    );
    return Number(rangeInput.max);
  }

  private getLastDisplayedColumn() {
    return this.getColumnModelByIndex(this.displayedColumns.length - 1);
  }

  private addDelimeter(text: string[], delimiter: string) {
    return text.filter((val) => val).join(delimiter);
  }

  private destroyRowDelete(id: string) {
    const rowDeleteContents = this.rowDeleteContents[id];
    /* istanbul ignore else */
    if (rowDeleteContents) {
      rowDeleteContents.affixer.destroy();
      this.overlayService.close(rowDeleteContents.overlay);
      delete this.rowDeleteContents[id];
    }
  }

  private emitSelectedRows(source: SkyGridSelectedRowsSource) {
    const selectedRows: SkyGridSelectedRowsModelChange = {
      selectedRowIds: this.getSelectedRows(),
      source: source,
    };
    this.multiselectSelectionChange.emit(selectedRows);
  }

  private getSelectedRows() {
    return this.items
      .filter((item) => {
        return item.isSelected;
      })
      .map((item) => {
        if (
          Object.prototype.hasOwnProperty.call(item.data, this.multiselectRowId)
        ) {
          return item.data[this.multiselectRowId];
        }
        return item.id;
      });
  }

  private isInteractiveElement(event: any): any {
    const interactiveElSelectors = `
      a,
      button,
      input,
      label,
      option,
      select,
      textarea,
      details,
      dialog,
      menu,
      menuitem,
      summary`;
    return event.target.closest(interactiveElSelectors);
  }

  private setResizeBarPosition(xPosition: number): void {
    const parentScroll = this.tableContainerElementRef.nativeElement.scrollLeft;
    const resizeBarX =
      xPosition -
      this.tableElementRef.nativeElement.getBoundingClientRect().left -
      parentScroll;
    this.gridAdapter.setStyle(this.resizeBar, 'left', resizeBarX + 'px');
  }

  private applyUserConfig(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.uiConfigService
        .getConfig(this.settingsKey)
        .pipe(take(1))
        .subscribe(
          (config: SkyGridUIConfig) => {
            /* istanbul ignore else */
            if (config && config.selectedColumnIds) {
              // Remove any columnIds that don't exist in the current data set.
              this.selectedColumnIds = config.selectedColumnIds.filter((id) =>
                this.columns.find((column) => column.id === id)
              );
              this.changeDetector.markForCheck();
            }

            resolve();
          },
          () => {
            resolve();
          }
        );
    });
  }

  private setUserConfig(config: SkyGridUIConfig): void {
    if (!this.settingsKey) {
      return;
    }

    this.uiConfigService
      .setConfig(this.settingsKey, config)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        (err) => {
          console.warn('Could not save grid settings.');
          console.warn(err);
        }
      );
  }

  private initColumns(): void {
    /* istanbul ignore else */
    if (this.columnComponents.length !== 0 || this.columns !== undefined) {
      /* istanbul ignore else */
      /* sanity check */
      if (this.columnComponents.length > 0) {
        this.getColumnsFromComponent();
      }

      this.transformData();
      this.setDisplayedColumns(true);
      this.changeDetector.markForCheck();
    }

    // Watch for added/removed columns:
    this.subscriptions.push(
      this.columnComponents.changes.subscribe(() => this.updateColumns())
    );

    // Watch for column heading changes:
    this.columnComponents.forEach((comp: SkyGridColumnComponent) => {
      this.subscriptions.push(
        comp.headingModelChanges.subscribe(
          (change: SkyGridColumnHeadingModelChange) => {
            this.updateColumnHeading(change);
          }
        )
      );
      this.subscriptions.push(
        comp.descriptionModelChanges.subscribe(
          (change: SkyGridColumnDescriptionModelChange) => {
            this.updateColumnDescription(change);
          }
        )
      );
      this.subscriptions.push(
        comp.inlineHelpPopoverModelChanges.subscribe(
          (change: SkyGridColumnInlineHelpPopoverModelChange) => {
            this.updateInlineHelpPopover(change);
          }
        )
      );
    });
  }

  private arraysEqual(arrayA: any[], arrayB: any[]): boolean {
    return (
      arrayA.length === arrayB.length &&
      arrayA.every((value, index) => value === arrayB[index])
    );
  }
}
