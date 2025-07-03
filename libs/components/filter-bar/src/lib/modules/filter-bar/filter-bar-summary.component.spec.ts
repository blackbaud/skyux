import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SkyFilterBarSummaryComponent } from './filter-bar-summary.component';
import { SkyFilterBarSummaryItem } from './models/filter-bar-summary-item';

describe('SkyFilterBarSummaryComponent', () => {
  let component: SkyFilterBarSummaryComponent;
  let componentRef: ComponentRef<SkyFilterBarSummaryComponent>;
  let fixture: ComponentFixture<SkyFilterBarSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyFilterBarSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarSummaryComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('summaryItems', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render summary items', () => {
    const summaryItems: SkyFilterBarSummaryItem[] = [
      { label: 'Total Items', value: 100 },
      { label: 'Active Items', value: 25 },
    ];

    componentRef.setInput('summaryItems', summaryItems);
    fixture.detectChanges();

    const keyInfoElements = fixture.debugElement.queryAll(
      By.css('sky-key-info'),
    );
    expect(keyInfoElements.length).toBe(2);
  });

  it('should display correct labels and values', () => {
    const summaryItems: SkyFilterBarSummaryItem[] = [
      { label: 'Total Items', value: 100 },
      { label: 'Active Items', value: 25 },
    ];

    componentRef.setInput('summaryItems', summaryItems);
    fixture.detectChanges();

    const keyInfoElements = fixture.debugElement.queryAll(
      By.css('sky-key-info'),
    );

    // Check first item
    const firstLabel = keyInfoElements[0].query(By.css('.sky-key-info-label'));
    const firstValue = keyInfoElements[0].query(By.css('.sky-key-info-value'));
    expect(firstLabel.nativeElement.textContent.trim()).toBe('Total Items');
    expect(firstValue.nativeElement.textContent.trim()).toBe('100');

    // Check second item
    const secondLabel = keyInfoElements[1].query(By.css('.sky-key-info-label'));
    const secondValue = keyInfoElements[1].query(By.css('.sky-key-info-value'));
    expect(secondLabel.nativeElement.textContent.trim()).toBe('Active Items');
    expect(secondValue.nativeElement.textContent.trim()).toBe('25');
  });

  it('should handle empty summary items array', () => {
    componentRef.setInput('summaryItems', []);
    fixture.detectChanges();

    const keyInfoElements = fixture.debugElement.queryAll(
      By.css('sky-key-info'),
    );
    expect(keyInfoElements.length).toBe(0);
  });

  it('should handle large numbers', () => {
    const summaryItems: SkyFilterBarSummaryItem[] = [
      {
        label: 'Large Number',
        value: 1234567,
        valueFormat: { truncate: false },
      },
    ];

    componentRef.setInput('summaryItems', summaryItems);
    fixture.detectChanges();

    const keyInfoElement = fixture.debugElement.query(By.css('sky-key-info'));
    const label = keyInfoElement.query(By.css('.sky-key-info-label'));
    const value = keyInfoElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Large Number');
    expect(value.nativeElement.textContent.trim()).toBe('1,234,567');
  });

  it('should handle zero values', () => {
    const summaryItems: SkyFilterBarSummaryItem[] = [
      { label: 'Zero Items', value: 0 },
    ];

    componentRef.setInput('summaryItems', summaryItems);
    fixture.detectChanges();

    const keyInfoElement = fixture.debugElement.query(By.css('sky-key-info'));
    const label = keyInfoElement.query(By.css('.sky-key-info-label'));
    const value = keyInfoElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Zero Items');
    expect(value.nativeElement.textContent.trim()).toBe('0');
  });

  it('should render multiple summary items with different values', () => {
    const summaryItems: SkyFilterBarSummaryItem[] = [
      { label: 'First', value: 1 },
      { label: 'Second', value: 10 },
      { label: 'Third', value: 100 },
      { label: 'Fourth', value: 1000 },
    ];

    componentRef.setInput('summaryItems', summaryItems);
    fixture.detectChanges();

    const keyInfoElements = fixture.debugElement.queryAll(
      By.css('sky-key-info'),
    );
    expect(keyInfoElements.length).toBe(4);

    // Verify first item
    const firstLabel = keyInfoElements[0].query(By.css('.sky-key-info-label'));
    const firstValue = keyInfoElements[0].query(By.css('.sky-key-info-value'));
    expect(firstLabel.nativeElement.textContent.trim()).toBe('First');
    expect(firstValue.nativeElement.textContent.trim()).toBe('1');

    // Verify second item
    const secondLabel = keyInfoElements[1].query(By.css('.sky-key-info-label'));
    const secondValue = keyInfoElements[1].query(By.css('.sky-key-info-value'));
    expect(secondLabel.nativeElement.textContent.trim()).toBe('Second');
    expect(secondValue.nativeElement.textContent.trim()).toBe('10');

    // Verify third item
    const thirdLabel = keyInfoElements[2].query(By.css('.sky-key-info-label'));
    const thirdValue = keyInfoElements[2].query(By.css('.sky-key-info-value'));
    expect(thirdLabel.nativeElement.textContent.trim()).toBe('Third');
    expect(thirdValue.nativeElement.textContent.trim()).toBe('100');

    // Verify fourth item
    const fourthLabel = keyInfoElements[3].query(By.css('.sky-key-info-label'));
    const fourthValue = keyInfoElements[3].query(By.css('.sky-key-info-value'));
    expect(fourthLabel.nativeElement.textContent.trim()).toBe('Fourth');
    expect(fourthValue.nativeElement.textContent.trim()).toBe('1K');
  });
});
