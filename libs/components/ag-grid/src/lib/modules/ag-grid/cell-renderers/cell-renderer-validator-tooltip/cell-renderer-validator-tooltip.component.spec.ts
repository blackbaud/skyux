import { TestBed } from '@angular/core/testing';

import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';
import { ValidatorOptions } from '../../types/validator-options';

import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderer-validator-tooltip.component';

describe('SkyAgGridCellRendererValidatorTooltipComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererValidatorTooltipComponent
    );
    fixture.componentInstance.cellRendererParams = {
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
      skyComponentProperties: {} as ValidatorOptions,
      value: undefined,
      valueFormatted: undefined,
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
        fixture.componentInstance.cellRendererParams
      )
    ).toBeFalse();

    const valueFormatter = (value: { [value: string]: any }) =>
      `${value.value}`.toUpperCase();
    fixture.componentInstance.cellRendererParams.colDef = { valueFormatter };
    spyOn(
      fixture.componentInstance.cellRendererParams.colDef,
      // @ts-ignore
      'valueFormatter'
    );
    fixture.componentInstance.agInit(
      fixture.componentInstance.cellRendererParams
    );
    expect(
      fixture.componentInstance.cellRendererParams.colDef.valueFormatter
    ).toHaveBeenCalled();
  });
});
