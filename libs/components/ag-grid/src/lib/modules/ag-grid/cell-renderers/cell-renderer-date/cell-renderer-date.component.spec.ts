import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

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
import {
  SkyCellRendererDateParams,
  SkyDatePipeOptions,
} from '../../types/cell-renderer-date-params';
import { SkyAgGridValidatorProperties } from '../../types/validator-properties';

import { SkyAgGridCellRendererDateComponent } from './cell-renderer-date.component';

describe('SkyAgGridCellRendererDateComponent', () => {
  let dateFixture: ComponentFixture<SkyAgGridCellRendererDateComponent>;
  let dateComponent: SkyAgGridCellRendererDateComponent;
  let dateNativeElement: HTMLElement;
  let cellRendererParams: Partial<SkyCellRendererDateParams> & {
    skyComponentProperties:
      | (SkyDatePipeOptions & SkyAgGridValidatorProperties)
      | undefined;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    dateFixture = TestBed.createComponent(SkyAgGridCellRendererDateComponent);
    dateNativeElement = dateFixture.nativeElement;
    dateComponent = dateFixture.componentInstance;
    const column: Column = new Column(
      {
        colId: 'col',
      },
      null,
      'col',
      true
    );

    const gridApi = new GridApi();

    gridApi.getCellRendererInstances = (): ICellRenderer[] => {
      return [];
    };

    cellRendererParams = {
      value: new Date(2000, 1, 1),
      column,
      node: new RowNode({} as Beans),
      colDef: {},
      columnApi: undefined,
      data: undefined,
      rowIndex: undefined,
      api: gridApi,
      context: undefined,
      eGridCell: undefined,
      formatValue: undefined,
      skyComponentProperties: {},
    };
  });

  it('renders a skyux date element in an ag grid', () => {
    const gridFixture = TestBed.createComponent(SkyAgGridFixtureComponent);
    const gridNativeElement = gridFixture.nativeElement;

    gridFixture.detectChanges();

    const element = gridNativeElement.querySelector(`.${SkyCellClass.Date}`);
    expect(element).toBeVisible();
  });

  describe('agInit', () => {
    it('initializes the SkyAgGridCellRendererDateComponent properties', fakeAsync(() => {
      cellRendererParams.value = new Date(2000, 1, 1);
      if (cellRendererParams.skyComponentProperties) {
        cellRendererParams.skyComponentProperties.format = 'short';
        cellRendererParams.skyComponentProperties.locale = 'en-US';
      }

      expect(dateComponent.value).toBeUndefined();
      expect(dateComponent.skyComponentProperties.format).toBeUndefined();
      expect(dateComponent.skyComponentProperties.locale).toBeUndefined();

      dateComponent.agInit(cellRendererParams as ICellRendererParams);

      dateFixture.detectChanges();
      tick();
      dateFixture.detectChanges();

      expect(dateComponent.value).toEqual(new Date(2000, 1, 1));
      expect(dateComponent.skyComponentProperties.format).toBe('short');
      expect(dateComponent.skyComponentProperties.locale).toBe('en-US');

      cellRendererParams.skyComponentProperties = undefined;
      cellRendererParams.column = undefined;
      dateComponent.agInit(cellRendererParams as ICellRendererParams);

      expect(dateComponent.skyComponentProperties.format).toBe('shortDate');
      expect(dateComponent.skyComponentProperties.locale).toBeUndefined();
    }));
  });

  describe('parameters', () => {
    it('sets the SkyAgGridCellRendererDateComponent params', fakeAsync(() => {
      cellRendererParams.value = new Date(2000, 1, 1);
      if (cellRendererParams.skyComponentProperties) {
        cellRendererParams.skyComponentProperties.format = 'short';
        cellRendererParams.skyComponentProperties.locale = 'en-US';
      }

      expect(dateComponent.value).toBeUndefined();
      expect(dateComponent.skyComponentProperties.format).toBeUndefined();
      expect(dateComponent.skyComponentProperties.locale).toBeUndefined();

      dateComponent.params = cellRendererParams as ICellRendererParams;

      dateFixture.detectChanges();
      tick();
      dateFixture.detectChanges();

      expect(dateComponent.value).toEqual(new Date(2000, 1, 1));
      expect(dateComponent.skyComponentProperties.format).toBe('short');
      expect(dateComponent.skyComponentProperties.locale).toBe('en-US');
    }));
  });

  it('falls back to the legacyLocale param if the SkyAgGridCellRendererDateComponent', fakeAsync(() => {
    cellRendererParams.value = new Date(2000, 1, 1);
    cellRendererParams.legacyLocale = 'en-US';

    expect(dateComponent.value).toBeUndefined();
    expect(dateComponent.skyComponentProperties.format).toBeUndefined();
    expect(dateComponent.skyComponentProperties.locale).toBeUndefined();

    dateComponent.params = cellRendererParams as ICellRendererParams;

    dateFixture.detectChanges();
    tick();
    dateFixture.detectChanges();

    expect(dateComponent.value).toEqual(new Date(2000, 1, 1));
    expect(dateComponent.skyComponentProperties.format).toBe('shortDate');
    expect(dateComponent.skyComponentProperties.locale).toBe('en-US');
  }));

  describe('refresh', () => {
    it('returns false', () => {
      expect(
        dateComponent.refresh(cellRendererParams as ICellRendererParams)
      ).toBe(false);
    });

    it('updates the value if the params have changed', fakeAsync(() => {
      cellRendererParams.value = new Date(2000, 1, 1);
      if (cellRendererParams.skyComponentProperties) {
        cellRendererParams.skyComponentProperties.format = 'shortDate';
        cellRendererParams.skyComponentProperties.locale = 'en-US';
      }

      expect(dateComponent.value).toBeUndefined();

      dateComponent.agInit(cellRendererParams as ICellRendererParams);

      dateFixture.detectChanges();
      tick();
      dateFixture.detectChanges();

      expect(dateComponent.value).toEqual(new Date(2000, 1, 1));

      cellRendererParams.value = new Date(2001, 1, 1);
      dateComponent.agInit(cellRendererParams as ICellRendererParams);

      dateFixture.detectChanges();
      tick();
      dateFixture.detectChanges();

      expect(dateComponent.value).toEqual(new Date(2001, 1, 1));
    }));
  });

  it('should pass accessibility', async () => {
    dateFixture.detectChanges();

    await dateFixture.whenStable();
    await expectAsync(dateNativeElement).toBeAccessible();
  });
});
