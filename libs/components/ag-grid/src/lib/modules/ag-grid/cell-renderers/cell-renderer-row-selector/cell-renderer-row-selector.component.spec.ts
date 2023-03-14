import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SkyCheckboxFixture } from '@skyux/forms/testing';

import {
  Beans,
  ColDef,
  ICellRendererParams,
  RowClickedEvent,
  RowNode,
} from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';

import { SkyAgGridCellRendererRowSelectorComponent } from './cell-renderer-row-selector.component';

describe('SkyCellRendererCheckboxComponent', () => {
  // We've had some issue with grid rendering causing the specs to timeout in IE. Extending it slightly to help.
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 7500;

  let rowSelectorCellFixture: ComponentFixture<SkyAgGridCellRendererRowSelectorComponent>;
  let rowSelectorCellComponent: SkyAgGridCellRendererRowSelectorComponent;
  let rowSelectorCellNativeElement: HTMLElement;
  let cellRendererParams: Partial<ICellRendererParams>;
  const dataField = 'selected';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    rowSelectorCellFixture = TestBed.createComponent(
      SkyAgGridCellRendererRowSelectorComponent
    );
    rowSelectorCellNativeElement = rowSelectorCellFixture.nativeElement;
    rowSelectorCellComponent = rowSelectorCellFixture.componentInstance;
    cellRendererParams = {
      colDef: {
        field: dataField,
      },
    };
  });

  it('renders a skyux checkbox in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(
      `.${SkyCellClass.RowSelector}`
    );
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it(`initializes the SkyuxCheckboxGridCellComponent
      properties and sets the checkbox to the value of the column field provided`, fakeAsync(() => {
      const checked = true;
      const rowNode = new RowNode({} as Beans);
      cellRendererParams.value = checked;
      cellRendererParams.node = rowNode;
      spyOn(rowNode, 'setSelected');

      const checkbox = new SkyCheckboxFixture(
        rowSelectorCellFixture,
        'row-checkbox'
      );

      expect(rowSelectorCellComponent.checked).toBeUndefined();
      expect(checkbox.selected).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toBeUndefined();

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams
      );

      rowSelectorCellFixture.detectChanges();
      tick();
      rowSelectorCellFixture.detectChanges();

      expect(rowSelectorCellComponent.checked).toBe(checked);
      expect(checkbox.selected).toBe(true);
      expect(rowSelectorCellComponent.rowNode).toEqual(rowNode);
      expect(
        rowSelectorCellComponent.rowNode?.setSelected
      ).toHaveBeenCalledWith(true);
    }));

    it(`initializes the SkyuxCheckboxGridCellComponent properties and sets the checkbox to the node's selected
      value since no column field provided`, fakeAsync(() => {
      const rowNode = new RowNode({} as Beans);
      cellRendererParams.value = true;
      cellRendererParams.node = rowNode;
      (cellRendererParams.colDef as ColDef).field = undefined;
      spyOn(rowNode, 'setSelected');

      const checkbox = new SkyCheckboxFixture(
        rowSelectorCellFixture,
        'row-checkbox'
      );

      expect(rowSelectorCellComponent.checked).toBeUndefined();
      expect(checkbox.selected).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toBeUndefined();

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams
      );

      rowSelectorCellFixture.detectChanges();
      tick();
      rowSelectorCellFixture.detectChanges();

      expect(rowSelectorCellComponent.checked).toBe(false);
      expect(checkbox.selected).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toEqual(rowNode);
      expect(
        rowSelectorCellComponent.rowNode?.setSelected
      ).not.toHaveBeenCalled();
    }));
  });

  describe('updateRow', () => {
    it(`should set the rowNode selected property and the row data's column-defined field property
      to the component's checked property value if column field provided`, () => {
      const rowNode = new RowNode({} as Beans);
      rowNode.data = {};
      cellRendererParams.value = true;
      cellRendererParams.node = rowNode;

      spyOn(rowNode, 'setSelected');

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams
      );

      rowSelectorCellComponent.updateRow();

      expect(
        rowSelectorCellComponent.rowNode?.setSelected
      ).toHaveBeenCalledWith(true);
      expect(rowSelectorCellComponent.rowNode?.data[dataField]).toBe(true);
    });

    it(`should set the rowNode selected property to the component's checked property value if no column field provided`, () => {
      const rowNode = new RowNode({} as Beans);
      rowNode.data = {};
      cellRendererParams.node = rowNode;
      cellRendererParams.colDef = {
        field: undefined,
      };
      spyOn(rowNode, 'isSelected').and.returnValues(true, false);

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams
      );

      spyOn(rowNode, 'setSelected');

      rowSelectorCellComponent.updateRow();

      expect(
        rowSelectorCellComponent.rowNode?.setSelected
      ).toHaveBeenCalledWith(true);
    });

    it(`should not set the rowNode selected property to the component's checked property value if no column field provided and value is not changed`, () => {
      const rowNode = new RowNode({} as Beans);
      rowNode.data = {};
      cellRendererParams.node = rowNode;
      cellRendererParams.colDef = {
        field: undefined,
      };
      spyOn(rowNode, 'isSelected').and.returnValues(true, true);

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams
      );

      spyOn(rowNode, 'setSelected');

      rowSelectorCellComponent.updateRow();

      expect(
        rowSelectorCellComponent.rowNode?.setSelected
      ).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('returns true', () => {
      expect(
        rowSelectorCellComponent.refresh({
          node: {
            isSelected: () => true,
          } as RowNode,
        } as ICellRendererParams)
      ).toBe(true);
    });
  });

  describe('row selection', () => {
    function testRowSelected(
      colDefinition: ColDef | undefined,
      isSelectedValues: boolean[],
      dataPropertySet: boolean = false
    ): void {
      let rowClickListener: ((event: RowClickedEvent) => void) | undefined;
      const rowNode = new RowNode({} as Beans);
      rowNode.data = {};
      const rowClickedEvent: Partial<RowClickedEvent> = {
        node: rowNode,
        data: undefined,
        rowIndex: undefined,
        rowPinned: undefined,
        context: undefined,
        api: undefined,
        columnApi: undefined,
        type: undefined,
      };

      cellRendererParams.value = false;
      cellRendererParams.colDef = colDefinition;
      cellRendererParams.node = rowNode;

      spyOn(rowNode, 'setSelected');
      spyOn(rowNode, 'isSelected').and.returnValues(...isSelectedValues);

      rowNode.addEventListener = (
        event: unknown,
        listener: (event: RowClickedEvent) => void
      ): void => {
        // set event listener
        rowClickListener = listener;
      };

      spyOn(rowNode, 'addEventListener').and.callThrough();

      rowSelectorCellFixture.detectChanges();

      const checkbox = new SkyCheckboxFixture(
        rowSelectorCellFixture,
        'row-checkbox'
      );

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams
      );

      expect(rowSelectorCellComponent.checked).toBeFalsy();
      expect(checkbox.selected).toBe(false);

      // trigger the rowClickEventListener
      if (rowClickListener) {
        rowClickListener(rowClickedEvent as RowClickedEvent);
      }

      rowSelectorCellFixture.detectChanges();
      tick();
      rowSelectorCellFixture.detectChanges();

      expect(rowNode.addEventListener).toHaveBeenCalledWith(
        RowNode.EVENT_ROW_SELECTED,
        jasmine.any(Function)
      );
      expect(rowSelectorCellComponent.checked).toBe(true);
      expect(checkbox.selected).toBe(true);

      if (dataPropertySet) {
        expect(
          cellRendererParams?.colDef?.field &&
            rowNode.data[cellRendererParams.colDef.field]
        ).toBe(true);
      }
    }

    it(`should set the checkbox's selected value and the row data's column-defined field property
      to the component's checked property value if the data field is provided`, fakeAsync(() => {
      testRowSelected(cellRendererParams.colDef, [true, true], true);
    }));

    it(`should set the checkbox's selected value to the component's checked property value if the data field is provided or the default is used`, fakeAsync(() => {
      const columnWithoutDataField = {};
      testRowSelected(columnWithoutDataField, [false, true, true]);
    }));
  });

  it('should pass accessibility', async () => {
    rowSelectorCellFixture.detectChanges();
    await rowSelectorCellFixture.whenStable();

    await expectAsync(rowSelectorCellNativeElement).toBeAccessible();
  });
});
