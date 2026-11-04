import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyChart } from '../chart/chart';

import { SkyChartLegend, type SkyChartLegendItem } from './chart-legend';

describe('Chart legend component', () => {
  let fixture: ComponentFixture<SkyChartLegend>;

  function createItems(count: number): SkyChartLegendItem[] {
    return Array.from({ length: count }, (_, index) => ({
      labelText: `Series ${index + 1}`,
      color: 'red',
      hidden: false,
    }));
  }

  function getButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  function getTabIndexes(): (string | null)[] {
    return getButtons().map((button) => button.getAttribute('tabindex'));
  }

  function pressKey(button: HTMLButtonElement, key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    button.dispatchEvent(event);
    fixture.detectChanges();

    return event;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SkyChart, useValue: { headingText: signal('Sales') } },
      ],
    });

    fixture = TestBed.createComponent(SkyChartLegend);
    fixture.componentRef.setInput('items', createItems(3));
  });

  it('should name the toolbar with the chart heading', () => {
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('[role="toolbar"]');
    expect(toolbar.getAttribute('aria-label')).toBe('Legend for Sales');
  });

  it('should make only the first item a tab stop initially', () => {
    fixture.detectChanges();

    expect(getTabIndexes()).toEqual(['0', '-1', '-1']);
  });

  it('should move the tab stop to the focused item', () => {
    fixture.detectChanges();

    getButtons()[1].focus();
    fixture.detectChanges();

    expect(getTabIndexes()).toEqual(['-1', '0', '-1']);
  });

  it('should move focus to the next item with ArrowRight and wrap', () => {
    fixture.detectChanges();
    const buttons = getButtons();

    buttons[0].focus();
    expect(pressKey(buttons[0], 'ArrowRight').defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(buttons[1]);

    buttons[2].focus();
    pressKey(buttons[2], 'ArrowRight');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should move focus to the previous item with ArrowLeft and wrap', () => {
    fixture.detectChanges();
    const buttons = getButtons();

    buttons[0].focus();
    pressKey(buttons[0], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons[2]);
    expect(getTabIndexes()).toEqual(['-1', '-1', '0']);

    pressKey(buttons[2], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('should move focus to the first and last items with Home and End', () => {
    fixture.detectChanges();
    const buttons = getButtons();

    buttons[1].focus();
    pressKey(buttons[1], 'End');
    expect(document.activeElement).toBe(buttons[2]);

    pressKey(buttons[2], 'Home');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should ignore other keys', () => {
    fixture.detectChanges();
    const buttons = getButtons();

    buttons[0].focus();
    expect(pressKey(buttons[0], 'Tab').defaultPrevented).toBeFalse();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should keep a tab stop when the focused item is removed', () => {
    fixture.detectChanges();

    getButtons()[2].focus();
    fixture.componentRef.setInput('items', createItems(2));
    fixture.detectChanges();

    expect(getTabIndexes()).toEqual(['-1', '0']);
  });

  it('should emit the index of the clicked item', () => {
    fixture.detectChanges();
    const toggleSpy = jasmine.createSpy('itemToggle');
    fixture.componentInstance.itemToggle.subscribe(toggleSpy);

    getButtons()[1].click();

    expect(toggleSpy).toHaveBeenCalledWith(1);
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
