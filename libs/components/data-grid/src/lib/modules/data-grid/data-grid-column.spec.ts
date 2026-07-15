import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';

import { SkyDataGridColumn } from './data-grid-column';

@Component({
  selector: 'sky-test-component',
  imports: [SkyDataGridColumn],
  template: `
    <sky-data-grid-column headingText="Test Heading">
      <ng-template #projectedTemplate>Projected Cell Content</ng-template>
    </sky-data-grid-column>
  `,
})
class TestComponent {
  @ViewChild(SkyDataGridColumn, { static: true })
  public columnComponent!: SkyDataGridColumn;

  @ViewChild('projectedTemplate', { read: TemplateRef, static: true })
  public projectedTemplate!: TemplateRef<unknown>;
}

// `cellTemplate` is an internal, protected member consumed only by the grid.
function getCellTemplate(
  column: SkyDataGridColumn,
): TemplateRef<unknown> | undefined {
  return (
    column as unknown as {
      cellTemplate: () => TemplateRef<unknown> | undefined;
    }
  ).cellTemplate();
}

describe('SkyDataGridColumn', () => {
  let logServiceSpy: jasmine.Spy;

  beforeEach(() => {
    const logService = {
      warn: jasmine.createSpy('warn'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: SkyLogService, useValue: logService }],
    });

    logServiceSpy = logService.warn;
  });

  it('should set default values for all inputs', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance.columnComponent;

    expect(component.columnId()).toBeUndefined();
    expect(component.dataType()).toBe('text');
    expect(component.field()).toBeUndefined();
    expect(component.flexWidth()).toBe(undefined);
    expect(component.headingText()).toBe('Test Heading');
    expect(component.headingHidden()).toBeFalse();
    expect(component.helpPopoverTitle()).toBeUndefined();
    expect(component.helpPopoverContent()).toBeUndefined();
    expect(component.columnHidden()).toBeFalse();
    expect(component.resizable()).toBeTrue();
    expect(component.sortable()).toBeTrue();
    expect(component.locked()).toBeFalse();
    expect(component.template()).toBeUndefined();
    expect(component.width()).toBe(undefined);
    expect(component.wrapText()).toBeFalse();
  });

  it('should transform flexWidth input correctly', () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('flexWidth', 2);
    fixture.detectChanges();
    expect(component.flexWidth()).toBe(2);

    fixture.componentRef.setInput('flexWidth', '3');
    fixture.detectChanges();
    expect(component.flexWidth()).toBe(3);

    fixture.componentRef.setInput('flexWidth', 'invalid');
    fixture.detectChanges();
    expect(component.flexWidth()).toBeNaN();

    fixture.componentRef.setInput('flexWidth', undefined);
    fixture.detectChanges();
    expect(component.flexWidth()).toBeNaN();

    fixture.componentRef.setInput('flexWidth', 0);
    fixture.detectChanges();
    expect(component.flexWidth()).toBe(0);
  });

  it('should transform boolean inputs correctly', () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    const component = fixture.componentInstance;

    // headingHidden
    fixture.componentRef.setInput('headingHidden', true);
    fixture.detectChanges();
    expect(component.headingHidden()).toBeTrue();

    fixture.componentRef.setInput('headingHidden', 'true');
    fixture.detectChanges();
    expect(component.headingHidden()).toBeTrue();

    // hidden
    fixture.componentRef.setInput('columnHidden', true);
    fixture.detectChanges();
    expect(component.columnHidden()).toBeTrue();

    // locked
    fixture.componentRef.setInput('locked', true);
    fixture.detectChanges();
    expect(component.locked()).toBeTrue();

    // wrapText
    fixture.componentRef.setInput('wrapText', true);
    fixture.detectChanges();
    expect(component.wrapText()).toBeTrue();
  });

  it('should transform width input correctly', () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('width', 150);
    fixture.detectChanges();
    expect(component.width()).toBe(150);

    fixture.componentRef.setInput('width', '200');
    fixture.detectChanges();
    expect(component.width()).toBe(200);

    fixture.componentRef.setInput('width', 'invalid');
    fixture.detectChanges();
    expect(component.width()).toBeNaN();
  });

  it('should resolve cellTemplate to template input if specified', () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    const component = fixture.componentInstance;

    const mockTemplate = {} as TemplateRef<unknown>;
    fixture.componentRef.setInput('template', mockTemplate);
    fixture.detectChanges();

    expect(getCellTemplate(component)).toBe(mockTemplate);
  });

  it('should resolve cellTemplate to templateChild if template input is not specified', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance.columnComponent;

    expect(getCellTemplate(component)).toBeDefined();
    expect(getCellTemplate(component) instanceof TemplateRef).toBeTrue();
  });

  it('should not warn if only columnId is set', async () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    fixture.componentRef.setInput('columnId', 'col-1');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(logServiceSpy).not.toHaveBeenCalled();
  });

  it('should not warn if only field is set', async () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    fixture.componentRef.setInput('field', 'field-1');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(logServiceSpy).not.toHaveBeenCalled();
  });

  it('should warn when both columnId and field are set', async () => {
    const fixture = TestBed.createComponent(SkyDataGridColumn);
    fixture.componentRef.setInput('headingText', 'Test');
    fixture.componentRef.setInput('columnId', 'col-1');
    fixture.componentRef.setInput('field', 'field-1');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(logServiceSpy).toHaveBeenCalledWith(
      'A <sky-data-grid-column> should have either a columnId or a field, but not both.',
    );
  });
});
