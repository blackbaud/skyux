import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';

import { Observable, of } from 'rxjs';

import { SkyChartAxisCategory } from './chart-axis-category';

@Component({
  imports: [SkyChartAxisCategory],
  template: `
    <sky-chart-axis-category
      labelText="Month"
      scaleType="time"
      timeUnit="month"
      [categories]="['2026-01-15']"
    />
  `,
})
class TestComponent {
  @ViewChild(SkyChartAxisCategory)
  public axis!: SkyChartAxisCategory;
}

describe('Chart category axis component', () => {
  it('should format time categories for the current locale', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: {
            defaultLocale: 'en-US',
            getLocaleInfo: (): Observable<SkyAppLocaleInfo> =>
              of({ locale: 'fr-CA' }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.axis.displayCategories()).toEqual([
      '15 janv. 2026',
    ]);
  });
});
