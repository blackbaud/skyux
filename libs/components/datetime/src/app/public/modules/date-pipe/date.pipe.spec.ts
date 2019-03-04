import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  DatePipeTestComponent
} from './fixtures/date-pipe.component.fixture';

import {
  DatePipeTestModule
} from './fixtures/date-pipe.module.fixture';

import {
  SkyDatePipe
} from './date.pipe';

describe('Date pipe', () => {
  let fixture: ComponentFixture<DatePipeTestComponent>;
  let mockChangeDetector: any;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;

  beforeEach(() => {
    mockChangeDetector = {
      markForCheck() {}
    };

    mockLocaleStream = new BehaviorSubject({
      locale: 'en-US'
    });

    mockLocaleProvider = {
      defaultLocale: 'en-US',
      getLocaleInfo: () => mockLocaleStream
    };

    TestBed.configureTestingModule({
      imports: [
        DatePipeTestModule
      ],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: mockLocaleProvider
        }
      ]
    });

    fixture = TestBed.createComponent(DatePipeTestComponent);
  });

  it('should format a date object', () => {
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should support Angular DatePipe formats', () => {
    fixture.componentInstance.format = 'fullDate';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      'Saturday, January 1, 2000',
      'Saturday, January 01, 2000' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should support changing locale inline', () => {
    fixture.componentInstance.locale = 'fr-CA';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '2000-01-01 00 h 00',
      '2000-01-01 00:00' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should respect locale set by SkyAppLocaleProvider', () => {
    fixture.detectChanges();

    let value = fixture.nativeElement.textContent.trim();
    let expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];
    expect(expectedValues).toContain(value);

    mockLocaleStream.next({
      locale: 'fr-CA'
    });

    fixture.detectChanges();

    value = fixture.nativeElement.textContent.trim();
    expectedValues = [
      '2000-01-01 00 h 00',
      '2000-01-01 00:00' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should only transform if the value is set', () => {
    const date = new Date('01/01/2001');
    const pipe = new SkyDatePipe(mockChangeDetector, mockLocaleProvider);

    const spy = spyOn(pipe['ngDatePipe'], 'transform').and.callThrough();

    pipe.transform(date);
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();

    pipe.transform(undefined);
    expect(spy.calls.count()).toEqual(0);
  });

  it('should default to en-US locale', () => {
    const date = new Date('01/01/2000');
    const pipe = new SkyDatePipe(mockChangeDetector, mockLocaleProvider);
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];

    const value = pipe.transform(date, 'short');
    expect(expectedValues).toContain(value);
    expect(pipe['_locale']).toEqual('en-US');
  });
});
