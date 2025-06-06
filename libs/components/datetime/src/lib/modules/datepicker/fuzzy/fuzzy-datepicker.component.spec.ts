import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import moment from 'moment';
import { of } from 'rxjs';

import { SkyDatepickerConfigService } from '../datepicker-config.service';
import { SkyDatepickerComponent } from '../datepicker.component';

import { FuzzyDatepickerNoFormatTestComponent } from './fixtures/fuzzy-datepicker-no-format.component.fixture';
import { FuzzyDatepickerReactiveTestComponent } from './fixtures/fuzzy-datepicker-reactive.component.fixture';
import { FuzzyDatepickerTestComponent } from './fixtures/fuzzy-datepicker.component.fixture';
import { FuzzyDatepickerTestModule } from './fixtures/fuzzy-datepicker.module.fixture';

// #region helpers
function detectChanges(fixture: ComponentFixture<any>): void {
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
  tick();
}

function getTriggerButton(
  fixture: ComponentFixture<unknown>,
): HTMLButtonElement {
  const buttonEl = fixture.nativeElement.querySelector(
    '.sky-input-group-datepicker-btn',
  ) as HTMLButtonElement | null;

  if (buttonEl === null) {
    throw new Error('Expected trigger button to exist.');
  }

  return buttonEl;
}

function clickDatepickerButton(
  fixture: ComponentFixture<any>,
  isFakeAsync = true,
): void {
  getTriggerButton(fixture)?.click();
  if (isFakeAsync) {
    detectChanges(fixture);
  }
}

function clickTrigger(fixture: ComponentFixture<unknown>): void {
  getTriggerButton(fixture).click();
  detectChanges(fixture);
}

function setInputProperty(
  value: any,
  component: any,
  fixture: ComponentFixture<any>,
): void {
  component.selectedDate = value;
  detectChanges(fixture);
}

function setInputElementValue(
  element: HTMLElement,
  text: string,
  fixture: ComponentFixture<any>,
): void {
  const inputEl = element.querySelector('input');
  if (inputEl) {
    inputEl.value = text;
  }
  fixture.detectChanges();
  SkyAppTestUtility.fireDomEvent(inputEl, 'change');
  detectChanges(fixture);
}

function blurInput(
  fixture: ComponentFixture<unknown>,
  relatedTarget: Element | null = null,
): void {
  const inputEl = getInputElement(fixture);

  inputEl.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      cancelable: true,
      relatedTarget,
    }),
  );

  detectChanges(fixture);
}

function blurTriggerButton(
  fixture: ComponentFixture<unknown>,
  relatedTarget: Element | null = null,
): void {
  const buttonEl = getTriggerButton(fixture);

  buttonEl.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      cancelable: true,
      relatedTarget,
    }),
  );

  detectChanges(fixture);
}

function setFormControlProperty(
  value: any,
  component: any,
  fixture: ComponentFixture<any>,
): void {
  component.dateControl.setValue(value);
  detectChanges(fixture);
}

function getInputElement(fixture: ComponentFixture<unknown>): HTMLInputElement {
  const inputEl = fixture.nativeElement.querySelector(
    'input',
  ) as HTMLInputElement | null;

  if (inputEl === null) {
    throw new Error('Expected input element to exist.');
  }

  return inputEl;
}

function getInputElementValue(
  fixture: ComponentFixture<any>,
): string | undefined {
  return getInputElement(fixture)?.value;
}

function getCalendarDayButton(
  index: number,
  fixture: ComponentFixture<any>,
): HTMLButtonElement | undefined {
  return document
    .querySelectorAll('tbody tr td .sky-btn-default')
    .item(index) as HTMLButtonElement | undefined;
}

function clickCalendarDateButton(
  index: number,
  fixture: ComponentFixture<any>,
): void {
  getCalendarDayButton(index, fixture)?.click();
  detectChanges(fixture);
}

function getCalendarColumn(index: number): HTMLElement | undefined {
  return document
    .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays')
    .item(index) as HTMLElement | undefined;
}

function getCalendarTitle(): HTMLElement | null {
  return document.querySelector('.sky-datepicker-calendar-title');
}

function clickCalendarTitle(fixture: ComponentFixture<any>): void {
  getCalendarTitle()?.click();
  detectChanges(fixture);
}

function getSelectedCalendarItem(): HTMLElement | null | undefined {
  const datepicker = getDatepicker();
  return datepicker?.querySelector('td .sky-datepicker-btn-selected');
}

