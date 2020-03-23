import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyTestComponentSelector
} from '@blackbaud/skyux-lib-testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ICellRendererParams,
  RowClickedEvent,
  RowNode
} from 'ag-grid-community';

import {
  SkyCellClass
} from '../../types';

import {
  SkyAgGridFixtureComponent,
  SkyAgGridFixtureModule
} from '../../fixtures/';

import {
  SkyAgGridCellRendererRowSelectorComponent
} from '../cell-renderer-row-selector';

describe('SkyCellRendererCheckboxComponent', () => {
  let rowSelectorCellFixture: ComponentFixture<SkyAgGridCellRendererRowSelectorComponent>;
  let rowSelectorCellComponent: SkyAgGridCellRendererRowSelectorComponent;
  let rowSelectorCellNativeElement: HTMLElement;
  let cellRendererParams: ICellRendererParams;
  let dataField = 'selected';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAgGridFixtureModule
      ]
    });

    rowSelectorCellFixture = TestBed.createComponent(SkyAgGridCellRendererRowSelectorComponent);
    rowSelectorCellNativeElement = rowSelectorCellFixture.nativeElement;
    rowSelectorCellComponent = rowSelectorCellFixture.componentInstance;
    cellRendererParams = {
      value: undefined,
      node: undefined,
      getValue: undefined,
      setValue: undefined,
      valueFormatted: undefined,
      formatValue: undefined,
      data: undefined,
      colDef: {
        field: dataField
      },
      column: undefined,
      $scope: undefined,
      api: undefined,
      columnApi: undefined,
      rowIndex: undefined,
      context: undefined,
      refreshCell: undefined,
      eGridCell: undefined,
      eParentOfValue: undefined,
      addRenderedRowListener: undefined
    };
  });

  it('renders a skyux checkbox in an ag grid', () => {
    let gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    let gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(`.${SkyCellClass.RowSelector}`);
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it('initializes the SkyuxCheckboxGridCellComponent properties', fakeAsync(() => {
      const checked = true;
      const rowNode = new RowNode();
      cellRendererParams.value = checked;
      cellRendererParams.node = rowNode;
      spyOn(rowNode, 'setSelected');

      const checkbox = SkyTestComponentSelector.selectCheckbox(
        rowSelectorCellFixture,
        'row-checkbox'
      );

      expect(rowSelectorCellComponent.checked).toBeUndefined();
      expect(checkbox.selected).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toBeUndefined();

      rowSelectorCellComponent.agInit(cellRendererParams);

      rowSelectorCellFixture.detectChanges();
      tick();
      rowSelectorCellFixture.detectChanges();

      expect(rowSelectorCellComponent.checked).toEqual(checked);
      expect(checkbox.selected).toBe(true);
      expect(rowSelectorCellComponent.rowNode).toEqual(rowNode);
      expect(rowSelectorCellComponent.rowNode.setSelected).toHaveBeenCalledWith(true);
    }));
  });

  describe('updateRow', () => {
    it (`should set the rowNode selected property and the row data's selected property to the component's checked property value`, () => {
      let rowNode = new RowNode();
      rowNode.data = {};
      cellRendererParams.value = true;
      cellRendererParams.node = rowNode;

      spyOn(rowNode, 'setSelected');

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(cellRendererParams);

      rowSelectorCellComponent.updateRow();

      expect(rowSelectorCellComponent.rowNode.setSelected).toHaveBeenCalledWith(true);
      expect(rowSelectorCellComponent.rowNode.data.selected).toBe(true);
    });
  });

  describe('refresh', () => {
    it ('returns false', () => {
      expect(rowSelectorCellComponent.refresh()).toBe(false);
    });
  });

  it(`should set the checkbox's selected value and the
   row data's selected property to the component's checked property value`, fakeAsync(() => {
    let rowClickListener: Function;
    let rowNode = new RowNode();
    rowNode.data = {};
    let rowClickedEvent: RowClickedEvent = {
      node: rowNode,
      data: undefined,
      rowIndex: undefined,
      rowPinned: undefined,
      context: undefined,
      api: undefined,
      columnApi: undefined,
      type: undefined
    };

    cellRendererParams.value = false;
    cellRendererParams.node = rowNode;

    spyOn(rowNode, 'setSelected');
    spyOn(rowNode, 'isSelected').and.returnValue(true);

    rowNode.addEventListener = (event, listener) => {
      // set event listener
      rowClickListener = listener;
    };

    spyOn(rowNode, 'addEventListener').and.callThrough();

    rowSelectorCellFixture.detectChanges();

    const checkbox = SkyTestComponentSelector.selectCheckbox(
      rowSelectorCellFixture,
      'row-checkbox'
    );

    rowSelectorCellComponent.agInit(cellRendererParams);

    expect(rowSelectorCellComponent.checked).toBeFalsy();
    expect(checkbox.selected).toBe(false);

    // trigger the rowClickEventListner
    rowClickListener(rowClickedEvent);
    rowSelectorCellFixture.detectChanges();
    tick();
    rowSelectorCellFixture.detectChanges();

    expect(rowNode.addEventListener).toHaveBeenCalledWith(RowNode.EVENT_ROW_SELECTED, jasmine.any(Function));
    expect(rowSelectorCellComponent.checked).toBe(true);
    expect(checkbox.selected).toBe(true);
    expect(rowNode.data.selected).toBe(true);
  }));

  it('should pass accessibility', async(() => {
    rowSelectorCellFixture.detectChanges();

    rowSelectorCellFixture.whenStable().then(() => {
      expect(rowSelectorCellNativeElement).toBeAccessible();
    });
  }));
});
