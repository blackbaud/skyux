import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';

import {
  BeanCollection as Beans,
  ColDef,
  ICellRendererParams,
  RowNode,
} from 'ag-grid-community';
import { Observable, of } from 'rxjs';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';

import { SkyAgGridCellRendererRowSelectorComponent } from './cell-renderer-row-selector.component';

describe('SkyAgGridCellRendererRowSelectorComponent', () => {
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
      SkyAgGridCellRendererRowSelectorComponent,
    );
    rowSelectorCellNativeElement = rowSelectorCellFixture.nativeElement;
    rowSelectorCellComponent = rowSelectorCellFixture.componentInstance;
    cellRendererParams = {
      colDef: {
        field: dataField,
        cellRendererParams: {
          label: 'Select',
        },
      },
    };
  });

  it('renders a skyux checkbox in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(
      `.${SkyCellClass.RowSelector}`,
    );
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it(`initializes the SkyuxCheckboxGridCellComponent
      properties and sets the checkbox to the value of the column field provided`, fakeAsync(() => {
      const checked = true;
      const rowNode = new RowNode({ frameworkOverrides: {} } as Beans);
      cellRendererParams.value = checked;
      cellRendererParams.node = rowNode;
      spyOn(rowNode, 'setSelected');

      expect(rowSelectorCellComponent.checked).toBeUndefined();
      expect(rowSelectorCellComponent.rowNode).toBeUndefined();

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );

      rowSelectorCellFixture.detectChanges();
      tick();
      rowSelectorCellFixture.detectChanges();

      expect(rowSelectorCellComponent.checked).toBe(checked);
      expect(rowSelectorCellComponent.rowNode).toEqual(rowNode);
      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).toHaveBeenCalledWith(true);
    }));

    it(`initializes the SkyuxCheckboxGridCellComponent properties and sets the checkbox to the node's selected
      value since no column field provided`, fakeAsync(() => {
      const rowNode = new RowNode({ frameworkOverrides: {} } as Beans);
      cellRendererParams.value = true;
      cellRendererParams.node = rowNode;
      (cellRendererParams.colDef as ColDef).field = undefined;
      spyOn(rowNode, 'setSelected');

      expect(rowSelectorCellComponent.checked).toBeUndefined();
      expect(rowSelectorCellComponent.rowNode).toBeUndefined();

      rowSelectorCellComponent.agInit({
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            label: (): string => 'Select',
          },
        },
      } as ICellRendererParams);

      rowSelectorCellFixture.detectChanges();
      tick();
      rowSelectorCellFixture.detectChanges();

      expect(rowSelectorCellComponent.checked).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toEqual(rowNode);
      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).not.toHaveBeenCalled();
    }));
  });

  describe('updateRow', () => {
    it(`should set the rowNode selected property and the row data's column-defined field property
      to the component's checked property value if column field provided`, () => {
      const rowNode = new RowNode({ frameworkOverrides: {} } as Beans);
      rowNode.data = {};
      cellRendererParams.value = true;
      cellRendererParams.node = rowNode;

      spyOn(rowNode, 'setSelected');

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );

      rowSelectorCellComponent.updateRow();

      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).toHaveBeenCalledWith(true);
      expect(rowSelectorCellComponent.rowNode?.data[dataField]).toBe(true);
    });

    it(`should set the rowNode selected property to the component's checked property value if no column field provided`, () => {
      const rowNode = new RowNode({ frameworkOverrides: {} } as Beans);
      rowNode.data = {};
      cellRendererParams.node = rowNode;
      cellRendererParams.colDef = {
        field: undefined,
      };
      spyOn(rowNode, 'isSelected').and.returnValues(true, false);

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );

      spyOn(rowNode, 'setSelected');

      rowSelectorCellComponent.updateRow();

      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).toHaveBeenCalledWith(true);
    });

    it(`should not set the rowNode selected property to the component's checked property value if no column field provided and value is not changed`, () => {
      const rowNode = new RowNode({ frameworkOverrides: {} } as Beans);
      rowNode.data = {};
      cellRendererParams.node = rowNode;
      cellRendererParams.colDef = {
        field: undefined,
      };
      spyOn(rowNode, 'isSelected').and.returnValues(true, true);

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );

      spyOn(rowNode, 'setSelected');

      rowSelectorCellComponent.updateRow();

      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('returns true', () => {
      expect(
        rowSelectorCellComponent.refresh({
          node: {
            isSelected: () => true,
          } as unknown as RowNode,
        } as unknown as ICellRendererParams),
      ).toBe(true);
    });
  });

  describe('row selection', () => {
    async function testRowSelected(
      colDefinition: ColDef | undefined,
      isSelectedValues: boolean[],
      dataPropertySet = false,
      selectable = true,
    ): Promise<void> {
      const rowNode = new RowNode({ frameworkOverrides: {} } as Beans);
      rowNode.data = {};
      rowNode.selectable = selectable;

      cellRendererParams.value = false;
      cellRendererParams.colDef = colDefinition;
      cellRendererParams.node = rowNode;

      spyOn(rowNode, 'setSelected');
      spyOn(rowNode, 'isSelected').and.returnValues(...isSelectedValues);
      spyOn(rowNode, 'addEventListener').and.stub();

      rowSelectorCellFixture.detectChanges();

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );
      rowSelectorCellFixture.detectChanges();
      expect(rowNode.addEventListener).toHaveBeenCalledWith(
        'rowSelected',
        jasmine.any(Function),
      );

      const loader = TestbedHarnessEnvironment.loader(rowSelectorCellFixture);
      const harness = await loader.getHarness(
        SkyCheckboxHarness.with({ dataSkyId: 'row-checkbox' }),
      );
      expect(await harness.isChecked()).toBe(false);
      expect(await harness.isDisabled()).toBe(!selectable);
      if (selectable) {
        await harness.check();
      }

      rowSelectorCellFixture.detectChanges();
      await rowSelectorCellFixture.whenStable();

      if (selectable) {
        expect(rowSelectorCellComponent.checked).toBe(true);
        expect(await harness.isChecked()).toBe(true);
      }

      if (dataPropertySet) {
        expect(
          cellRendererParams?.colDef?.field &&
            rowNode.data[cellRendererParams.colDef.field],
        ).toBe(true);
      }
    }

    it(`should set the checkbox's selected value and the row data's column-defined field property
      to the component's checked property value if the data field is provided`, async () => {
      await testRowSelected(cellRendererParams.colDef, [true, true], true);
    });

    it(`should set the checkbox's selected value to the component's checked property value if the data field is provided or the default is used`, async () => {
      const columnWithoutDataField = {};
      await testRowSelected(columnWithoutDataField, [false, true, true]);
    });

    it(`should disable the checkbox`, async () => {
      const columnWithoutDataField = {};
      await testRowSelected(
        columnWithoutDataField,
        [false, false, false],
        false,
        false,
      );
    });
  });

  it('should pass accessibility', async () => {
    rowSelectorCellComponent.agInit({
      ...cellRendererParams,
      colDef: {
        cellRendererParams: {
          label: (): Observable<string> => of('Select'),
        },
      },
    } as ICellRendererParams);

    rowSelectorCellFixture.detectChanges();
    await rowSelectorCellFixture.whenStable();

    await expectAsync(rowSelectorCellNativeElement).toBeAccessible();
  });
});
