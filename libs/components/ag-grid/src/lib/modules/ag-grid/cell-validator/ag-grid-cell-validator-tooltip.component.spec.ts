import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyAgGridCellValidatorTooltipFixtureComponent } from '../fixtures/ag-grid-cell-validator-tooltip.component.fixture';
import { SkyAgGridFixtureModule } from '../fixtures/ag-grid.module.fixture';
import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

import { SkyAgGridCellValidatorTooltipComponent } from './ag-grid-cell-validator-tooltip.component';

describe('SkyAgGridCellValidatorTooltipComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipFixtureComponent
    );
    fixture.componentInstance.parameters = {
      $scope: undefined,
      addRenderedRowListener(): void {},
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
  });

  it('should toggle popover', fakeAsync(() => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipComponent
    );
    const parameters: SkyCellRendererValidatorParams = {
      $scope: undefined,
      addRenderedRowListener(): void {},
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
        validatorMessage: () => 'Test message XYZ',
      },
    };
    expect(fixture.componentInstance.validatorMessage).toBe('Test message XYZ');
  }));

  it('should show popover on delayed hover', fakeAsync(() => {
    const fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipComponent
    );
    const eventHandlers: { [eventName: string]: (event: Event) => void } = {};
    fixture.componentInstance.params = {
      $scope: undefined,
      addRenderedRowListener(): void {},
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
      eGridCell: {
        addEventListener: (eventName, handler) => {
          eventHandlers[eventName] = handler;
        },
      } as HTMLElement,
      eParentOfValue: undefined,
      formatValue(): any {},
      getValue(): any {},
      node: undefined,
      refreshCell(): void {},
      rowIndex: 0,
      setValue(): void {},
      value: undefined,
      valueFormatted: undefined,
      skyComponentProperties: {
        validatorMessage: 'Test message ABC',
      },
    };
    const popover = () =>
      (fixture.nativeElement as HTMLElement).ownerDocument.querySelector(
        'sky-popover-content'
      );
    fixture.detectChanges();
    expect(eventHandlers.keyup).toBeTruthy();
    expect(eventHandlers.mouseenter).toBeTruthy();
    expect(eventHandlers.mouseleave).toBeTruthy();
    eventHandlers.keyup({ key: 'ArrowRight' } as KeyboardEvent);
    tick();
    fixture.detectChanges();
    fixture.whenStable();
    expect(popover()).toBeTruthy();
    eventHandlers.mouseleave({} as MouseEvent);
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    fixture.whenStable();
    expect(popover()).toBeFalsy();
    eventHandlers.mouseenter({} as MouseEvent);
    tick();
    flush();
    fixture.detectChanges();
    fixture.whenStable();
    expect(popover()).toBeTruthy();
  }));
});
