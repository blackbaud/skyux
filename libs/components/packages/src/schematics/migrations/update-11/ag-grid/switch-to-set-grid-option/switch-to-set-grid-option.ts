import { Tree } from '@angular-devkit/schematics';

export function switchToSetGridOption(tree: Tree, path: string): void {
  const content = tree.readText(path);
  const recorder = tree.beginUpdate(path);

  const translateMethodToOption: Record<string, string> = {
    paginationSetPageSize: 'paginationPageSize',
    setAdvancedFilterBuilderParams: 'advancedFilterBuilderParams',
    setAdvancedFilterParent: 'advancedFilterParent',
    setAlwaysShowHorizontalScroll: 'alwaysShowHorizontalScroll',
    setAlwaysShowVerticalScroll: 'alwaysShowVerticalScroll',
    setAnimateRows: 'animateRows',
    setAutoGroupColumnDef: 'autoGroupColumnDef',
    setCacheBlockSize: 'cacheBlockSize',
    setColumnDefs: 'columnDefs',
    setColumnTypes: 'columnTypes',
    setDatasource: 'datasource',
    setDataTypeDefinitions: 'dataTypeDefinitions',
    setDefaultColDef: 'defaultColDef',
    setDeltaSort: 'deltaSort',
    setDoesExternalFilterPass: 'doesExternalFilterPass',
    setDomLayout: 'domLayout',
    setEnableAdvancedFilter: 'enableAdvancedFilter',
    setEnableCellTextSelection: 'enableCellTextSelection',
    setFillHandleDirection: 'fillHandleDirection',
    setFloatingFiltersHeight: 'floatingFiltersHeight',
    setFunctionsReadOnly: 'functionsReadOnly',
    setGetBusinessKeyForNode: 'getBusinessKeyForNode',
    setGetChartToolbarItems: 'getChartToolbarItems',
    setGetChildCount: 'getChildCount',
    setGetContextMenuItems: 'getContextMenuItems',
    setGetDocument: 'getDocument',
    setGetGroupRowAgg: 'getGroupRowAgg',
    setGetMainMenuItems: 'getMainMenuItems',
    setGetRowClass: 'getRowClass',
    setGetRowHeight: 'getRowHeight',
    setGetRowId: 'getRowId',
    setGetRowStyle: 'getRowStyle',
    setGetServerSideGroupKey: 'getServerSideGroupKey',
    setGetServerSideGroupLevelParams: 'getServerSideGroupLevelParams',
    setGroupDisplayType: 'groupDisplayType',
    setGroupHeaderHeight: 'groupHeaderHeight',
    setGroupIncludeFooter: 'groupIncludeFooter',
    setGroupIncludeTotalFooter: 'groupIncludeTotalFooter',
    setGroupRemoveLowestSingleChildren: 'groupRemoveLowestSingleChildren',
    setGroupRemoveSingleChildren: 'groupRemoveSingleChildren',
    setHeaderHeight: 'headerHeight',
    setIncludeHiddenColumnsInAdvancedFilter:
      'includeHiddenColumnsInAdvancedFilter',
    setIncludeHiddenColumnsInQuickFilter: 'includeHiddenColumnsInQuickFilter',
    setInitialGroupOrderComparator: 'initialGroupOrderComparator',
    setIsApplyServerSideTransaction: 'isApplyServerSideTransaction',
    setIsExternalFilterPresent: 'isExternalFilterPresent',
    setIsFullWidthRow: 'isFullWidthRow',
    setIsRowMaster: 'isRowMaster',
    setIsRowSelectable: 'isRowSelectable',
    setIsServerSideGroup: 'isServerSideGroup',
    setIsServerSideGroupOpenByDefault: 'isServerSideGroupOpenByDefault',
    setNavigateToNextCell: 'navigateToNextCell',
    setNavigateToNextHeader: 'navigateToNextHeader',
    setPagination: 'pagination',
    setPaginationNumberFormatter: 'paginationNumberFormatter',
    setPinnedBottomRowData: 'pinnedBottomRowData',
    setPinnedTopRowData: 'pinnedTopRowData',
    setPivotGroupHeaderHeight: 'pivotGroupHeaderHeight',
    setPivotHeaderHeight: 'pivotHeaderHeight',
    setPivotMode: 'pivotMode',
    setPopupParent: 'popupParent',
    setPostProcessPopup: 'postProcessPopup',
    setPostSortRows: 'postSortRows',
    setProcessCellForClipboard: 'processCellForClipboard',
    setProcessCellFromClipboard: 'processCellFromClipboard',
    setProcessPivotResultColDef: 'processPivotResultColDef',
    setProcessPivotResultColGroupDef: 'processPivotResultColGroupDef',
    setProcessRowPostCreate: 'processRowPostCreate',
    setQuickFilter: 'quickFilterText',
    setQuickFilterMatcher: 'quickFilterMatcher',
    setQuickFilterParser: 'quickFilterParser',
    setRowClass: 'rowClass',
    setRowData: 'rowData',
    setRowGroupPanelShow: 'rowGroupPanelShow',
    setSendToClipboard: 'sendToClipboard',
    setServerSideDatasource: 'serverSideDatasource',
    setSideBar: 'sideBar',
    setSuppressClipboardPaste: 'suppressClipboardPaste',
    setSuppressModelUpdateAfterUpdateTransaction:
      'suppressModelUpdateAfterUpdateTransaction',
    setSuppressMoveWhenRowDragging: 'suppressMoveWhenRowDragging',
    setSuppressRowClickSelection: 'suppressRowClickSelection',
    setSuppressRowDrag: 'suppressRowDrag',
    setTabToNextCell: 'tabToNextCell',
    setTabToNextHeader: 'tabToNextHeader',
    setTreeData: 'treeData',
    setViewportDatasource: 'viewportDatasource',
  };

  const pattern = new RegExp(
    `(?<=api[a-z]*)\\.(${Object.keys(translateMethodToOption).join('|')})\\(`,
    'gi',
  );

  const matches = content.matchAll(pattern);
  for (const instance of matches) {
    recorder.remove(instance.index, instance[0].length);
    recorder.insertRight(
      instance.index,
      `.setGridOption('${translateMethodToOption[instance[1]]}', `,
    );
  }

  tree.commitUpdate(recorder);
}