function getDatepicker(): HTMLElement | null {
  return document.querySelector('.sky-datepicker-calendar-container');
}
// #endregion

describe('fuzzy datepicker input', () => {
  let configService: SkyDatepickerConfigService;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [FuzzyDatepickerTestModule],
    });
    configService = new SkyDatepickerConfigService();
  });

  describe('nonstandard configuration', () => {
    let fixture: ComponentFixture<FuzzyDatepickerNoFormatTestComponent>;
    let component: FuzzyDatepickerNoFormatTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(function () {
      configService.dateFormat = 'DD/MM/YYYY';

      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: configService,
            },
          ],
        },
      }).createComponent(FuzzyDatepickerNoFormatTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should handle different format from configuration', fakeAsync(() => {
      detectChanges(fixture);

      setInputElementValue(nativeElement, '5/12/2017', fixture);

      expect(getInputElementValue(fixture)).toBe('05/12/2017');
      expect(component.selectedDate).toEqual({ day: 5, month: 12, year: 2017 });
    }));
  });

  describe('standard configuration', () => {
    let fixture: ComponentFixture<FuzzyDatepickerTestComponent>;
    let component: FuzzyDatepickerTestComponent;
    let nativeElement: HTMLElement;

    // After implementing input box, it was necessary to use `tick()` to force the datepicker
    // elements to render, which is why `fakeAsync()` and the call to the custom `detectChanges()`
    // function are used here.
    beforeEach(fakeAsync(() => {
      configService.dateFormat = 'MM/DD/YYYY';
      configService.maxDate = new Date('5/28/2017');
      configService.minDate = new Date('5/2/2017');

      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: configService,
            },
          ],
        },
      }).createComponent(FuzzyDatepickerTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      // Default to US long date format to avoid any test runners that are using a different locale.
      component.dateFormat = 'MM/DD/YYYY';

      detectChanges(fixture);
    }));

    it('should throw an error if directive is added in isolation', () => {
      component.showInvalidDirective = true;
      expect(() => fixture.detectChanges()).toThrowError(
        'You must wrap the `skyFuzzyDatepickerInput` directive within a `<sky-datepicker>` component!',
      );
    });

    it('should mark the control as dirty on input', () => {
      fixture.detectChanges();
      const inputElement = fixture.debugElement.query(By.css('input'));
      const ngModel = inputElement.injector.get(NgModel);

      expect(ngModel.dirty).toEqual(false);

      SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'input');
      fixture.detectChanges();

      expect(ngModel.dirty).toEqual(true);
    });

    it('should create the component with the appropriate styles', () => {
      fixture.detectChanges();

      expect(getInputElement(fixture)).toHaveCssClass('sky-form-control');
      expect(getTriggerButton(fixture)).not.toBeNull();
    });

    it('should not overwrite aria-label on the datepicker input when one is provided', () => {
      getInputElement(fixture)?.setAttribute(
        'aria-label',
        'This is a date field.',
      );
      fixture.detectChanges();

      expect(getInputElement(fixture)?.getAttribute('aria-label')).toBe(
        'This is a date field.',
      );
    });

    it('should keep the calendar open on mode change', fakeAsync(() => {
      fixture.detectChanges();

      clickDatepickerButton(fixture);
      let datepicker = getDatepicker();

      expect(datepicker).not.toBeNull();

      clickCalendarTitle(fixture);
      datepicker = getDatepicker();

      expect(datepicker).not.toBeNull();

      flush();
    }));

    it('should pass date back when date is selected in calendar', fakeAsync(() => {
      setInputProperty(new Date('5/12/2017'), component, fixture);
      clickDatepickerButton(fixture);

      expect(getSelectedCalendarItem()).toHaveText('12');
      expect(getCalendarTitle()).toHaveText('May 2017');

      // Click May 6th
      clickCalendarDateButton(6, fixture);

      expect(component.selectedDate).toEqual({ year: 2017, day: 6, month: 5 });
      expect(getInputElementValue(fixture)).toBe('05/06/2017');

      flush();
    }));

    it('should be accessible', async () => {
      fixture.detectChanges();
      clickDatepickerButton(fixture, false);
      fixture.detectChanges();

      // Due to the nature of the calendar popup and this being an async test,
      // we need a couple when stable blocks to ensure the calendar is showing.
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    describe('initialization', () => {
      it('should handle initializing with a Fuzzy Date object', fakeAsync(() => {
        setInputProperty({ month: 5, day: 12, year: 2017 }, component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should handle initializing with a Fuzzy Date object excluding year', fakeAsync(() => {
        setInputProperty({ month: 5, day: 12 }, component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12');
        expect(component.selectedDate).toEqual({ day: 12, month: 5 });

        flush();
      }));

      it('should handle initializing with a Fuzzy Date object with a zero year', fakeAsync(() => {
        setInputProperty({ month: 5, day: 12, year: 0 }, component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 0 });

        flush();
      }));

      it('should handle initializing with a Date object', fakeAsync(() => {
        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should handle initializing with a string with the expected format', fakeAsync(() => {
        setInputProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should handle initializing with a string with a two digit years', fakeAsync(() => {
        setInputProperty('5/12/17', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should be invalid when initializing with a ISO string', fakeAsync(() => {
        setInputProperty('2009-06-15T00:00:01', component, fixture);

        expect(getInputElementValue(fixture)).toBe('2009-06-15T00:00:01');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should be invalid when initializing with an ISO string with offset', fakeAsync(() => {
        setInputProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');

        flush();
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should be invalid following input change with a ISO string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2009-06-15T00:00:01', fixture);

        expect(getInputElementValue(fixture)).toBe('2009-06-15T00:00:01');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');
        expect(component.selectedDate).toEqual('2009-06-15T00:00:01');

        flush();
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(
          nativeElement,
          '1994-11-05T08:15:30-05:00',
          fixture,
        );

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');
        expect(component.selectedDate).toEqual('1994-11-05T08:15:30-05:00');

        flush();
      }));

      it('should handle two digit years', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 1998,
        });

        flush();
      }));

      it('should handle undefined date', fakeAsync(() => {
        setInputProperty('5/12/17', component, fixture);

        setInputProperty(undefined, component, fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should pass date to calendar', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);
        clickDatepickerButton(fixture);

        expect(getCalendarTitle()).toHaveText('May 2017');
        expect(getSelectedCalendarItem()).toHaveText('12');

        flush();
      }));

      it('should format date on blur', fakeAsync(() => {
        detectChanges(fixture);
        const inputElement = fixture.debugElement.query(By.css('input'));

        setInputElementValue(nativeElement, 'April 4', fixture);
        SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'blur');
        fixture.detectChanges();

        expect(getInputElementValue(fixture)).toBe('04/04');

        flush();
      }));

      it('should not clear invalid values on blur', fakeAsync(() => {
        detectChanges(fixture);
        const inputElement = fixture.debugElement.query(By.css('input'));

        setInputElementValue(nativeElement, 'asdf', fixture);
        SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'blur');
        fixture.detectChanges();

        expect(getInputElementValue(fixture)).toBe('asdf');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));
    });

    describe('formats', () => {
      it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'DD/MM/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 5,
          month: 12,
          year: 2017,
        });

        component.dateFormat = 'MM/DD/YYYY';
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('12/05/2017');
        expect(component.selectedDate).toEqual({
          day: 5,
          month: 12,
          year: 2017,
        });

        flush();
      }));

      it('should handle a dateFormat excluding year on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'MM/DD';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: undefined,
        });

        flush();
      }));

      it('should handle a dateFormat without a separator', fakeAsync(() => {
        component.dateFormat = 'YY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2017', fixture);

        expect(getInputElementValue(fixture)).toBe('17');
        expect(component.selectedDate).toEqual({
          day: undefined,
          month: undefined,
          year: 2017,
        });

        flush();
      }));

      it('should handle a dateFormat with day before month excluding year on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'DD/MM';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '12/5', fixture);

        expect(getInputElementValue(fixture)).toBe('12/05');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: undefined,
        });

        flush();
      }));

      it('should handle a dateFormat excluding day on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'MM/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/2017');
        expect(component.selectedDate).toEqual({
          month: 5,
          year: 2017,
          day: undefined,
        });

        flush();
      }));

      it('should handle a dateFormat with year before month and excluding day on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'YYYY/MM';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2017/5', fixture);

        expect(getInputElementValue(fixture)).toBe('2017/05');
        expect(component.selectedDate).toEqual({
          month: 5,
          year: 2017,
          day: undefined,
        });

        flush();
      }));

      it('should handle a dateFormat with a 2 digit year excluding day on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'MM/YY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/17', fixture);

        expect(getInputElementValue(fixture)).toBe('05/17');
        expect(component.selectedDate).toEqual({
          month: 5,
          year: 2017,
          day: undefined,
        });

        flush();
      }));

      it(`should handle a dateFormat with a 2 digit year before month excluding day on the input
       different than the default`, fakeAsync(() => {
        component.dateFormat = 'YY/MM';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '17/5', fixture);

        expect(getInputElementValue(fixture)).toBe('17/05');
        expect(component.selectedDate).toEqual({
          month: 5,
          year: 2017,
          day: undefined,
        });

        flush();
      }));
    });

    describe('model change', () => {
      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');

        flush();
      }));

      it('should handle model change with a Date object and a date format excluding year', fakeAsync(() => {
        fixture.componentInstance.dateFormat = 'MM/DD';
        detectChanges(fixture);

        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12');
        expect(component.selectedDate).toEqual({ month: 5, day: 12 });

        flush();
      }));

      it('should handle model change with a Date object and a date format excluding day', fakeAsync(() => {
        fixture.componentInstance.dateFormat = 'MM/YYYY';
        detectChanges(fixture);

        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/2017');
        expect(component.selectedDate).toEqual({ month: 5, year: 2017 });

        flush();
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should be invalid following model change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('2009-06-15T00:00:01', component, fixture);

        expect(getInputElementValue(fixture)).toBe('2009-06-15T00:00:01');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should be invalid following model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('5/12/98', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 5,
          year: 1998,
        });

        flush();
      }));
    });

    describe('validation', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = inputElement.injector.get(NgModel);
      });

      it('should validate properly when invalid date is passed through input change', fakeAsync(() => {
        detectChanges(fixture);
        setInputElementValue(nativeElement, 'abcdef', fixture);
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.selectedDate).toEqual('abcdef');

        expect(ngModel.valid).toBe(false);
        expect(ngModel.pristine).toBe(false);
        expect(ngModel.touched).toBe(true);

        flush();
      }));

      it('should validate properly when invalid date on initialization', fakeAsync(() => {
        setInputProperty('abcdef', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.selectedDate).toBe('abcdef');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);

        blurInput(fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);

        flush();
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);
        setInputProperty('abcdef', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.selectedDate).toBe('abcdef');
        expect(ngModel.valid).toBe(false);

        flush();
      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);
        setInputElementValue(fixture.nativeElement, '', fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(component.selectedDate).toBe('');
        expect(ngModel.valid).toBe(true);

        flush();
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);
        setInputElementValue(fixture.nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(component.selectedDate).toEqual({
          day: 12,
          month: 2,
          year: 2015,
        });
        expect(ngModel.valid).toBe(true);

        flush();
      }));

      it('should open the calendar to the current date when an invalid date is input', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);

        clickDatepickerButton(fixture);

        const today = new Date();
        const todayDateString = moment().format('MMMM YYYY');

        expect(getCalendarTitle()).toHaveText(todayDateString);
        expect(getSelectedCalendarItem()).toHaveText(
          today.getDate().toString().padStart(2, '0'),
        );

        flush();
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.selectedDate).toBe('abcdef');
        expect(ngModel.valid).toBe(true);

        flush();
      }));

      it('should validate properly when an invalid date format is passed through input change', fakeAsync(() => {
        fixture.componentInstance.dateFormat = 'MM/DD/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2015/2/12', fixture);

        expect(getInputElementValue(fixture)).toBe('2015/2/12');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors?.['skyFuzzyDate'].invalid).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));

      it(`should validate properly when futureDisabled = true and a future date is passed through input change`, fakeAsync(() => {
        fixture.componentInstance.futureDisabled = true;
        moment.locale('en');
        detectChanges(fixture);

        const futureDateString = moment().add(1, 'days').format('L');
        setInputElementValue(nativeElement, futureDateString, fixture);

        expect(getInputElementValue(fixture)).toBe(futureDateString);
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors?.['skyFuzzyDate'].futureDisabled).toBeTruthy();

        const todayDateString = moment().format('L');
        setInputElementValue(nativeElement, todayDateString, fixture);

        expect(getInputElementValue(fixture)).toBe(todayDateString);
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));

      it('should validate properly when year is required and values are passed through input change', fakeAsync(() => {
        fixture.componentInstance.yearRequired = true;
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2/12', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors?.['skyFuzzyDate'].yearRequired).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        setInputElementValue(nativeElement, '2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        setInputElementValue(nativeElement, '2020', fixture);

        expect(getInputElementValue(fixture)).toBe('2020');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));
    });

    describe('future disabled fuzzy date', () => {
      beforeEach(fakeAsync(() => {
        configService.maxDate = undefined;
        fixture = TestBed.createComponent(FuzzyDatepickerTestComponent);

        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;

        // Default to US long date format to avoid any test runners that are using a different locale.
        component.dateFormat = 'MM/DD/YYYY';

        detectChanges(fixture);
      }));

      it('should pass max date to calendar when using future disabled', fakeAsync(() => {
        const currentDateModified = new Date();
        currentDateModified.setDate(1);
        jasmine.clock().install();
        jasmine.clock().mockDate(currentDateModified);
        setInputProperty(currentDateModified, component, fixture);
        component.futureDisabled = false;
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        let dateButtonEl = getCalendarDayButton(25, fixture);
        expect(dateButtonEl).not.toHaveCssClass('sky-btn-disabled');

        clickDatepickerButton(fixture);
        detectChanges(fixture);

        component.futureDisabled = true;
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        dateButtonEl = getCalendarDayButton(25, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        jasmine.clock().uninstall();
        flush();
      }));
    });

    describe('min max fuzzy date', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = inputElement.injector.get(NgModel);
      });

      it(
        'should validate properly when the date is passed through input change' +
          ' beyond the max fuzzy date',
        fakeAsync(() => {
          fixture.componentInstance.maxDate = { month: 2, day: 15, year: 2015 };
          detectChanges(fixture);

          setInputElementValue(nativeElement, '2/16/2015', fixture);

          expect(getInputElementValue(fixture)).toBe('02/16/2015');
          expect(ngModel.valid).toBe(false);
          expect(ngModel.touched).toBe(true);
          expect(ngModel.errors?.['skyFuzzyDate'].maxDate).toBeTruthy();

          setInputElementValue(nativeElement, '2/15/2015', fixture);

          expect(getInputElementValue(fixture)).toBe('02/15/2015');
          expect(ngModel.valid).toBe(true);
          expect(ngModel.touched).toBe(true);
          expect(ngModel.errors).toBeNull();

          flush();
        }),
      );

      it(
        'should validate properly when the date is passed through input change' +
          ' prior to the min fuzzy date',
        fakeAsync(() => {
          fixture.componentInstance.minDate = { month: 2, day: 15, year: 2015 };
          detectChanges(fixture);

          setInputElementValue(nativeElement, '2/14/2015', fixture);

          expect(getInputElementValue(fixture)).toBe('02/14/2015');
          expect(ngModel.valid).toBe(false);
          expect(ngModel.touched).toBe(true);
          expect(ngModel.errors?.['skyFuzzyDate'].minDate).toBeTruthy();
          expect(ngModel.errors?.['skyFuzzyDate'].minDateFormatted).toEqual(
            '02/15/2015',
          );

          setInputElementValue(nativeElement, '2/15/2015', fixture);

          expect(getInputElementValue(fixture)).toBe('02/15/2015');
          expect(ngModel.valid).toBe(true);
          expect(ngModel.touched).toBe(true);
          expect(ngModel.errors).toBeNull();

          flush();
        }),
      );

      it('should handle model change above max fuzzy fuzzy date', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 5, day: 25, year: 2017 };
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/26/2017', fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.errors?.['skyFuzzyDate'].maxDate).toBeTruthy();
        expect(ngModel.errors?.['skyFuzzyDate'].maxDateFormatted).toEqual(
          '05/25/2017',
        );

        flush();
      }));

      it('should handle model change below min fuzzy date', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 5, day: 4, year: 2017 };
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/1/2017', fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.errors?.['skyFuzzyDate'].minDate).toBeTruthy();
        expect(ngModel.errors?.['skyFuzzyDate'].minDateFormatted).toEqual(
          '05/04/2017',
        );

        flush();
      }));

      it('should pass max date to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 5, day: 25, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(27, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 5, day: 4, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(3, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass max date from config service to calendar when max fuzzy date is invalid', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 15, day: 35, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(30, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass min date from config service to calendar when min fuzzy date is invalid', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 15, day: 35, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.startingDay = 5;
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const firstDayCol = getCalendarColumn(0);
        expect(firstDayCol).toHaveText('Fr');

        flush();
      }));
    });

    describe('startAtDate', () => {
      it('should be passed to calendar', fakeAsync(() => {
        setInputProperty(undefined, component, fixture);
        component.startAtDate = { year: 1995 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        expect(getSelectedCalendarItem()).toHaveText('01');
        expect(getCalendarTitle()).toHaveText('January 1995');

        flush();
      }));
    });

    describe('detectInputValueChange', () => {
      it('updates selectedDate without a change event', fakeAsync(() => {
        const inputEl = getInputElement(fixture);
        const initialDate = '01/01/2019';
        const newDate = '12/31/2019';

        setInputProperty(initialDate, component, fixture);

        expect(getInputElementValue(fixture)).toBe(initialDate);
        expect(component.selectedDate).toEqual({
          month: 1,
          day: 1,
          year: 2019,
        });

        if (inputEl) {
          inputEl.value = newDate;
        }
        component.inputDirective.detectInputValueChange();

        expect(getInputElementValue(fixture)).toBe(newDate);
        expect(component.selectedDate).toEqual({
          month: 12,
          day: 31,
          year: 2019,
        });

        flush();
      }));
    });

    describe('disabled state', () => {
      it('should disable the input and trigger button when disable is set to true', fakeAsync(() => {
        component.isDisabled = true;
        detectChanges(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeTruthy();
        expect(getTriggerButton(fixture)?.disabled).toBeTruthy();

        flush();
      }));

      it('should not disable the input and trigger button when disable is set to false', fakeAsync(() => {
        component.isDisabled = false;
        detectChanges(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeFalsy();
        expect(getTriggerButton(fixture)?.disabled).toBeFalsy();

        flush();
      }));
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<FuzzyDatepickerReactiveTestComponent>;
    let component: FuzzyDatepickerReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      configService.dateFormat = 'MM/DD/YYYY';
      configService.maxDate = new Date('5/28/2017');
      configService.minDate = new Date('5/2/2017');

      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: configService,
            },
          ],
        },
      }).createComponent(FuzzyDatepickerReactiveTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('initial value', () => {
      it('should set the Fuzzy Date object value correctly', fakeAsync(() => {
        component.initialValue = { month: 5, day: 12, year: 2017 };
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should set the Fuzzy Date object excluding year value correctly', fakeAsync(() => {
        component.initialValue = { month: 5, day: 12 };
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('05/12');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5 });

        flush();
      }));

      it('should set the Fuzzy Date object with a zero year value correctly', fakeAsync(() => {
        component.initialValue = { month: 5, day: 12, year: 0 };
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('05/12');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 0,
        });

        flush();
      }));

      it('should set the string initial value correctly', fakeAsync(() => {
        component.initialValue = '5/12/2017';
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should reset the value when initialized with undefined', () => {
        // Initial value is undefined.
        component.initialValue = undefined;
        fixture.detectChanges();
        expect(getInputElementValue(fixture)).toBe('');

        // Set to date value.
        component.dateControl.setValue(new Date('05/12/2017'));
        fixture.detectChanges();
        expect(getInputElementValue(fixture)).toBe('05/12/2017');

        // Reset the value and confirm undefined.
        component.dateControl.reset();
        fixture.detectChanges();
        expect(getInputElementValue(fixture)).toBe('');
        expect(component.dateControl.value).toEqual(null);
      });
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should be invalid following input change with a ISO string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2009-06-15T00:00:01', fixture);

        expect(getInputElementValue(fixture)).toBe('2009-06-15T00:00:01');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should be invalid following input change with an ISO string with offset', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(
          nativeElement,
          '1994-11-05T08:15:30-05:00',
          fixture,
        );

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');
      }));

      it('should be invalid following input change with a date string excluding month', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '21/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('21/2015');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 1998,
        });
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should handle input change with a two digit year', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 1998,
        });

        flush();
      }));

      it('should handle input change with year only', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2017', fixture);

        expect(getInputElementValue(fixture)).toBe('2017');
        expect(component.dateControl.value).toEqual({
          day: undefined,
          month: undefined,
          year: 2017,
        });

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 1998,
        });

        flush();
      }));

      it('should handle undefined date', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('5/12/17', component, fixture);

        setFormControlProperty(undefined, component, fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should pass date to calendar', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);
        clickDatepickerButton(fixture);

        expect(getCalendarTitle()).toHaveText('May 2017');
        expect(getSelectedCalendarItem()).toHaveText('12');

        flush();
      }));
    });

    describe('model change', () => {
      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');

        flush();
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 2017,
        });

        flush();
      }));

      it('should be invalid following model change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('2009-06-15T00:00:01', component, fixture);

        expect(getInputElementValue(fixture)).toBe('2009-06-15T00:00:01');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should be invalid following model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('5/12/98', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 5,
          year: 1998,
        });

        flush();
      }));
    });

    describe('Angular form control statuses', function () {
      it('should set correct statuses when initialized without value', fakeAsync(function () {
        fixture.componentInstance.initialValue = undefined;
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        flush();
      }));

      it('should set correct statuses when initialized with value', fakeAsync(function () {
        fixture.componentInstance.initialValue = '1/1/2000';
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        flush();
      }));

      it('should set correct statuses after user types within input', fakeAsync(function () {
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        setInputElementValue(nativeElement, '1/1/2000', fixture);
        blurInput(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should set correct statuses after user selects from calendar', fakeAsync(() => {
        fixture.componentInstance.initialValue = '5/15/2017';
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        clickDatepickerButton(fixture);
        getSelectedCalendarItem()?.click();
        blurTriggerButton(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should mark control as touched only after focus has left the composite control', fakeAsync(() => {
        detectChanges(fixture);

        expect(component.dateControl.touched).toBe(false);

        const inputEl = getInputElement(fixture);
        const triggerButtonEl = getTriggerButton(fixture);

        // Move focus to the trigger button.
        blurInput(fixture, triggerButtonEl);
        expect(component.dateControl.touched).toBe(false);

        // Click the calendar and move focus to the input.
        clickTrigger(fixture);
        getSelectedCalendarItem()?.click();
        blurTriggerButton(fixture, inputEl);
        expect(component.dateControl.touched).toBe(false);

        // Blur the input, but move focus elsewhere.
        blurInput(fixture, null);
        expect(component.dateControl.touched).toBe(true);
      }));
    });

    describe('validation', () => {
      it('should validate properly when invalid date is passed through input change', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        setInputElementValue(nativeElement, 'abcdef', fixture);
        fixture.detectChanges();

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.dateControl.value).toEqual('abcdef');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should validate properly when invalid date on initialization', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('abcdef', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.dateControl.value).toBe('abcdef');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        blurInput(fixture);

        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);

        setFormControlProperty('abcdef', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.dateControl.value).toBe('abcdef');
        expect(component.dateControl.valid).toBe(false);

        flush();
      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);
        setInputElementValue(fixture.nativeElement, '', fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(component.dateControl.value).toBe('');
        expect(component.dateControl.valid).toBe(true);

        flush();
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);
        setInputElementValue(fixture.nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(component.dateControl.value).toEqual({
          day: 12,
          month: 2,
          year: 2015,
        });
        expect(component.dateControl.valid).toBe(true);

        flush();
      }));

      it('should open the calendar to the current date when an invalid date is input', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);

        clickDatepickerButton(fixture);

        const today = new Date();
        const todayDateString = moment().format('MMMM YYYY');

        expect(getCalendarTitle()).toHaveText(todayDateString);
        expect(getSelectedCalendarItem()).toHaveText(
          today.getDate().toString().padStart(2, '0'),
        );

        flush();
      }));

      it('should validate properly when an invalid date format is passed through input change', fakeAsync(() => {
        fixture.componentInstance.dateFormat = 'MM/DD/YYYY';
        detectChanges(fixture);
        setInputElementValue(nativeElement, '2015/2/12', fixture);

        expect(getInputElementValue(fixture)).toBe('2015/2/12');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(
          component.dateControl.errors?.['skyFuzzyDate'].invalid,
        ).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(component.dateControl.errors).toBeNull();
        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it(`should validate properly when futureDisabled = true and a future date is passed through input change`, fakeAsync(() => {
        fixture.componentInstance.futureDisabled = true;
        detectChanges(fixture);
        const futureDateString = moment().add(1, 'days').format('L');
        setInputElementValue(nativeElement, futureDateString, fixture);

        expect(getInputElementValue(fixture)).toBe(futureDateString);
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(
          component.dateControl.errors?.['skyFuzzyDate'].futureDisabled,
        ).toBeTruthy();

        const todayDateString = moment().format('L');
        setInputElementValue(nativeElement, todayDateString, fixture);

        expect(getInputElementValue(fixture)).toBe(todayDateString);
        expect(component.dateControl.errors).toBeNull();
        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should validate properly when year is required and values are passed through input change', fakeAsync(() => {
        fixture.componentInstance.yearRequired = true;
        detectChanges(fixture);
        setInputElementValue(nativeElement, '2/12', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(
          component.dateControl.errors?.['skyFuzzyDate'].yearRequired,
        ).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(component.dateControl.errors).toBeNull();
        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdef', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdef');
        expect(component.dateControl.value).toBe('abcdef');
        expect(component.dateControl.valid).toBe(true);

        flush();
      }));
    });

    describe('min max fuzzy date', () => {
      it('should validate properly when the date is passed through input change beyond the max fuzzy date', fakeAsync(() => {
        fixture.componentInstance.maxDate = { month: 2, day: 15, year: 2015 };
        detectChanges(fixture);
        setInputElementValue(nativeElement, '2/16/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/16/2015');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(
          component.dateControl.errors?.['skyFuzzyDate'].maxDate,
        ).toBeTruthy();

        setInputElementValue(nativeElement, '2/15/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/15/2015');
        expect(component.dateControl.errors).toBeNull();
        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should validate properly when the date is passed through input change prior to the min fuzzy date', fakeAsync(() => {
        fixture.componentInstance.minDate = { month: 2, day: 15, year: 2015 };
        detectChanges(fixture);
        setInputElementValue(nativeElement, '2/14/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/14/2015');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(
          component.dateControl.errors?.['skyFuzzyDate'].minDate,
        ).toBeTruthy();

        setInputElementValue(nativeElement, '2/15/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/15/2015');
        expect(component.dateControl.errors).toBeNull();
        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should handle change above max fuzzy date passed on model change', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 5, day: 25, year: 2017 };
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/26/2017', fixture);

        expect(component.dateControl.valid).toBe(false);

        flush();
      }));

      it('should handle change below min fuzzy date passed on model change', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 5, day: 4, year: 2017 };
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/1/2017', fixture);

        expect(component.dateControl.valid).toBe(false);

        flush();
      }));

      it('should pass max date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 5, day: 25, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(27, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 5, day: 4, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass max date from config service to calendar when max fuzzy date is invalid', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 15, day: 35, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(30, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass min date from config service to calendar when min fuzzy date is invalid', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 15, day: 35, year: 2017 };
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');

        flush();
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.startingDay = 5;
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const firstDayCol = getCalendarColumn(0);
        expect(firstDayCol).toHaveText('Fr');

        flush();
      }));

      describe('startAtDate', () => {
        it('should be passed to calendar', fakeAsync(() => {
          fixture.detectChanges();
          setFormControlProperty(undefined, component, fixture);
          component.startAtDate = { year: 1995 };
          detectChanges(fixture);

          clickDatepickerButton(fixture);

          expect(getSelectedCalendarItem()).toHaveText('01');
          expect(getCalendarTitle()).toHaveText('January 1995');

          flush();
        }));
      });
    });

    describe('disabled state', () => {
      it('should disable the input and trigger button when disable is set to true', () => {
        fixture.detectChanges();
        component.dateControl.disable();
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeTruthy();
        expect(getTriggerButton(fixture)?.disabled).toBeTruthy();
      });

      it('should not disable the input and trigger button when disable is set to false', () => {
        fixture.detectChanges();
        component.dateControl.enable();
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeFalsy();
        expect(getTriggerButton(fixture)?.disabled).toBeFalsy();
      });
    });
  });

  describe('overriding SkyAppLocaleProvider', () => {
    let fixture: ComponentFixture<FuzzyDatepickerNoFormatTestComponent>;
    let component: FuzzyDatepickerNoFormatTestComponent;
    let localeProvider: SkyAppLocaleProvider;

    beforeEach(inject([SkyAppLocaleProvider], (p: SkyAppLocaleProvider) => {
      localeProvider = p;
    }));

    it('should display formatted date based on locale by default', fakeAsync(() => {
      spyOn(localeProvider, 'getLocaleInfo').and.returnValue(
        of({
          locale: 'es', // Set locale to Spanish.
        }),
      );
      fixture = TestBed.createComponent(FuzzyDatepickerNoFormatTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      setInputProperty(new Date(2017, 9, 24), component, fixture);

      // Expect spanish default format of DD/MM/YYYY.
      expect(getInputElementValue(fixture)).toBe('24/10/2017');

      flush();
    }));
  });

  describe('invalid date format/year required configuration', () => {
    it('should throw an error if yearRequired conflicts with the dateFormat', fakeAsync(() => {
      const fixture = TestBed.createComponent(FuzzyDatepickerTestComponent);
      const component = fixture.componentInstance;

      component.yearRequired = true;
      component.dateFormat = 'MM/DD';
      expect(() => detectChanges(fixture)).toThrowError(
        'You have configured conflicting settings. Year is required and dateFormat does not include year.',
      );
    }));
  });
});
