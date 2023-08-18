import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellRendererDateParams } from '../../types/cell-renderer-date-params';

import { SkyAgGridCellRendererDateValidatorComponent } from './cell-renderer-date-validator.component';

const NOOP = (): void => {
  return;
};

describe('SkyAgGridCellRendererDateValidatorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererDateValidatorComponent
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
    } as unknown as SkyCellRendererDateParams;
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
