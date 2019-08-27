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
    const expectedValue = '86.75%';
    expect(expectedValue).toEqual(value);
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
    const expectedValue = '86.75309%';
    expect(expectedValue).toEqual(value);
  });

  it('should support Angular digitsInfo formats - testing maxFractionDigits', () => {
    fixture.componentInstance.format = '1.3-5';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValue = '86.75309%';
    expect(expectedValue).toEqual(value);
  });

  it('should default to the 1.0-2 digitsInfo format', () => {
    fixture.componentInstance.format = undefined;
    fixture.detectChanges();
    let value = fixture.nativeElement.textContent.trim();
    let expectedValue = '86.75%';
    expect(expectedValue).toEqual(value);
    fixture.componentInstance.numberValue = '.86';
    fixture.detectChanges();
    value = fixture.nativeElement.textContent.trim();
    expectedValue = '86%';
    expect(expectedValue).toEqual(value);
  });

  it('should support changing locale inline', () => {
    fixture.componentInstance.locale = 'fr-CA';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    // NOTE: The replacement here is to ensure that we have unicode character #160 instead of #32
    // for the space (which is what angular returns in this case).
    const expectedValue = '86,75 %'.replace(' ', ' ');
    expect(expectedValue).toEqual(value);
  });

  it('should respect locale set by SkyAppLocaleProvider', () => {
    fixture.componentInstance.numberValue = '1.235487';
    fixture.detectChanges();

    let value = fixture.nativeElement.textContent.trim();
    let expectedValue = '123.55%';
    expect(expectedValue).toEqual(value);

    mockLocaleStream.next({
      locale: 'fr-CA'
    });

    fixture.detectChanges();

    value = fixture.nativeElement.textContent.trim();

    // NOTE: The replacement here is to ensure that we have unicode character #160 instead of #32
    // for the space (which is what angular returns in this case).
    expectedValue = '123,55 %'.replace(' ', ' ');
    expect(expectedValue).toEqual(value);
  });

  it('should default to en-US locale', () => {
    const pipe = new SkyPercentPipe(mockLocaleProvider);
    const expectedValue = '123.5487%';

    const value = pipe.transform('1.235487', '1.0-4');
    expect(expectedValue).toEqual(value);
    expect(pipe['defaultLocale']).toEqual('en-US');
  });

  it('should work as an injectable', () => {
    fixture.detectChanges();

    // NOTE: The replacement here is to ensure that we have unicode character #160 instead of #32
    // for the space (which is what angular returns in this case).
    const expectedValue = '123,5487 %'.replace(' ', ' ');

    const result = fixture.componentInstance.getDatePipeResult(
      '1.235487',
      '1.0-4',
      'fr-CA'
    );

    expect(expectedValue).toEqual(result);
  });
});
