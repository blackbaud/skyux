import { Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, isImported } from '@schematics/angular/utility/ast-utils';

import { removeImport } from '../../../../utility/typescript/remove-import';

const EVENT_NAMES: Record<string, string> = {
  EVENT_COLUMN_EVERYTHING_CHANGED: 'columnEverythingChanged',
  EVENT_NEW_COLUMNS_LOADED: 'newColumnsLoaded',
  EVENT_COLUMN_PIVOT_MODE_CHANGED: 'columnPivotModeChanged',
  EVENT_PIVOT_MAX_COLUMNS_EXCEEDED: 'pivotMaxColumnsExceeded',
  EVENT_COLUMN_ROW_GROUP_CHANGED: 'columnRowGroupChanged',
  EVENT_EXPAND_COLLAPSE_ALL: 'expandOrCollapseAll',
  EVENT_COLUMN_PIVOT_CHANGED: 'columnPivotChanged',
  EVENT_GRID_COLUMNS_CHANGED: 'gridColumnsChanged',
  EVENT_COLUMN_VALUE_CHANGED: 'columnValueChanged',
  EVENT_COLUMN_MOVED: 'columnMoved',
  EVENT_COLUMN_VISIBLE: 'columnVisible',
  EVENT_COLUMN_PINNED: 'columnPinned',
  EVENT_COLUMN_GROUP_OPENED: 'columnGroupOpened',
  EVENT_COLUMN_RESIZED: 'columnResized',
  EVENT_DISPLAYED_COLUMNS_CHANGED: 'displayedColumnsChanged',
  EVENT_SUPPRESS_COLUMN_MOVE_CHANGED: 'suppressMovableColumns',
  EVENT_SUPPRESS_MENU_HIDE_CHANGED: 'suppressMenuHide',
  EVENT_SUPPRESS_FIELD_DOT_NOTATION: 'suppressFieldDotNotation',
  EVENT_VIRTUAL_COLUMNS_CHANGED: 'virtualColumnsChanged',
  EVENT_COLUMN_HEADER_MOUSE_OVER: 'columnHeaderMouseOver',
  EVENT_COLUMN_HEADER_MOUSE_LEAVE: 'columnHeaderMouseLeave',
  EVENT_COLUMN_HEADER_CLICKED: 'columnHeaderClicked',
  EVENT_COLUMN_HEADER_CONTEXT_MENU: 'columnHeaderContextMenu',
  EVENT_ASYNC_TRANSACTIONS_FLUSHED: 'asyncTransactionsFlushed',
  EVENT_ROW_GROUP_OPENED: 'rowGroupOpened',
  EVENT_ROW_DATA_UPDATED: 'rowDataUpdated',
  EVENT_PINNED_ROW_DATA_CHANGED: 'pinnedRowDataChanged',
  EVENT_RANGE_SELECTION_CHANGED: 'rangeSelectionChanged',
  EVENT_CHART_CREATED: 'chartCreated',
  EVENT_CHART_RANGE_SELECTION_CHANGED: 'chartRangeSelectionChanged',
  EVENT_CHART_OPTIONS_CHANGED: 'chartOptionsChanged',
  EVENT_CHART_DESTROYED: 'chartDestroyed',
  EVENT_TOOL_PANEL_VISIBLE_CHANGED: 'toolPanelVisibleChanged',
  EVENT_TOOL_PANEL_SIZE_CHANGED: 'toolPanelSizeChanged',
  EVENT_COLUMN_PANEL_ITEM_DRAG_START: 'columnPanelItemDragStart',
  EVENT_COLUMN_PANEL_ITEM_DRAG_END: 'columnPanelItemDragEnd',
  EVENT_MODEL_UPDATED: 'modelUpdated',
  EVENT_CUT_START: 'cutStart',
  EVENT_CUT_END: 'cutEnd',
  EVENT_PASTE_START: 'pasteStart',
  EVENT_PASTE_END: 'pasteEnd',
  EVENT_FILL_START: 'fillStart',
  EVENT_FILL_END: 'fillEnd',
  EVENT_RANGE_DELETE_START: 'rangeDeleteStart',
  EVENT_RANGE_DELETE_END: 'rangeDeleteEnd',
  EVENT_UNDO_STARTED: 'undoStarted',
  EVENT_UNDO_ENDED: 'undoEnded',
  EVENT_REDO_STARTED: 'redoStarted',
  EVENT_REDO_ENDED: 'redoEnded',
  EVENT_KEY_SHORTCUT_CHANGED_CELL_START: 'keyShortcutChangedCellStart',
  EVENT_KEY_SHORTCUT_CHANGED_CELL_END: 'keyShortcutChangedCellEnd',
  EVENT_CELL_CLICKED: 'cellClicked',
  EVENT_CELL_DOUBLE_CLICKED: 'cellDoubleClicked',
  EVENT_CELL_MOUSE_DOWN: 'cellMouseDown',
  EVENT_CELL_CONTEXT_MENU: 'cellContextMenu',
  EVENT_CELL_VALUE_CHANGED: 'cellValueChanged',
  EVENT_CELL_EDIT_REQUEST: 'cellEditRequest',
  EVENT_ROW_VALUE_CHANGED: 'rowValueChanged',
  EVENT_CELL_FOCUSED: 'cellFocused',
  EVENT_CELL_FOCUS_CLEARED: 'cellFocusCleared',
  EVENT_FULL_WIDTH_ROW_FOCUSED: 'fullWidthRowFocused',
  EVENT_ROW_SELECTED: 'rowSelected',
  EVENT_SELECTION_CHANGED: 'selectionChanged',
  EVENT_TOOLTIP_SHOW: 'tooltipShow',
  EVENT_TOOLTIP_HIDE: 'tooltipHide',
  EVENT_CELL_KEY_DOWN: 'cellKeyDown',
  EVENT_CELL_MOUSE_OVER: 'cellMouseOver',
  EVENT_CELL_MOUSE_OUT: 'cellMouseOut',
  EVENT_FILTER_CHANGED: 'filterChanged',
  EVENT_FILTER_MODIFIED: 'filterModified',
  EVENT_FILTER_OPENED: 'filterOpened',
  EVENT_ADVANCED_FILTER_BUILDER_VISIBLE_CHANGED:
    'advancedFilterBuilderVisibleChanged',
  EVENT_SORT_CHANGED: 'sortChanged',
  EVENT_VIRTUAL_ROW_REMOVED: 'virtualRowRemoved',
  EVENT_ROW_CLICKED: 'rowClicked',
  EVENT_ROW_DOUBLE_CLICKED: 'rowDoubleClicked',
  EVENT_GRID_READY: 'gridReady',
  EVENT_GRID_PRE_DESTROYED: 'gridPreDestroyed',
  EVENT_GRID_SIZE_CHANGED: 'gridSizeChanged',
  EVENT_VIEWPORT_CHANGED: 'viewportChanged',
  EVENT_SCROLLBAR_WIDTH_CHANGED: 'scrollbarWidthChanged',
  EVENT_FIRST_DATA_RENDERED: 'firstDataRendered',
  EVENT_DRAG_STARTED: 'dragStarted',
  EVENT_DRAG_STOPPED: 'dragStopped',
  EVENT_CHECKBOX_CHANGED: 'checkboxChanged',
  EVENT_ROW_EDITING_STARTED: 'rowEditingStarted',
  EVENT_ROW_EDITING_STOPPED: 'rowEditingStopped',
  EVENT_CELL_EDITING_STARTED: 'cellEditingStarted',
  EVENT_CELL_EDITING_STOPPED: 'cellEditingStopped',
  EVENT_BODY_SCROLL: 'bodyScroll',
  EVENT_BODY_SCROLL_END: 'bodyScrollEnd',
  EVENT_HEIGHT_SCALE_CHANGED: 'heightScaleChanged',
  EVENT_PAGINATION_CHANGED: 'paginationChanged',
  EVENT_COMPONENT_STATE_CHANGED: 'componentStateChanged',
  EVENT_STORE_REFRESHED: 'storeRefreshed',
  EVENT_STATE_UPDATED: 'stateUpdated',
  EVENT_COLUMN_MENU_VISIBLE_CHANGED: 'columnMenuVisibleChanged',
  EVENT_CONTEXT_MENU_VISIBLE_CHANGED: 'contextMenuVisibleChanged',
  EVENT_BODY_HEIGHT_CHANGED: 'bodyHeightChanged',
  EVENT_COLUMN_CONTAINER_WIDTH_CHANGED: 'columnContainerWidthChanged',
  EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED: 'displayedColumnsWidthChanged',
  EVENT_SCROLL_VISIBILITY_CHANGED: 'scrollVisibilityChanged',
  EVENT_COLUMN_HOVER_CHANGED: 'columnHoverChanged',
  EVENT_FLASH_CELLS: 'flashCells',
  EVENT_PAGINATION_PIXEL_OFFSET_CHANGED: 'paginationPixelOffsetChanged',
  EVENT_DISPLAYED_ROWS_CHANGED: 'displayedRowsChanged',
  EVENT_LEFT_PINNED_WIDTH_CHANGED: 'leftPinnedWidthChanged',
  EVENT_RIGHT_PINNED_WIDTH_CHANGED: 'rightPinnedWidthChanged',
  EVENT_ROW_CONTAINER_HEIGHT_CHANGED: 'rowContainerHeightChanged',
  EVENT_HEADER_HEIGHT_CHANGED: 'headerHeightChanged',
  EVENT_COLUMN_HEADER_HEIGHT_CHANGED: 'columnHeaderHeightChanged',
  EVENT_ROW_DRAG_ENTER: 'rowDragEnter',
  EVENT_ROW_DRAG_MOVE: 'rowDragMove',
  EVENT_ROW_DRAG_LEAVE: 'rowDragLeave',
  EVENT_ROW_DRAG_END: 'rowDragEnd',
  EVENT_GRID_STYLES_CHANGED: 'gridStylesChanged',
  EVENT_COLUMN_ROW_GROUP_CHANGE_REQUEST: 'columnRowGroupChangeRequest',
  EVENT_COLUMN_PIVOT_CHANGE_REQUEST: 'columnPivotChangeRequest',
  EVENT_COLUMN_VALUE_CHANGE_REQUEST: 'columnValueChangeRequest',
  EVENT_COLUMN_AGG_FUNC_CHANGE_REQUEST: 'columnAggFuncChangeRequest',
  EVENT_STORE_UPDATED: 'storeUpdated',
  EVENT_FILTER_DESTROYED: 'filterDestroyed',
  EVENT_ROW_DATA_UPDATE_STARTED: 'rowDataUpdateStarted',
  EVENT_ROW_COUNT_READY: 'rowCountReady',
  EVENT_ADVANCED_FILTER_ENABLED_CHANGED: 'advancedFilterEnabledChanged',
  EVENT_DATA_TYPES_INFERRED: 'dataTypesInferred',
  EVENT_FIELD_VALUE_CHANGED: 'fieldValueChanged',
  EVENT_FIELD_PICKER_VALUE_SELECTED: 'fieldPickerValueSelected',
  EVENT_SIDE_BAR_UPDATED: 'sideBarUpdated',
};

