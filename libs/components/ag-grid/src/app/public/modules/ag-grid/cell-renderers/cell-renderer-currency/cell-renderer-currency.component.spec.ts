import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyCellClass
} from '../../types/cell-class';

import {
  SkyAgGridFixtureComponent
} from '../../fixtures/ag-grid.component.fixture';

import {
  SkyAgGridFixtureModule
} from '../../fixtures/ag-grid.module.fixture';

import {
  SkyAgGridCellRendererCurrencyComponent
} from './cell-renderer-currency.component';

import {
  SkyCellRendererCurrencyParams
} from '../../types/cell-renderer-currency-params';

import {
  Column,
  RowNode
} from 'ag-grid-community';

import {
  NumericOptions
} from '@skyux/core';

describe('SkyAgGridCellRendererCurrencyComponent', () => {
  let currencyFixture: ComponentFixture<SkyAgGridCellRendererCurrencyComponent>;
  let currencyComponent: SkyAgGridCellRendererCurrencyComponent;
  let currencyNativeElement: HTMLElement;
  let cellRendererParams: SkyCellRendererCurrencyParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAgGridFixtureModule
      ]
    });

    currencyFixture = TestBed.createComponent(SkyAgGridCellRendererCurrencyComponent);
    currencyNativeElement = currencyFixture.nativeElement;
    currencyComponent = currencyFixture.componentInstance;
    let column: Column = new Column(
      {
        colId: 'col'
      },
      undefined,
      'col',
      true);

    column.setActualWidth(200);

    cellRendererParams = {
      value: 123,
      column,
      node: new RowNode(),
      colDef: {},
      columnApi: undefined,
      data: undefined,
      rowIndex: undefined,
      api: undefined,
      context: undefined,
      $scope: undefined,
      eGridCell: undefined,
      formatValue: undefined,
      skyComponentProperties: {} as NumericOptions
    } as SkyCellRendererCurrencyParams;
  });

  it('renders a skyux numeric element in an ag grid', () => {
    let gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    let gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(`.${SkyCellClass.Currency}`);
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
    }));
  });

  describe('refresh', () => {
    it('returns false', () => {
      expect(currencyComponent.refresh()).toBe(false);
    });
  });

  it('should pass accessibility', async(() => {
    currencyFixture.detectChanges();

    currencyFixture.whenStable().then(() => {
      expect(currencyNativeElement).toBeAccessible();
    });
  }));
});
