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
} from 'rxjs';

import {
  PercentPipeTestComponent
} from './fixtures/percent-pipe.component.fixture';

import {
  PercentPipeTestModule
} from './fixtures/percent-pipe.module.fixture';

import {
  SkyPercentPipe
} from './percent.pipe';

describe('Percent pipe', () => {
  let fixture: ComponentFixture<PercentPipeTestComponent>;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;
  const isIE = navigator.userAgent.indexOf('.NET CLR') > -1;

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
        PercentPipeTestModule
      ],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: mockLocaleProvider
        }
      ]
    });

    fixture = TestBed.createComponent(PercentPipeTestComponent);
  });

  it('should format a string object', () => {
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    if (!isIE) {
      const expectedValue = '86.75%';
      expect(value).toEqual(expectedValue);
    } else {
      const expectedValue = '86.75 %';
      expect(value).toEqual(expectedValue);
    }
  });

  it('should ignore empty values', () => {
    fixture.componentInstance.numberValue = undefined;
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toEqual('');
  });

  it('should not support other objects', () => {
    try {
      fixture.componentInstance.numberValue = { foo: 'bar' };
      fixture.detectChanges();
      fixture.nativeElement.textContent.trim();

      fail('It should fail!');
    } catch (err) {
      expect(err).toExist();
    }
  });

  it('should support Angular digitsInfo formats - testing minFractionDigits', () => {
    fixture.componentInstance.format = '1.5-6';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    if (!isIE) {
      const expectedValue = '86.75309%';
      expect(value).toEqual(expectedValue);
    } else {
      const expectedValue = '86.75309 %';
      expect(value).toEqual(expectedValue);
    }
  });

  it('should support Angular digitsInfo formats - testing maxFractionDigits', () => {
    fixture.componentInstance.format = '1.3-5';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    if (!isIE) {
      const expectedValue = '86.75309%';
      expect(value).toEqual(expectedValue);
    } else {
      const expectedValue = '86.75309 %';
      expect(value).toEqual(expectedValue);
    }
  });

  it('should default to the 1.0-2 digitsInfo format', () => {
    fixture.componentInstance.format = undefined;
    fixture.detectChanges();
    let value = fixture.nativeElement.textContent.trim();
    let expectedValue: string;

    if (!isIE) {
      expectedValue = '86.75%';
      expect(value).toEqual(expectedValue);
    } else {
      expectedValue = '86.75 %';
      expect(value).toEqual(expectedValue);
    }

    fixture.componentInstance.numberValue = '.86';
    fixture.detectChanges();
    value = fixture.nativeElement.textContent.trim();

    if (!isIE) {
      expectedValue = '86%';
      expect(value).toEqual(expectedValue);
    } else {
      expectedValue = '86 %';
      expect(value).toEqual(expectedValue);
    }
  });

  it('should support changing locale inline', () => {
    fixture.componentInstance.locale = 'fr-CA';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();

    if (!isIE) {
      // NOTE: The replacement here is to ensure that we have unicode character #160 instead of #32
      // for the space (which is what angular returns in this case).
      const expectedValue = '86,75 %'.replace(' ', ' ');
      expect(value).toEqual(expectedValue);
    } else {
      const expectedValue = '86,75 %';
      expect(value).toEqual(expectedValue);
    }
  });

  it('should respect locale set by SkyAppLocaleProvider', () => {
    fixture.componentInstance.numberValue = '1.235487';
    fixture.detectChanges();

    let value = fixture.nativeElement.textContent.trim();
    let expectedValue: string;
    if (!isIE) {
      expectedValue = '123.55%';
      expect(value).toEqual(expectedValue);
    } else {
      expectedValue = '123.55 %';
      expect(value).toEqual(expectedValue);
    }

    mockLocaleStream.next({
      locale: 'fr-CA'
    });

    fixture.detectChanges();

    value = fixture.nativeElement.textContent.trim();

    if (!isIE) {
      // NOTE: The replacement here is to ensure that we have unicode character #160 instead of #32
      // for the space (which is what angular returns in this case).
      expectedValue = '123,55 %'.replace(' ', ' ');
      expect(value).toEqual(expectedValue);
    } else {
      expectedValue = '123,55 %';
      expect(value).toEqual(expectedValue);
    }
  });

  it('should default to en-US locale', () => {
    const pipe = new SkyPercentPipe(mockLocaleProvider);

    const value = pipe.transform('1.235487', '1.0-4');
    if (!isIE) {
      const expectedValue = '123.5487%';
      expect(value).toEqual(expectedValue);
    } else {
      const expectedValue = '123.5487 %';
      expect(value).toEqual(expectedValue);
    }
    expect(pipe['defaultLocale']).toEqual('en-US');
  });

  it('should work as an injectable', () => {
    fixture.detectChanges();

    const result = fixture.componentInstance.getDatePipeResult(
      '1.235487',
      '1.0-4',
      'fr-CA'
    );

    if (!isIE) {
      // NOTE: The replacement here is to ensure that we have unicode character #160 instead of #32
      // for the space (which is what angular returns in this case).
      const expectedValue = '123,5487 %'.replace(' ', ' ');
      expect(result).toEqual(expectedValue);
    } else {
      const expectedValue = '123,5487 %';
      expect(result).toEqual(expectedValue);
    }
  });
});