const ROW_NODE_EVENTS: Record<string, string> = {
  EVENT_ALL_CHILDREN_COUNT_CHANGED: 'allChildrenCountChanged',
  EVENT_CELL_CHANGED: 'cellChanged',
  EVENT_CHILD_INDEX_CHANGED: 'childIndexChanged',
  EVENT_DATA_CHANGED: 'dataChanged',
  EVENT_DISPLAYED_CHANGED: 'displayedChanged',
  EVENT_DRAGGING_CHANGED: 'draggingChanged',
  EVENT_EXPANDED_CHANGED: 'expandedChanged',
  EVENT_FIRST_CHILD_CHANGED: 'firstChildChanged',
  EVENT_GROUP_CHANGED: 'groupChanged',
  EVENT_HAS_CHILDREN_CHANGED: 'hasChildrenChanged',
  EVENT_HEIGHT_CHANGED: 'heightChanged',
  EVENT_HIGHLIGHT_CHANGED: 'rowHighlightChanged',
  EVENT_LAST_CHILD_CHANGED: 'lastChildChanged',
  EVENT_MASTER_CHANGED: 'masterChanged',
  EVENT_MOUSE_ENTER: 'mouseEnter',
  EVENT_MOUSE_LEAVE: 'mouseLeave',
  EVENT_ROW_INDEX_CHANGED: 'rowIndexChanged',
  EVENT_ROW_SELECTED: 'rowSelected',
  EVENT_SELECTABLE_CHANGED: 'selectableChanged',
  EVENT_TOP_CHANGED: 'topChanged',
  EVENT_UI_LEVEL_CHANGED: 'uiLevelChanged',
};

