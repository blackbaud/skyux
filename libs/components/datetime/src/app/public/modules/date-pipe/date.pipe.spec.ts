import {
  ComponentFixture,
  TestBed
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
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;

  beforeEach(() => {
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

  it('should format a timestamp', () => {
    fixture.componentInstance.dateValue = new Date(2000, 0, 1, 0).getTime();
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format an ISO date string', () => {
    const isoString = new Date(2000, 0, 1, 0).toISOString();
    fixture.componentInstance.dateValue = isoString;
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format an ISO date string without time', () => {
    fixture.componentInstance.dateValue = '2000-01-01';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format a date string', () => {
    fixture.componentInstance.dateValue = '2000/1/1';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should ignore empty values', () => {
    fixture.componentInstance.dateValue = undefined;
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toEqual('');
  });

  it('should not support other objects', () => {
    try {
      fixture.componentInstance.dateValue = { foo: 'bar' };
      fixture.detectChanges();
      fixture.nativeElement.textContent.trim();

      fail('It should fail!');
    } catch (err) {
      expect(err).toExist();
    }
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

  it('should default to mediumDate format', () => {
    fixture.componentInstance.format = undefined;
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
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

  it('should default to en-US locale', () => {
    const date = new Date('01/01/2000');
    const pipe = new SkyDatePipe(mockLocaleProvider);
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM' // IE 11
    ];

    const value = pipe.transform(date, 'short');
    expect(expectedValues).toContain(value);
    expect(pipe['defaultLocale']).toEqual('en-US');
  });

  it('should format invalid in IE ISO date', () => {
    fixture.componentInstance.format = 'shortDate';
    fixture.componentInstance.dateValue = '2017-01-11T09:25:14.014-0500';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toEqual('1/11/2017');
  });

  it('should format invalid in Safari ISO date', () => {
    fixture.componentInstance.format = 'shortDate';
    fixture.componentInstance.dateValue = '2017-01-20T19:00:00+0000';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toEqual('1/20/2017');
  });

  it('should work as an injectable', () => {
    fixture.detectChanges();

    const date = new Date('01/01/2000');
    const expectedValues = [
      '2000-01-01 00 h 00',
      '2000-01-01 00:00' // IE 11
    ];

    const result = fixture.componentInstance.getDatePipeResult(
      date,
      'short',
      'fr-CA'
    );

    expect(expectedValues).toContain(result);
  });
});
