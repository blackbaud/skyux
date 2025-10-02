import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SkyListSummaryItemComponent } from './list-summary-item.component';
import { SkyListSummaryComponent } from './list-summary.component';

// #region test fixtures
@Component({
  template: `
    <sky-list-summary>
      <sky-list-summary-item label="Total Items" [value]="100" />
      <sky-list-summary-item label="Active Items" [value]="25" />
    </sky-list-summary>
  `,
  imports: [SkyListSummaryComponent, SkyListSummaryItemComponent],
})
class TestSummaryComponent {}

@Component({
  template: `
    <sky-list-summary>
      <sky-list-summary-item
        label="Large Number"
        [value]="1234567"
        [valueFormat]="{ truncate: false }"
      />
    </sky-list-summary>
  `,
  imports: [SkyListSummaryComponent, SkyListSummaryItemComponent],
})
class TestLargeNumberComponent {}

@Component({
  template: `
    <sky-list-summary>
      <sky-list-summary-item label="Zero Items" [value]="0" />
    </sky-list-summary>
  `,
  imports: [SkyListSummaryComponent, SkyListSummaryItemComponent],
})
class TestZeroValueComponent {}

@Component({
  template: `
    <sky-list-summary>
      <sky-list-summary-item label="First" [value]="1" />
      <sky-list-summary-item label="Second" [value]="10" />
      <sky-list-summary-item label="Third" [value]="100" />
      <sky-list-summary-item label="Fourth" [value]="1000" />
    </sky-list-summary>
  `,
  imports: [SkyListSummaryComponent, SkyListSummaryItemComponent],
})
class TestMultipleItemsComponent {}

@Component({
  template: ` <sky-list-summary /> `,
  imports: [SkyListSummaryComponent],
})
class TestEmptyComponent {}

// #endregion

describe('Filter bar summary component', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSummaryComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSummaryComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render summary items', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSummaryComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSummaryComponent);
    fixture.detectChanges();

    const summaryItems = fixture.debugElement.queryAll(
      By.directive(SkyListSummaryItemComponent),
    );
    expect(summaryItems.length).toBe(2);
  });

  it('should display correct labels and values', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSummaryComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSummaryComponent);
    fixture.detectChanges();

    const labels = fixture.debugElement.queryAll(By.css('.sky-key-info-label'));
    const values = fixture.debugElement.queryAll(By.css('.sky-key-info-value'));

    expect(labels[0].nativeElement.textContent.trim()).toBe('Total Items');
    expect(values[0].nativeElement.textContent.trim()).toBe('100');

    expect(labels[1].nativeElement.textContent.trim()).toBe('Active Items');
    expect(values[1].nativeElement.textContent.trim()).toBe('25');
  });

  it('should handle empty summary', async () => {
    await TestBed.configureTestingModule({
      imports: [TestEmptyComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestEmptyComponent);
    fixture.detectChanges();

    const summaryItems = fixture.debugElement.queryAll(
      By.directive(SkyListSummaryItemComponent),
    );
    expect(summaryItems.length).toBe(0);
  });

  it('should handle large numbers', async () => {
    await TestBed.configureTestingModule({
      imports: [TestLargeNumberComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestLargeNumberComponent);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.sky-key-info-label'));
    const value = fixture.debugElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Large Number');
    expect(value.nativeElement.textContent.trim()).toBe('1,234,567');
  });

  it('should handle zero values', async () => {
    await TestBed.configureTestingModule({
      imports: [TestZeroValueComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestZeroValueComponent);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.sky-key-info-label'));
    const value = fixture.debugElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Zero Items');
    expect(value.nativeElement.textContent.trim()).toBe('0');
  });

  it('should render multiple summary items with different values', async () => {
    await TestBed.configureTestingModule({
      imports: [TestMultipleItemsComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestMultipleItemsComponent);
    fixture.detectChanges();

    const summaryItems = fixture.debugElement.queryAll(
      By.directive(SkyListSummaryItemComponent),
    );
    expect(summaryItems.length).toBe(4);

    const labels = fixture.debugElement.queryAll(By.css('.sky-key-info-label'));
    const values = fixture.debugElement.queryAll(By.css('.sky-key-info-value'));

    // Verify each item
    expect(labels[0].nativeElement.textContent.trim()).toBe('First');
    expect(values[0].nativeElement.textContent.trim()).toBe('1');

    expect(labels[1].nativeElement.textContent.trim()).toBe('Second');
    expect(values[1].nativeElement.textContent.trim()).toBe('10');

    expect(labels[2].nativeElement.textContent.trim()).toBe('Third');
    expect(values[2].nativeElement.textContent.trim()).toBe('100');

    expect(labels[3].nativeElement.textContent.trim()).toBe('Fourth');
    expect(values[3].nativeElement.textContent.trim()).toBe('1K');
  });

  it('should apply correct CSS classes', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSummaryComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSummaryComponent);
    fixture.detectChanges();

    const summaryContainer = fixture.debugElement.query(
      By.css('.sky-list-summary'),
    );
    expect(summaryContainer).toBeTruthy();

    const summaryItemContainers = fixture.debugElement.queryAll(
      By.css('.sky-list-summary-item'),
    );
    expect(summaryItemContainers.length).toBe(2);
  });
});