export function eventTypeStrings(tree: Tree, path: string): void {
  const recorder = tree.beginUpdate(path);
  const content = tree.readText(path);
  const sourceFile = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  [
    { classifiedName: 'Events', eventProperties: EVENT_NAMES },
    { classifiedName: 'RowNode', eventProperties: ROW_NODE_EVENTS },
  ].forEach(({ classifiedName, eventProperties }) => {
    if (isImported(sourceFile, classifiedName, 'ag-grid-community')) {
      const eventReferences = findNodes<ts.PropertyAccessExpression>(
        sourceFile,
        ts.isPropertyAccessExpression,
        undefined,
        true,
      ).filter(
        (node) =>
          node.expression.getText() === classifiedName &&
          node.name.text in eventProperties,
      );
      for (const eventReference of eventReferences) {
        const eventName = eventReference.name
          .text as keyof typeof eventProperties;
        recorder.remove(eventReference.getStart(), eventReference.getWidth());
        recorder.insertRight(
          eventReference.getStart(),
          `'${eventProperties[eventName]}'`,
        );
      }
    }
  });
  const stringReplace: Record<string, string> = {
    "addEventListener('rowDataChanged'": `addEventListener('rowDataUpdated'`,
  };
  Object.entries(stringReplace).forEach(([oldString, newString]) => {
    const oldStringIndex = content.indexOf(oldString);
    if (oldStringIndex !== -1) {
      recorder.remove(oldStringIndex, oldString.length);
      recorder.insertLeft(oldStringIndex, newString);
    }
  });
  tree.commitUpdate(recorder);
  removeImport(tree, path, sourceFile, {
    classNames: ['Events'],
    moduleName: 'ag-grid-community',
  });
}
