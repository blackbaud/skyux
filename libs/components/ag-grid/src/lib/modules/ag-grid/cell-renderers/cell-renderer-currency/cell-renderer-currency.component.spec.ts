import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { NumericOptions } from '@skyux/core';

import { Column, RowNode } from 'ag-grid-community';

import { SkyAgGridFixtureComponent } from '../../fixtures/ag-grid.component.fixture';
import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellClass } from '../../types/cell-class';
import { SkyCellRendererCurrencyParams } from '../../types/cell-renderer-currency-params';
import { ValidatorOptions } from '../../types/validator-options';

import { SkyAgGridCellRendererCurrencyComponent } from './cell-renderer-currency.component';

describe('SkyAgGridCellRendererCurrencyComponent', () => {
  let currencyFixture: ComponentFixture<SkyAgGridCellRendererCurrencyComponent>;
  let currencyComponent: SkyAgGridCellRendererCurrencyComponent;
  let currencyNativeElement: HTMLElement;
  let cellRendererParams: SkyCellRendererCurrencyParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    currencyFixture = TestBed.createComponent(
      SkyAgGridCellRendererCurrencyComponent
    );
    currencyNativeElement = currencyFixture.nativeElement;
    currencyComponent = currencyFixture.componentInstance;
    let column: Column = new Column(
      {
        colId: 'col',
      },
      undefined,
      'col',
      true
    );

    column.setActualWidth(200);

    cellRendererParams = {
      value: 123,
      column,
      node: new RowNode(),
      colDef: {},
      columnApi: undefined,
      data: undefined,
      rowIndex: undefined,
      api: {
        getCellRendererInstances: () => {
          return [];
        },
      },
      context: undefined,
      $scope: undefined,
      eGridCell: undefined,
      formatValue: undefined,
      skyComponentProperties: {} as NumericOptions & ValidatorOptions,
    } as SkyCellRendererCurrencyParams;
  });

  it('renders a skyux numeric element in an ag grid', () => {
    let gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    let gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(
      `.${SkyCellClass.Currency}`
    );
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it('initializes the SkyAgGridCellRendererCurrencyComponent properties', fakeAsync(() => {
      cellRendererParams.value = 123;
      cellRendererParams.skyComponentProperties.format = 'currency';
      cellRendererParams.skyComponentProperties.iso = 'USD';

      expect(currencyComponent.value).toBeUndefined();

      currencyComponent.agInit(cellRendererParams);

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(123);

      cellRendererParams.skyComponentProperties = undefined;
      // @ts-ignore
      cellRendererParams.column = undefined;
      currencyComponent.agInit(cellRendererParams);

      expect(currencyComponent.skyComponentProperties.format).toBe('currency');
    }));
  });

  describe('parameters', () => {
    it('sets the SkyAgGridCellRendererCurrencyComponent params', fakeAsync(() => {
      cellRendererParams.value = 123;
      cellRendererParams.skyComponentProperties.format = 'currency';
      cellRendererParams.skyComponentProperties.iso = 'USD';

      expect(currencyComponent.value).toBeUndefined();

      currencyComponent.params = cellRendererParams;

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(123);
    }));
  });

  describe('refresh', () => {
    it('returns false', () => {
      expect(currencyComponent.refresh(cellRendererParams)).toBe(false);
    });

    it('updates the value if the params have changed', fakeAsync(() => {
      cellRendererParams.value = 123;
      cellRendererParams.skyComponentProperties.format = 'currency';
      cellRendererParams.skyComponentProperties.iso = 'USD';

      expect(currencyComponent.value).toBeUndefined();

      currencyComponent.agInit(cellRendererParams);

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(123);

      cellRendererParams.value = 245;
      currencyComponent.agInit(cellRendererParams);

      currencyFixture.detectChanges();
      tick();
      currencyFixture.detectChanges();

      expect(currencyComponent.value).toBe(245);
    }));
  });

  it('should pass accessibility', async(() => {
    currencyFixture.detectChanges();

    currencyFixture.whenStable().then(() => {
      return expectAsync(currencyNativeElement).toBeAccessible();
    });
  }));
});
