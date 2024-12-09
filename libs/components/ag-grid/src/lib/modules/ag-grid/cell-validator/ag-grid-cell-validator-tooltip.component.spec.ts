import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyAgGridCellValidatorTooltipFixtureComponent } from '../fixtures/ag-grid-cell-validator-tooltip.component.fixture';
import { SkyAgGridFixtureModule } from '../fixtures/ag-grid.module.fixture';
import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

import { SkyAgGridCellValidatorTooltipComponent } from './ag-grid-cell-validator-tooltip.component';

const NOOP = (): void => {
  return;
};

describe('SkyAgGridCellValidatorTooltipComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipFixtureComponent,
    );
    fixture.componentInstance.parameters = {
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
    } as unknown as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle popover', fakeAsync(() => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipComponent,
    );

    const parameters = {
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
    } as unknown as SkyCellRendererValidatorParams;

    fixture.componentInstance.params = {
      ...parameters,
      skyComponentProperties: {
        validatorMessage: 'Test message ABC',
      },
    };
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.showPopover();
    tick();

    fixture.componentInstance.params = {
      ...parameters,
      skyComponentProperties: {
        validatorMessage: (): string => 'Test message XYZ',
      },
    };
    expect(fixture.componentInstance.validatorMessage).toBe('Test message XYZ');
  }));

  it('should show popover on delayed hover', fakeAsync(async () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipComponent,
    );
    const eventHandlers: Record<string, (event: Event) => void> = {};
    fixture.componentInstance.params = {
      addRenderedRowListener: NOOP,
      column: {
        getActualWidth(): number {
          return -1;
        },
      },
      eGridCell: {
        addEventListener: (eventName: string, handler: () => void) => {
          eventHandlers[eventName] = handler;
        },
      } as HTMLElement,
      formatValue: NOOP,
      getValue: NOOP,
      refreshCell: NOOP,
      rowIndex: 0,
      setValue: NOOP,
      skyComponentProperties: {
        validatorMessage: 'Test message ABC',
      },
    } as unknown as SkyCellRendererValidatorParams;
    const popover = (): HTMLElement | null =>
      (fixture.nativeElement as HTMLElement).ownerDocument.querySelector(
        'sky-popover-content',
      );
    fixture.detectChanges();
    expect(eventHandlers['keyup']).toBeTruthy();
    expect(eventHandlers['mouseenter']).toBeTruthy();
    expect(eventHandlers['mouseleave']).toBeTruthy();
    eventHandlers['keyup']({ key: 'ArrowRight' } as KeyboardEvent);
    tick();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(popover()).toBeTruthy();
    eventHandlers['mouseleave']({} as MouseEvent);
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(popover()).toBeFalsy();
    eventHandlers['mouseenter']({} as MouseEvent);
    tick();
    flush();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(popover()).toBeTruthy();
  }));
});
