import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import { SkyFilterBarSummaryItemComponent } from './filter-bar-summary-item.component';

describe('Filter bar summary item component', () => {
  let component: SkyFilterBarSummaryItemComponent;
  let componentRef: ComponentRef<SkyFilterBarSummaryItemComponent>;
  let fixture: ComponentFixture<SkyFilterBarSummaryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyFilterBarSummaryItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarSummaryItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('value', 100);
    componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display numeric values with formatting', () => {
    componentRef.setInput('value', 1234567);
    componentRef.setInput('label', 'Large Number');
    componentRef.setInput('valueFormat', { truncate: false });
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.sky-key-info-label'));
    const value = fixture.debugElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Large Number');
    expect(value.nativeElement.textContent.trim()).toBe('1,234,567');
  });

  it('should display string values without formatting', () => {
    componentRef.setInput('value', 'Custom Value');
    componentRef.setInput('label', 'Text Label');
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.sky-key-info-label'));
    const value = fixture.debugElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Text Label');
    expect(value.nativeElement.textContent.trim()).toBe('Custom Value');
  });

  it('should handle zero values', () => {
    componentRef.setInput('value', 0);
    componentRef.setInput('label', 'Zero Count');
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.sky-key-info-label'));
    const value = fixture.debugElement.query(By.css('.sky-key-info-value'));

    expect(label.nativeElement.textContent.trim()).toBe('Zero Count');
    expect(value.nativeElement.textContent.trim()).toBe('0');
  });

  it('should use horizontal layout', () => {
    componentRef.setInput('value', 100);
    componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const keyInfo = fixture.debugElement.query(By.css('sky-key-info'));
    expect(keyInfo.attributes['layout']).toBe('horizontal');
  });

  it('should pass help key to sky-key-info', () => {
    componentRef.setInput('value', 100);
    componentRef.setInput('label', 'Test Label');
    componentRef.setInput('helpKey', 'test-help-key');
    fixture.detectChanges();

    const keyInfoHelpKeyButton = fixture.debugElement.query(
      By.css('sky-help-inline-help-key-button'),
    );
    expect(keyInfoHelpKeyButton).toExist();
  });

  it('should pass help popover properties to sky-key-info', () => {
    componentRef.setInput('value', 100);
    componentRef.setInput('label', 'Test Label');
    componentRef.setInput('helpPopoverContent', 'Help content');
    componentRef.setInput('helpPopoverTitle', 'Help title');
    fixture.detectChanges();

    const keyInfoHelpPopoverButton = fixture.debugElement.query(
      By.css('sky-help-inline-popover-button'),
    );
    expect(keyInfoHelpPopoverButton).toExist();
  });

  it('should apply display-4 font class to value', () => {
    componentRef.setInput('value', 100);
    componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const value = fixture.debugElement.query(By.css('sky-key-info-value'));
    expect(value.nativeElement.classList).toContain('sky-font-display-4');
  });

  it('should format large numbers with default truncation', () => {
    componentRef.setInput('value', 1000);
    componentRef.setInput('label', 'Thousand');
    fixture.detectChanges();

    const value = fixture.debugElement.query(By.css('.sky-key-info-value'));
    expect(value.nativeElement.textContent.trim()).toBe('1K');
  });
});
