import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { expect } from '@skyux-sdk/testing';
import { SkyPopoverContentHarness } from '@skyux/popovers/testing';

import { CellFocusedEvent } from 'ag-grid-community';

import { SkyAgGridCellValidatorTooltipFixtureComponent } from '../fixtures/ag-grid-cell-validator-tooltip.component.fixture';
import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

describe('SkyAgGridCellValidatorTooltipComponent', () => {
  let fixture: ComponentFixture<SkyAgGridCellValidatorTooltipFixtureComponent>;
  let component: SkyAgGridCellValidatorTooltipFixtureComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridCellValidatorTooltipFixtureComponent],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(
      SkyAgGridCellValidatorTooltipFixtureComponent,
    );
    component = fixture.componentInstance;
    component.parameters = {
      addRenderedRowListener: jasmine.createSpy('addRenderedRowListener'),
      api: {
        addEventListener: jasmine.createSpy('addEventListener'),
        getEditingCells: jasmine.createSpy('getEditingCells'),
        isDestroyed: jasmine
          .createSpy('getEditingCells')
          .and.returnValue(false),
        removeEventListener: jasmine.createSpy('removeEventListener'),
      },
      column: {
        getColId: () => 'test',
      },
      eGridCell: fixture.nativeElement,
      formatValue: jasmine.createSpy('formatValue'),
      getValue: jasmine.createSpy('getValue'),
      refreshCell: jasmine.createSpy('refreshCell'),
      node: {
        rowIndex: 0,
      },
      setValue: jasmine.createSpy('setValue'),
    } as unknown as SkyCellRendererValidatorParams;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle popover', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validatorMessage: 'Test message ABC',
      },
    } as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    component.tooltip()?.showPopover();
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const popoverHarness = await loader.getHarness(
      SkyPopoverContentHarness.with({
        dataSkyId: 'validatorPopover',
      }),
    );
    expect(await popoverHarness.getBodyText()).toEqual('Test message ABC');

    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validatorMessage: (): string => 'Test message XYZ',
      },
    } as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await popoverHarness.getBodyText()).toEqual('Test message XYZ');
  });

  it('should toggle popover with mouse events', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validatorMessage: 'Test message ABC',
      },
    } as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.nativeElement.dispatchEvent(new Event('mouseenter'));
    fixture.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'ArrowUp' }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const popoverHarness = await loader.getHarness(
      SkyPopoverContentHarness.with({
        dataSkyId: 'validatorPopover',
      }),
    );
    expect(await popoverHarness.getBodyText()).toEqual('Test message ABC');

    fixture.nativeElement.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should hide empty messages', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validatorMessage: '',
      },
    } as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();

    component.tooltip()?.showPopover();
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    await expectAsync(
      loader.getHarness(
        SkyPopoverContentHarness.with({
          dataSkyId: 'validatorPopover',
        }),
      ),
    ).toBeRejectedWithError(
      /^Failed to find element matching one of the following queries/,
    );
  });

  it('should hide messages when editing', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validator: () => false,
        validatorMessage: 'Test message ABC',
      },
    } as SkyCellRendererValidatorParams;
    (
      fixture.componentInstance.parameters?.api.getEditingCells as jasmine.Spy
    ).and.returnValue(['test']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.sky-validator-cell')),
    ).toBeTruthy();

    component.tooltip()?.showPopover();
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    await expectAsync(
      loader.getHarness(
        SkyPopoverContentHarness.with({
          dataSkyId: 'validatorPopover',
        }),
      ),
    ).toBeRejectedWithError(
      /^Failed to find element matching one of the following queries/,
    );
  });

  it('should hide messages when valid', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validator: () => true,
        validatorMessage: 'Test message ABC',
      },
    } as SkyCellRendererValidatorParams;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.sky-validator-cell')),
    ).toBeFalsy();
  });

  it('should show messages when not valid', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validator: () => false,
        validatorMessage: 'Test message ABC',
      },
    } as SkyCellRendererValidatorParams;
    (
      fixture.componentInstance.parameters?.api.getEditingCells as jasmine.Spy
    ).and.returnValue([]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();

    component.tooltip()?.showPopover();
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const popoverHarness = await loader.getHarness(
      SkyPopoverContentHarness.with({
        dataSkyId: 'validatorPopover',
      }),
    );
    expect(await popoverHarness.getBodyText()).toEqual('Test message ABC');
  });

  it('should show messages when a cell is focused', async () => {
    fixture.componentInstance.parameters = {
      ...fixture.componentInstance.parameters,
      skyComponentProperties: {
        validator: () => false,
        validatorMessage: 'Test message ABC',
      },
    } as SkyCellRendererValidatorParams;
    (
      fixture.componentInstance.parameters?.api.getEditingCells as jasmine.Spy
    ).and.returnValue([]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();

    expect(
      fixture.componentInstance.parameters.api.addEventListener,
    ).toHaveBeenCalledTimes(2);
    expect(
      fixture.componentInstance.parameters.api.addEventListener,
    ).toHaveBeenCalledWith('cellFocused', jasmine.any(Function));
    expect(
      fixture.componentInstance.parameters.api.addEventListener,
    ).toHaveBeenCalledWith('cellEditingStarted', jasmine.any(Function));
    const eventListener = (
      fixture.componentInstance.parameters.api.addEventListener as jasmine.Spy
    ).calls.argsFor(0)[1] as (eventParams: CellFocusedEvent) => void;
    expect(typeof eventListener).toEqual('function');
    eventListener({
      column: {
        getColId: () => 'test',
      },
      rowIndex: 0,
    } as unknown as CellFocusedEvent);
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const popoverHarness = await loader.getHarness(
      SkyPopoverContentHarness.with({
        dataSkyId: 'validatorPopover',
      }),
    );
    expect(await popoverHarness.getBodyText()).toEqual('Test message ABC');

    eventListener({
      column: {
        getColId: () => 'other',
      },
      rowIndex: 0,
    } as unknown as CellFocusedEvent);
    fixture.detectChanges();
    await fixture.whenStable();
  });
});
