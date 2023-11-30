import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellRendererCurrencyParams } from '../../types/cell-renderer-currency-params';

import { SkyAgGridCellRendererCurrencyValidatorComponent } from './cell-renderer-currency-validator.component';

const NOOP = (): void => {
  return;
};

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
      addRenderedRowListener: NOOP,
      colDef: undefined,
      column: {
        getActualWidth(): number {
          return -1;
        },
      },
      formatValue: NOOP,
      getValue: NOOP,
      refreshCell: NOOP,
      rowIndex: 0,
      setValue: NOOP,
    } as unknown as SkyCellRendererCurrencyParams;
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
