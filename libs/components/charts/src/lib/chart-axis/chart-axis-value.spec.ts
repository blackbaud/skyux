import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

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
      [max]="max"
      [min]="min"
    />
  `,
})
class TestComponent {
  @ViewChild(SkyChartAxisValue)
  public axis!: SkyChartAxisValue;

  public currencyCode: string | undefined;
  public digits: unknown;
  public format: SkyChartValueFormat | undefined;
  public max: unknown;
  public min: unknown;
}

describe('Chart value axis component', () => {
  let fixture: ComponentFixture<TestComponent>;

  function format(value: number): string {
    fixture.detectChanges();
    return fixture.componentInstance.axis.formatValue()(value);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should default the format to a plain number', () => {
    expect(format(1234567)).toBe('1,234,567');
  });

  it('should format currency using the currency code', () => {
    fixture.componentInstance.format = 'currency';
    fixture.componentInstance.currencyCode = 'EUR';

    expect(format(1234.5)).toBe('€1,234.50');
  });

  it('should format percentages from fractional values', () => {
    fixture.componentInstance.format = 'percent';

    expect(format(0.25)).toBe('25%');
  });

  it('should default the currency code to USD', () => {
    fixture.componentInstance.format = 'currency';

    expect(format(1234.5)).toBe('$1,234.50');
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

  it('should coerce string min and max attributes to numbers', () => {
    fixture.componentInstance.min = '-10';
    fixture.componentInstance.max = '100';
    fixture.detectChanges();

    expect(fixture.componentInstance.axis.min()).toBe(-10);
    expect(fixture.componentInstance.axis.max()).toBe(100);
  });

  it('should ignore invalid min and max values', () => {
    fixture.componentInstance.min = 'not-a-number';
    fixture.componentInstance.max = 'not-a-number';
    fixture.detectChanges();

    expect(fixture.componentInstance.axis.min()).toBeUndefined();
    expect(fixture.componentInstance.axis.max()).toBeUndefined();
  });
});
