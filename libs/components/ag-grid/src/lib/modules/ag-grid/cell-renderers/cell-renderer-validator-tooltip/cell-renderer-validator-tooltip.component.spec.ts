import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridFixtureModule } from '../../fixtures/ag-grid.module.fixture';
import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';

import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderer-validator-tooltip.component';

const NOOP = (): void => {
  return;
};

@Component({
  standalone: true,
  template: `{{ params?.value }}`,
})
class MockNestedCellRendererComponent implements ICellRendererAngularComp {
  protected params: ICellRendererParams | undefined;

  #changeDetectorRef = inject(ChangeDetectorRef);

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.#changeDetectorRef.markForCheck();
    return false;
  }
}

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
      colDef: {
        cellRendererParams: {
          skyComponentProperties: {},
        },
      },
      formatValue: NOOP,
      getValue: NOOP,
      refreshCell: NOOP,
      rowIndex: 0,
      setValue: NOOP,
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

  it('should nest another cell renderer', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererValidatorTooltipComponent,
    );
    fixture.componentInstance.agInit({
      column: {
        getActualWidth(): number {
          return -1;
        },
      },
      colDef: {
        cellRenderer: MockNestedCellRendererComponent,
        cellRendererParams: {
          skyComponentProperties: {},
        },
      },
      rowIndex: 0,
    } as SkyCellRendererValidatorParams);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.refresh({
      column: {
        getActualWidth(): number {
          return -1;
        },
      },
      rowIndex: 0,
    } as SkyCellRendererValidatorParams);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
