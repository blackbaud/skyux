import { TestBed } from '@angular/core/testing';

import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';

import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderer-validator-tooltip.component';

const NOOP = (): void => {
  return;
};

describe('SkyAgGridCellRendererValidatorTooltipComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererValidatorTooltipComponent,
    );
    fixture.componentInstance.cellRendererParams = {
      addRenderedRowListener: NOOP,
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
      skyComponentProperties: {},
    } as unknown as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.params = {
      ...fixture.componentInstance.cellRendererParams,
    };
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    expect(
      fixture.componentInstance.refresh(
        fixture.componentInstance.cellRendererParams,
      ),
    ).toBeFalse();

    const valueFormatter = jasmine.createSpy('valueFormatter');

    fixture.componentInstance.cellRendererParams.colDef = { valueFormatter };
    fixture.componentInstance.agInit(
      fixture.componentInstance.cellRendererParams,
    );
    expect(valueFormatter).toHaveBeenCalled();
  });
});
