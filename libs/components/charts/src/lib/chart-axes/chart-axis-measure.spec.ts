import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';

import { SkyChartValueFormat } from '../shared/value-format';

import { SkyChartAxisValue } from './chart-axis-value';

@Component({
  imports: [SkyChartAxisValue],
  template: `
    <sky-chart-axis-value
      labelText="Value"
      [currencyCode]="currencyCode"
      [digits]="digits"
      [format]="format"
    />
  `,
})
class TestComponent {
  @ViewChild(SkyChartAxisValue)
  public axis!: SkyChartAxisValue;

  public currencyCode: string | undefined;
  public digits: unknown;
  public format: SkyChartValueFormat | undefined;
}

describe('Chart value axis component', () => {
  let fixture: ComponentFixture<TestComponent>;
  let logSvc: jasmine.SpyObj<SkyLogService>;

  function format(value: number): string {
    fixture.detectChanges();
    return fixture.componentInstance.axis.formatValue()(value);
  }

  beforeEach(() => {
    logSvc = jasmine.createSpyObj<SkyLogService>('SkyLogService', ['warn']);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: SkyLogService, useValue: logSvc }],
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should default the format to a plain number', () => {
    expect(format(1234567)).toBe('1,234,567');
  });

  it('should format currency using the currency code', () => {
    fixture.componentInstance.format = 'currency';
    fixture.componentInstance.currencyCode = 'USD';

    expect(format(1234.5)).toBe('$1,234.50');
  });

  it('should format percentages from fractional values', () => {
    fixture.componentInstance.format = 'percent';

    expect(format(0.25)).toBe('25%');
  });

  it('should fall back to a plain number and warn when currency has no code', () => {
    fixture.componentInstance.format = 'currency';

    expect(format(1234.5)).toBe('1,234.5');
    expect(logSvc.warn).toHaveBeenCalled();
  });

  it('should not warn when a currency code is provided', () => {
    fixture.componentInstance.format = 'currency';
    fixture.componentInstance.currencyCode = 'USD';

    format(1234.5);

    expect(logSvc.warn).not.toHaveBeenCalled();
  });

  it('should remove decimal places when digits is zero', () => {
    fixture.componentInstance.format = 'currency';
    fixture.componentInstance.currencyCode = 'USD';
    fixture.componentInstance.digits = 0;

    expect(format(1234.5)).toBe('$1,235');
  });

  it('should force a fixed number of decimal places', () => {
    fixture.componentInstance.digits = 2;

    expect(format(1234)).toBe('1,234.00');
  });

  it('should coerce a string digits attribute to a number', () => {
    fixture.componentInstance.digits = '0';

    expect(format(1234.5)).toBe('1,235');
  });

  it('should ignore an invalid digits value', () => {
    fixture.componentInstance.digits = 'not-a-number';

    expect(format(1234.5)).toBe('1,234.5');
  });
});
