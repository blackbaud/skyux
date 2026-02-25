import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';

import {
  BeanCollection,
  ColDef,
  ICellRendererParams,
  RowClickedEvent,
  RowNode,
} from 'ag-grid-community';
import { Observable, of } from 'rxjs';

import {
  MinimalColumnDefs,
  MinimalEditable,
  MinimalRowData,
  SkyAgGridMinimalFixtureComponent,
} from '../../fixtures/ag-grid-minimal.component.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellType } from '../../types/cell-type';

import { SkyAgGridCellRendererRowSelectorComponent } from './cell-renderer-row-selector.component';

describe('SkyAgGridCellRendererRowSelectorComponent', () => {
  let rowSelectorCellFixture: ComponentFixture<SkyAgGridCellRendererRowSelectorComponent>;
  let rowSelectorCellComponent: SkyAgGridCellRendererRowSelectorComponent;
  let rowSelectorCellNativeElement: HTMLElement;
  let cellRendererParams: Partial<ICellRendererParams>;
  const dataField = 'selected';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridMinimalFixtureComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: MinimalColumnDefs,
          useValue: [
            {
              field: 'selected',
              type: SkyCellType.RowSelector,
            },
          ],
        },
        {
          provide: MinimalRowData,
          useValue: [{ selected: false }],
        },
        {
          provide: MinimalEditable,
          useValue: false,
        },
      ],
    });

    rowSelectorCellFixture = TestBed.createComponent(
      SkyAgGridCellRendererRowSelectorComponent,
    );
    rowSelectorCellNativeElement = rowSelectorCellFixture.nativeElement;
    rowSelectorCellComponent = rowSelectorCellFixture.componentInstance;
    const rowNode = new RowNode({ frameworkOverrides: {} } as BeanCollection);
    spyOn(rowNode, 'isSelected').and.returnValue(false);
    spyOn(rowNode, 'setSelected');
    rowNode.data = {};
    cellRendererParams = {
      colDef: {
        field: dataField,
        cellRendererParams: {
          label: 'Select',
        },
      },
      node: rowNode,
    };
  });

  it('renders a skyux checkbox in an ag grid', () => {
    const gridFixture = TestBed.createComponent(
      SkyAgGridMinimalFixtureComponent,
    );
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(
      `.${SkyCellClass.RowSelector}`,
    );
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it(`initializes the SkyuxCheckboxGridCellComponent
      properties and sets the checkbox to the value of the column field provided`, async () => {
      const checked = true;
      cellRendererParams.value = checked;

      const checkbox = await TestbedHarnessEnvironment.loader(
        rowSelectorCellFixture,
      ).getHarness(SkyCheckboxHarness.with({ dataSkyId: 'row-checkbox' }));

      expect(await checkbox.isChecked()).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toBeUndefined();
      expect(() => rowSelectorCellComponent.updateRow(checked)).not.toThrow();

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );

      rowSelectorCellFixture.detectChanges();
      await rowSelectorCellFixture.whenStable();

      expect(await checkbox.isChecked()).toBe(true);
      expect(rowSelectorCellComponent.rowNode).toEqual(cellRendererParams.node);
      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).toHaveBeenCalledWith(true);
    });

    it(`initializes the SkyuxCheckboxGridCellComponent properties and sets the checkbox to the node's selected
      value since no column field provided`, async () => {
      cellRendererParams.value = true;
      (cellRendererParams.colDef as ColDef).field = undefined;

      const checkbox = await TestbedHarnessEnvironment.loader(
        rowSelectorCellFixture,
      ).getHarness(SkyCheckboxHarness.with({ dataSkyId: 'row-checkbox' }));

      rowSelectorCellComponent.agInit({
        ...cellRendererParams,
        colDef: {
          cellRendererParams: {
            label: (): string => 'Select',
          },
        },
      } as ICellRendererParams);

      rowSelectorCellFixture.detectChanges();
      await rowSelectorCellFixture.whenStable();

      expect(await checkbox.isChecked()).toBe(false);
      expect(rowSelectorCellComponent.rowNode).toEqual(cellRendererParams.node);
      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateRow', () => {
    it(`should set the rowNode selected property and the row data's column-defined field property
      to the component's checked property value if column field provided`, () => {
      cellRendererParams.value = false;

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );

      rowSelectorCellComponent.updateRow(true);

      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).toHaveBeenCalledWith(true, undefined, 'checkboxSelected');
      expect(rowSelectorCellComponent.rowNode?.data[dataField]).toBe(true);
    });

    it(`should set the rowNode selected property to the component's checked property value if no column field provided`, () => {
      cellRendererParams.colDef = {
        field: undefined,
      };
      (cellRendererParams.node?.isSelected as jasmine.Spy).and.returnValues(
        true,
        false,
      );

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );
      rowSelectorCellComponent.updateRow(true);

      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).toHaveBeenCalledWith(true, undefined, 'checkboxSelected');
    });

    it(`should not set the rowNode selected property to the component's checked property value if no column field provided and value is not changed`, () => {
      cellRendererParams.colDef = {
        field: undefined,
      };
      (cellRendererParams.node?.isSelected as jasmine.Spy).and.returnValues(
        true,
        true,
      );

      rowSelectorCellFixture.detectChanges();
      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );
      rowSelectorCellComponent.updateRow(true);

      expect(
        rowSelectorCellComponent.rowNode?.setSelected,
      ).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('returns true', () => {
      const rowNode = new RowNode({ frameworkOverrides: {} } as BeanCollection);
      expect(
        rowSelectorCellComponent.refresh({
          node: rowNode,
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
      let rowClickListener: ((event: RowClickedEvent) => void) | undefined;
      const rowNode = new RowNode({ frameworkOverrides: {} } as BeanCollection);
      rowNode.data = {};
      rowNode.selectable = selectable;
      const rowClickedEvent: Partial<RowClickedEvent> = {
        node: rowNode,
        data: undefined,
        rowIndex: undefined,
        rowPinned: undefined,
        context: undefined,
        api: undefined,
        type: undefined,
      };

      cellRendererParams.value = false;
      cellRendererParams.colDef = colDefinition;
      cellRendererParams.node = rowNode;

      spyOn(rowNode, 'setSelected');
      spyOn(rowNode, 'isSelected').and.returnValues(...isSelectedValues);
      spyOn(rowNode, 'addEventListener').and.callFake(
        (event: any, listener: any): void => {
          // set event listener
          rowClickListener = listener;
        },
      );

      rowSelectorCellFixture.detectChanges();

      const checkbox = await TestbedHarnessEnvironment.loader(
        rowSelectorCellFixture,
      ).getHarness(SkyCheckboxHarness.with({ dataSkyId: 'row-checkbox' }));

      rowSelectorCellComponent.agInit(
        cellRendererParams as ICellRendererParams,
      );
      rowSelectorCellFixture.detectChanges();

      expect(await checkbox.isChecked()).toBeFalsy();
      expect(await checkbox.isDisabled()).toBe(!selectable);

      // trigger the rowClickEventListener
      if (rowClickListener && selectable) {
        rowClickListener(rowClickedEvent as RowClickedEvent);
      }

      rowSelectorCellFixture.detectChanges();
      await rowSelectorCellFixture.whenStable();

      if (selectable) {
        expect(rowNode.addEventListener).toHaveBeenCalledWith(
          'rowSelected',
          jasmine.any(Function),
        );
        expect(await checkbox.isChecked()).toBe(true);
        expect(await checkbox.isDisabled()).toBe(false);
      } else {
        expect(await checkbox.isDisabled()).toBe(true);
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

  it('should pass accessibility when collapsed', async () => {
    (cellRendererParams.node as RowNode).rowIndex = null;
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
