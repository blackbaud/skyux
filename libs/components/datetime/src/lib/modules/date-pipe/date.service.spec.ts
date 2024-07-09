import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider,
  SkyIntlDateFormatter,
} from '@skyux/i18n';

import { BehaviorSubject } from 'rxjs';

import { SkyDateService } from './date.service';
import { DatePipeTestModule } from './fixtures/date-pipe.module.fixture';

describe('Date service', () => {
  let service: SkyDateService;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;

  beforeEach(() => {
    mockLocaleStream = new BehaviorSubject({
      locale: 'en-US',
    });

    mockLocaleProvider = {
      defaultLocale: 'en-US',
      getLocaleInfo: () => mockLocaleStream,
    };

    TestBed.configureTestingModule({
      imports: [DatePipeTestModule],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: mockLocaleProvider,
        },
      ],
    });

    service = TestBed.inject(SkyDateService);
  });

  it('should format a date object', () => {
    const value = service.format(new Date(2000, 0, 1));
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should throw an error when provided an invalid date', () => {
    expect(() => {
      service.format('foobar');
    }).toThrow(new Error('Invalid value: foobar'));
  });

  it('should format a timestamp', () => {
    const value = service.format(new Date(2000, 0, 1, 0).getTime());
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format an ISO date string', () => {
    const value = service.format(new Date(2000, 0, 1, 0).toISOString());
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format an incomplete ISO date string without time', () => {
    const value = service.format('2000-01-01');
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format an incomplete ISO date string without time zone', () => {
    const value = service.format('2020-03-03T00:00:00');
    const expectedValues = [
      '3/3/2020, 12:00 AM',
      '3/3/2020 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format a date string', () => {
    const value = service.format('2000/1/1');
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should ignore empty values', () => {
    const value = service.format(undefined);
    expect(value).toBeUndefined();
  });

  it('should not support other objects', () => {
    try {
      service.format({ foo: 'bar' });
      fail('It should fail!');
    } catch (err) {
      expect(err).toExist();
    }
  });

  it('should support Angular DatePipe formats', () => {
    const utcDate = new Date(Date.UTC(2000, 0, 1, 5, 0, 0));
    const date = new Date(
      utcDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
    );

    const formats = new Map([
      ['short', '1/1/2000, 12:00 AM'],
      ['medium', 'Jan 1, 2000, 12:00:00 AM'],
      ['long', 'January 1, 2000, 12:00:00 AM EST'],
      ['full', 'Saturday, January 1, 2000, 12:00:00 AM Eastern Standard Time'],
      ['shortDate', '1/1/2000'],
      ['mediumDate', 'Jan 1, 2000'],
      ['longDate', 'January 1, 2000'],
      ['fullDate', 'Saturday, January 1, 2000'],
      ['shortTime', '12:00 AM'],
      ['mediumTime', '12:00:00 AM'],
      ['longTime', '12:00:00 AM EST'],
      ['fullTime', '12:00:00 AM Eastern Standard Time'],
    ]);

    for (const [format, result] of formats) {
      expect(service.format(date, undefined, format))
        .withContext(
          `Expected ${date} with format '${format}' to output '${result}'`,
        )
        .toEqual(result);
    }
  });

  it('should default to mediumDate format', () => {
    const value = service.format(new Date(2000, 0, 1));
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should support changing locale inline', () => {
    const value = service.format(new Date(2000, 0, 1), 'fr-CA');
    const expectedValues = [
      '2000-01-01 00 h 00',
      '2000-01-01, 00 h 00', // Chrome 88
      '2000-01-01 00:00', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should respect locale set by SkyAppLocaleProvider', () => {
    let value = service.format(new Date(2000, 0, 1));
    let expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);

    mockLocaleStream.next({
      locale: 'fr-CA',
    });

    value = service.format(new Date(2000, 0, 1));
    expectedValues = [
      '2000-01-01 00 h 00',
      '2000-01-01, 00 h 00', // Chrome 88
      '2000-01-01 00:00', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should default to en-US locale', () => {
    const date = new Date(2000, 0, 1);
    const value = service.format(date, 'short');
    const expectedValues = [
      '1/1/2000, 12:00 AM',
      '1/1/2000 12:00 AM', // IE 11
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format invalid in IE ISO date', () => {
    const value = service.format(
      '2017-01-11T09:25:14.014-0500',
      undefined,
      'shortDate',
    );
    const expectedValues = [
      '1/11/2017',
      '1/12/2017', // Firefox
    ];
    expect(expectedValues).toContain(value);
  });

  it('should format invalid in Safari ISO date', () => {
    const value = service.format(
      '2017-01-20T19:00:00+0000',
      undefined,
      'shortDate',
    );
    const expectedValues = [
      '1/20/2017',
      '1/21/2017', // Firefox
    ];
    expect(expectedValues).toContain(value);
  });

  it('should revert to provided format pattern if a match is not found in our aliases', () => {
    const spy = spyOn(SkyIntlDateFormatter, 'format');
    service.format('2000-01-01', undefined, 'NOT_A_REAL_FORMAT');
    expect(spy).toHaveBeenCalledWith(
      jasmine.any(Date),
      jasmine.any(String),
      'NOT_A_REAL_FORMAT',
    );
  });
});
