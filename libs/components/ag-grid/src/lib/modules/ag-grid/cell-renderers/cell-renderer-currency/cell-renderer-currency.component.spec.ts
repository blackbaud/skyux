import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { NumericOptions } from '@skyux/core';

import {
  Beans,
  Column,
  GridApi,
  ICellRenderer,
  ICellRendererParams,
  RowNode,
} from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellRendererCurrencyParams } from '../../types/cell-renderer-currency-params';
import { SkyAgGridValidatorProperties } from '../../types/validator-properties';

import { SkyAgGridCellRendererCurrencyComponent } from './cell-renderer-currency.component';

describe('SkyAgGridCellRendererCurrencyComponent', () => {
  let currencyFixture: ComponentFixture<SkyAgGridCellRendererCurrencyComponent>;
  let currencyComponent: SkyAgGridCellRendererCurrencyComponent;
  let currencyNativeElement: HTMLElement;
  let cellRendererParams: Partial<SkyCellRendererCurrencyParams> & {
    skyComponentProperties:
      | (NumericOptions & SkyAgGridValidatorProperties)
      | undefined;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    currencyFixture = TestBed.createComponent(
      SkyAgGridCellRendererCurrencyComponent,
    );
    currencyNativeElement = currencyFixture.nativeElement;
    currencyComponent = currencyFixture.componentInstance;
    const column: Column = new Column(
      {
        colId: 'col',
      },
      null,
      'col',
      true,
    );

    const gridApi = new GridApi();

    gridApi.getCellRendererInstances = (): ICellRenderer[] => {
      return [];
    };

    cellRendererParams = {
      value: 123,
      column,
      node: new RowNode({} as Beans),
      colDef: {},
      columnApi: {} as never,
      data: undefined,
      rowIndex: undefined,
      api: gridApi,
      context: undefined,
      eGridCell: undefined,
      formatValue: undefined,
      skyComponentProperties: {},
    };
  });

  it('renders a skyux numeric element in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(
      `.${SkyCellClass.Currency}`,
    );
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it('initializes the SkyAgGridCellRendererCurrencyComponent properties', fakeAsync(() => {
      cellRendererParams.value = 123;
      if (cellRendererParams.skyComponentProperties) {
        cellRendererParams.skyComponentProperties.format = 'currency';
        cellRendererParams.skyComponentProperties.iso = 'USD';
      }

      expect(currencyComponent.value).toBeUndefined();

      currencyComponent.agInit(cellRendererParams as ICellRendererParams);

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(123);

      cellRendererParams.skyComponentProperties = undefined;
      cellRendererParams.column = undefined;
      currencyComponent.agInit(cellRendererParams as ICellRendererParams);

      expect(currencyComponent.skyComponentProperties.format).toBe('currency');
    }));
  });

  describe('parameters', () => {
    it('sets the SkyAgGridCellRendererCurrencyComponent params', fakeAsync(() => {
      cellRendererParams.value = 123;
      if (cellRendererParams.skyComponentProperties) {
        cellRendererParams.skyComponentProperties.format = 'currency';
        cellRendererParams.skyComponentProperties.iso = 'USD';
      }

      expect(currencyComponent.value).toBeUndefined();

      currencyComponent.params = cellRendererParams as ICellRendererParams;

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(123);
    }));
  });

  describe('refresh', () => {
    it('returns false', () => {
      expect(
        currencyComponent.refresh(cellRendererParams as ICellRendererParams),
      ).toBe(false);
    });

    it('updates the value if the params have changed', fakeAsync(() => {
      cellRendererParams.value = 123;
      if (cellRendererParams.skyComponentProperties) {
        cellRendererParams.skyComponentProperties.format = 'currency';
        cellRendererParams.skyComponentProperties.iso = 'USD';
      }

      expect(currencyComponent.value).toBeUndefined();

      currencyComponent.agInit(cellRendererParams as ICellRendererParams);

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(123);

      cellRendererParams.value = 245;
      currencyComponent.agInit(cellRendererParams as ICellRendererParams);

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(245);
    }));
  });

  it('should pass accessibility', async () => {
    currencyFixture.detectChanges();

    await currencyFixture.whenStable();
    await expectAsync(currencyNativeElement).toBeAccessible();
  });
});
