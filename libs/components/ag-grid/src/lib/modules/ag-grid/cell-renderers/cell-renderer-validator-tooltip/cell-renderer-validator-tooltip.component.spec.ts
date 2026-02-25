import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { SkyCellRendererValidatorParams } from '../../types/cell-renderer-validator-params';

import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderer-validator-tooltip.component';

const NOOP = (): void => {
  return;
};

describe('SkyAgGridCellRendererValidatorTooltipComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererValidatorTooltipComponent,
    );
    fixture.componentRef.setInput('params', {
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
    });
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentRef.setInput('params', {
      ...fixture.componentInstance.params(),
    });
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    expect(
      fixture.componentInstance.refresh(
        fixture.componentInstance.params() as SkyCellRendererValidatorParams,
      ),
    ).toBeFalse();
  });

  it('should support getString method', async () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellRendererValidatorTooltipComponent,
    );
    fixture.componentRef.setInput('params', {
      skyComponentProperties: {
        valueResourceObservable: () => of('Test value ABC'),
        validator: () => false,
        validatorMessage: 'Test message ABC',
      },
      value: 'Test value',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent.trim()).toEqual('Test value ABC');
  });
});
