import { TestBed } from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';

import { SkyAgGridCellRendererCurrencyValidatorComponent } from './cell-renderer-currency-validator.component';

describe('SkyAgGridCellRendererCurrencyValidatorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererCurrencyValidatorComponent
    );
    fixture.componentInstance.parameters = {
      $scope: undefined,
      addRenderedRowListener(): void {},
      // @ts-ignore
      api: undefined,
      colDef: undefined,
      // @ts-ignore
      column: {
        getActualWidth(): number {
          return -1;
        },
      },
      columnApi: undefined,
      context: undefined,
      data: undefined,
      eGridCell: undefined,
      eParentOfValue: undefined,
      formatValue(): any {},
      getValue(): any {},
      node: undefined,
      refreshCell(): void {},
      rowIndex: 0,
      setValue(): void {},
      skyComponentProperties: undefined,
      value: undefined,
      valueFormatted: undefined,
    };
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
    };
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    expect(
      fixture.componentInstance.refresh(fixture.componentInstance.parameters)
    ).toBeFalse();
  });
});
