import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { SkyDatepickerConfigService } from './datepicker-config.service';
import { SkyDatepickerComponent } from './datepicker.component';
import { DatepickerInputBoxTestComponent } from './fixtures/datepicker-input-box.component.fixture';
import { DatepickerNoFormatTestComponent } from './fixtures/datepicker-noformat.component.fixture';
import { DatepickerReactiveTestComponent } from './fixtures/datepicker-reactive.component.fixture';
import { DatepickerTestComponent } from './fixtures/datepicker.component.fixture';
import { DatepickerTestModule } from './fixtures/datepicker.module.fixture';

// #region helpers
export class MyLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    const obs = new BehaviorSubject<any>({});

    // Simulate HTTP call.
    setTimeout(() => {
      obs.next({
        locale: 'es',
      });
    }, 1000);

    return obs;
  }
}

const isoFormat = 'YYYY-MM-DDTHH:mm:ss';

const isoFormatWithOffset = 'YYYY-MM-DDThh:mm:ss.SZ';

let mockThemeSvc: {
  settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
};

function detectChanges(fixture: ComponentFixture<any>): void {
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
  tick();
}

function getTriggerButton(fixture: ComponentFixture<any>): HTMLButtonElement {
  return fixture.nativeElement.querySelector(
    '.sky-input-group-datepicker-btn'
  ) as HTMLButtonElement;
}

function clickTrigger(
  fixture: ComponentFixture<any>,
  isfakeAsync: boolean = true
): void {
  getTriggerButton(fixture).click();
  if (isfakeAsync) {
    detectChanges(fixture);
  }
}

function setInputProperty(
  value: any,
  component: any,
  fixture: ComponentFixture<any>
): void {
  component.selectedDate = value;
  detectChanges(fixture);
}

function setInputElementValue(
  element: HTMLElement,
  text: string,
  fixture: ComponentFixture<any>
): void {
  const inputEl = getInputElement(fixture);
  inputEl.value = text;
  fixture.detectChanges();
  SkyAppTestUtility.fireDomEvent(inputEl, 'change');
  detectChanges(fixture);
}

function blurInput(element: HTMLElement, fixture: ComponentFixture<any>): void {
  const inputEl = element.querySelector('input');
  SkyAppTestUtility.fireDomEvent(inputEl, 'blur');
  detectChanges(fixture);
}

function setFormControlProperty(
  value: any,
  component: any,
  fixture: ComponentFixture<any>
): void {
  component.dateControl.setValue(value);
  detectChanges(fixture);
}

function getInputElement(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function getInputElementValue(fixture: ComponentFixture<any>): string {
  return getInputElement(fixture).value;
}

function getCalendar(): HTMLElement {
  return document.querySelector('.sky-datepicker-calendar-container');
}

function getCalendarDayButton(
  index: number,
  fixture: ComponentFixture<any>
): HTMLButtonElement {
  return document
    .querySelectorAll('tbody tr td .sky-btn-default')
    .item(index) as HTMLButtonElement;
}

function clickCalendarDateButton(
  index: number,
  fixture: ComponentFixture<any>
): void {
  getCalendarDayButton(index, fixture).click();
  detectChanges(fixture);
}

function getCalendarColumn(
  index: number,
  fixture: ComponentFixture<any>
): HTMLElement {
  return document
    .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays')
    .item(0) as HTMLElement;
}

function getCalendarTitle(fixture: ComponentFixture<any>): HTMLElement {
  return document.querySelector(
    '.sky-datepicker-calendar-title'
  ) as HTMLElement;
}

function clickCalendarTitle(fixture: ComponentFixture<any>): void {
  getCalendarTitle(fixture).click();
  detectChanges(fixture);
}

function getSelectedCalendarItem(): HTMLElement {
  return document.querySelector('.sky-datepicker-btn-selected') as HTMLElement;
}
// #endregion

describe('datepicker', () => {
  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [DatepickerTestModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    // Suppress console warnings in test logs.
    spyOn(console, 'warn');
  });

  describe('nonstandard configuration', () => {
    let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
    let component: DatepickerNoFormatTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(function () {
      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: {
                dateFormat: 'DD/MM/YYYY',
              },
            },
          ],
        },
      }).createComponent(DatepickerNoFormatTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should handle different format from configuration', fakeAsync(() => {
      detectChanges(fixture);

      setInputElementValue(nativeElement, '5/12/2017', fixture);

      // Expect date to be December 5th (NOT May 12th).
      expect(getInputElementValue(fixture)).toBe('05/12/2017');
      expect(component.selectedDate).toEqual(new Date(2017, 11, 5));
    }));
  });

  describe('standard configuration', () => {
    let fixture: ComponentFixture<DatepickerTestComponent>;
    let component: DatepickerTestComponent;
    let nativeElement: HTMLElement;

    // After implementing input box, it was necessary to use `tick()` to force the datepicker
    // elements to render, which is why `fakeAsync()` and the call to the custom `detectChanges()`
    // function are used here.
    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(DatepickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      // Default to US long date format to avoid any test runners that are using a different locale.
      component.dateFormat = 'MM/DD/YYYY';

      detectChanges(fixture);
    }));

    it('should throw an error if directive is added in isolation', function () {
      try {
        component.showInvalidDirective = true;
        fixture.detectChanges();
      } catch (err) {
        expect(err.message).toContain('skyDatepickerInput');
      }
    });

    it('should mark the control as dirty on keyup', function () {
      fixture.detectChanges();
      const inputElement = fixture.debugElement.query(By.css('input'));
      const ngModel = inputElement.injector.get(NgModel);

      expect(ngModel.dirty).toEqual(false);

      SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'keyup');
      fixture.detectChanges();

      expect(ngModel.dirty).toEqual(true);
    });

    it('should create the component with the appropriate styles', () => {
      fixture.detectChanges();

      expect(getInputElement(fixture)).toHaveCssClass('sky-form-control');
      expect(getTriggerButton(fixture)).not.toBeNull();
    });

    it('should apply aria-label to the datepicker input when none is provided', () => {
      fixture.detectChanges();

      expect(getInputElement(fixture).getAttribute('aria-label')).toBe('Date');
    });

    it('should not overwrite aria-label on the datepicker input when one is provided', () => {
      getInputElement(fixture).setAttribute(
        'aria-label',
        'This is a date field.'
      );
      fixture.detectChanges();

      expect(getInputElement(fixture).getAttribute('aria-label')).toBe(
        'This is a date field.'
      );
    });

    it('should keep the calendar visible on mode change', fakeAsync(() => {
      fixture.detectChanges();

      clickTrigger(fixture);

      const calendar = getCalendar();
      expect(calendar).not.toBeNull();
      expect(calendar.getAttribute('hidden')).toBeNull();

      clickCalendarTitle(fixture);

      expect(calendar).not.toBeNull();
      expect(calendar.getAttribute('hidden')).toBeNull();
    }));

    it('should pass date back when date is selected in calendar', fakeAsync(() => {
      setInputProperty(new Date('5/12/2017'), component, fixture);
      clickTrigger(fixture);

      expect(getSelectedCalendarItem()).toHaveText('12');
      expect(getCalendarTitle(fixture)).toHaveText('May 2017');

      // Click May 2nd
      clickCalendarDateButton(2, fixture);

      expect(component.selectedDate).toEqual(new Date('5/2/2017'));
      expect(getInputElementValue(fixture)).toBe('05/02/2017');
    }));

    it('should close picker when `escape` key is pressed', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      clickTrigger(fixture);

      SkyAppTestUtility.fireDomEvent(window.document, 'keydown', {
        customEventInit: {
          key: 'escape',
        },
      });
      fixture.detectChanges();
      tick();
      const picker = getCalendar();

      expect(picker).toBeNull();
    }));

    it('should close picker when clicking on a dackdrop', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      clickTrigger(fixture);

      document.body.click();
      fixture.detectChanges();
      tick();
      const picker = getCalendar();

      expect(picker).toBeNull();
    }));

    it('should close picker when clicking trigger button again', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      clickTrigger(fixture);

      let picker = getCalendar();
      expect(picker).toBeTruthy();

      clickTrigger(fixture);

      picker = getCalendar();
      expect(picker).toBeNull();
    }));

    it('should hide when datepicker is scrolled off screen', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      clickTrigger(fixture);

      const affixer = component.datepicker['affixer'];
      affixer['_placementChange'].next({ placement: null });
      fixture.detectChanges();
      tick();

      expect(component.datepicker.isVisible).toBe(false);
    }));

    it('should handle non-keyboard events', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      clickTrigger(fixture);

      SkyAppTestUtility.fireDomEvent(window.document, 'keydown', {
        customEventInit: {
          key: undefined,
        },
      });
      fixture.detectChanges();
      tick();
      const picker = getCalendar();

      expect(picker).not.toBeNull();
    }));

    it('should be accessible', async () => {
      fixture.detectChanges();
      clickTrigger(fixture, false);
      fixture.detectChanges();

      // Due to the nature of the calendar popup and this being an async test,
      // we need a couple whenStable() blocks to ensure the calendar is showing.
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should display the expected calendar icon in the calendar button', fakeAsync(() => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      detectChanges(fixture);
      tick();
      fixture.whenStable();

      const iconDefault = fixture.nativeElement.querySelector(
        '.sky-input-group-datepicker-btn .sky-icon'
      );

      expect(iconDefault).toHaveCssClass('fa-calendar');

      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });

      detectChanges(fixture);
      tick();
      fixture.whenStable();

      const iconModern = fixture.nativeElement.querySelector(
        '.sky-input-group-datepicker-btn .sky-icon'
      );

      expect(iconModern).toHaveCssClass('sky-i-calendar');
    }));

    it('should show a default placeholder of the default date format', fakeAsync(() => {
      component.selectedDate = undefined;
      detectChanges(fixture);

      expect(getInputElement(fixture).getAttribute('placeholder')).toEqual(
        'MM/DD/YYYY'
      );
    }));

    it('should show a placeholder of the consumer provided date format', fakeAsync(() => {
      component.selectedDate = undefined;
      component.dateFormat = 'DD/MM/YY';
      detectChanges(fixture);
      detectChanges(fixture);

      expect(getInputElement(fixture).getAttribute('placeholder')).toBe(
        'DD/MM/YY'
      );
    }));

    it('should allow consumer to override the default placeholder', fakeAsync(() => {
      component.selectedDate = undefined;
      getInputElement(fixture).setAttribute('placeholder', 'DD/MM/YY');
      detectChanges(fixture);

      expect(getInputElement(fixture).getAttribute('placeholder')).toBe(
        'DD/MM/YY'
      );
    }));

    describe('initialization', () => {
      it('should handle initializing with a Date object', fakeAsync(() => {
        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
      }));

      it('should handle initializing with a string with the expected format', fakeAsync(() => {
        setInputProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('05/12/2017'));
      }));

      it('should handle initializing with a ISO string', fakeAsync(() => {
        setInputProperty('2009-06-15T00:00:01', component, fixture);

        expect(getInputElementValue(fixture)).toBe('06/15/2009');
        expect(component.selectedDate).toEqual(
          moment('2009-06-15T00:00:01', isoFormat).toDate()
        );
      }));

      it('should handle initializing with an ISO string with offset', fakeAsync(() => {
        setInputProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate).toEqual(
          moment('1994-11-05T08:15:30-05:00', isoFormatWithOffset).toDate()
        );
      }));

      it('should handle two digit years', fakeAsync(() => {
        setInputProperty('5/12/17', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('05/12/2017'));
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('5/12/2017'));
      }));

      it('should handle input change with a ISO string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2009-06-15T00:00:01', fixture);

        expect(getInputElementValue(fixture)).toBe('06/15/2009');
        expect(component.selectedDate).toEqual(
          moment('2009-06-15T00:00:01', isoFormat).toDate()
        );
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(
          nativeElement,
          '1994-11-05T08:15:30-05:00',
          fixture
        );

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate).toEqual(
          moment('1994-11-05T08:15:30-05:00', isoFormatWithOffset).toDate()
        );
      }));

      it('should handle two digit years', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.selectedDate).toEqual(new Date('05/12/1998'));
      }));

      it('should handle undefined date', fakeAsync(() => {
        setInputProperty('5/12/17', component, fixture);
        setInputProperty(undefined, component, fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');
      }));

      it('should pass date to calendar', fakeAsync(() => {
        detectChanges(fixture);
        setInputElementValue(nativeElement, '5/12/2017', fixture);

        clickTrigger(fixture);

        expect(getCalendarTitle(fixture)).toHaveText('May 2017');
        expect(getSelectedCalendarItem()).toHaveText('12');
      }));
    });

    describe('formats', () => {
      it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'DD/MM/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('12/05/2017'));

        component.dateFormat = 'MM/DD/YYYY';
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('12/05/2017');
        expect(component.selectedDate).toEqual(new Date('12/05/2017'));
      }));
    });

    describe('model change', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = inputElement.injector.get(NgModel);
      });

      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('5/12/2017'));
      }));

      it('should handle model change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('2009-06-15T00:00:01', component, fixture);

        expect(getInputElementValue(fixture)).toBe('06/15/2009');
        expect(component.selectedDate).toEqual(
          moment('2009-06-15T00:00:01', isoFormat).toDate()
        );
      }));

      it('should handle model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate).toEqual(
          moment('1994-11-05T08:15:30-05:00', isoFormatWithOffset).toDate()
        );
      }));

      it('should handle model change with an ISO string containing milliseconds', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('1994-11-05T08:15:30.62', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate).toEqual(
          moment('1994-11-05T08:15:30.62', isoFormatWithOffset).toDate()
        );
      }));

      it('should attempt to convert poorly formatted date to ISO when strict is false', fakeAsync(() => {
        fixture.detectChanges();
        const expectedISODate = moment('13/11/2019', isoFormat).toDate();
        setInputProperty('13/11/2019', component, fixture);

        // '13/11/2019' should get converted to '11/20/2013'.
        expect(getInputElementValue(fixture)).toBe('11/20/2013');
        expect(component.selectedDate).toEqual(expectedISODate);
        expect(ngModel.valid).toEqual(true);
      }));

      it('should NOT attempt to convert poorly formatted date to ISO and be invalid when strict is true', fakeAsync(() => {
        component.strict = true;
        fixture.detectChanges();
        setInputProperty('13/11/2019', component, fixture);

        // '13/11/2019' should be seen as an invalid date, based on the formatting.
        expect(getInputElementValue(fixture)).toBe('13/11/2019');
        expect(component.selectedDate).toEqual('13/11/2019');
        expect(ngModel.valid).toEqual(false);
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('5/12/98', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.selectedDate).toEqual(new Date('05/12/1998'));
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
        setInputElementValue(nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.pristine).toBe(false);
        expect(ngModel.touched).toBe(true);
      }));

      it('should validate properly when invalid date on initialization', fakeAsync(() => {
        setInputProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
      }));

      it('should validate properly when invalid string on model change', fakeAsync(() => {
        detectChanges(fixture);

        setInputProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
        expect(ngModel.valid).toBe(false);
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);
        const invalidDate = new Date('abcdebf');

        component.selectedDate = invalidDate;
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('Invalid date');
        expect(component.selectedDate).toBe(invalidDate);
        expect(ngModel.valid).toBe(false);
      }));

      it('should validate properly when a non-convertable date is passed through input change', fakeAsync(() => {
        detectChanges(fixture);
        setInputElementValue(nativeElement, '133320', fixture);

        expect(getInputElementValue(fixture)).toBe('133320');
        expect(component.selectedDate).toBe('133320');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.pristine).toBe(false);
        expect(ngModel.touched).toBe(true);
      }));

      it('should validate properly when a non-convertable date on initialization', fakeAsync(() => {
        setInputProperty('133320', component, fixture);

        expect(getInputElementValue(fixture)).toBe('133320');
        expect(component.selectedDate).toBe('133320');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
      }));

      it('should validate properly when a non-convertable date on model change', fakeAsync(() => {
        detectChanges(fixture);

        setInputProperty('133320', component, fixture);

        expect(getInputElementValue(fixture)).toBe('133320');
        expect(component.selectedDate).toBe('133320');
        expect(ngModel.valid).toBe(false);
      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '', fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(component.selectedDate).toBe('');
        expect(ngModel.valid).toBe(true);
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(component.selectedDate).toEqual(new Date('2/12/2015'));
        expect(ngModel.valid).toBe(true);
      }));

      it('should handle calendar date on invalid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        clickTrigger(fixture);

        // Current day should be selected.
        const dayOfMonth = ('0' + new Date().getDate()).slice(-2);
        expect(getSelectedCalendarItem()).toHaveText(dayOfMonth);
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
        expect(ngModel.valid).toBe(true);
      }));
    });

    describe('shortcut functionality', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = inputElement.injector.get(NgModel);
      });

      it(`should validate properly when a integer is given but is outside the current month's number of days`, fakeAsync(() => {
        detectChanges(fixture);

        setInputProperty('1995', component, fixture);

        expect(getInputElementValue(fixture)).toBe('1995');
        expect(component.selectedDate).toBe('1995');
        expect(ngModel.valid).toBe(false);
      }));

      it(`should validate properly when a zero is given`, fakeAsync(() => {
        detectChanges(fixture);

        setInputProperty('0', component, fixture);

        expect(getInputElementValue(fixture)).toBe('0');
        expect(component.selectedDate).toBe('0');
        expect(ngModel.valid).toBe(false);
      }));

      it(`should validate properly when a negative number is given`, fakeAsync(() => {
        detectChanges(fixture);

        setInputProperty('-1', component, fixture);

        expect(getInputElementValue(fixture)).toBe('-1');
        expect(component.selectedDate).toBe('-1');
        expect(ngModel.valid).toBe(false);
      }));

      it(`should convert an integer in the current month to a date in that month`, fakeAsync(() => {
        detectChanges(fixture);

        const currentDate = new Date();
        const monthString = (currentDate.getMonth() + 1).toLocaleString(
          'en-US',
          {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }
        );

        setInputProperty('15', component, fixture);

        const expectedDateString =
          monthString + '/15/' + currentDate.getFullYear();
        expect(getInputElementValue(fixture)).toBe(expectedDateString);
        expect(component.selectedDate).toEqual(new Date(expectedDateString));
        expect(ngModel.valid).toBe(true);
      }));

      it(`should not convert an integer not in the current month but that is valid for another month`, fakeAsync(() => {
        detectChanges(fixture);

        const baseTime = new Date('2/2/22');
        jasmine.clock().mockDate(baseTime);

        setInputProperty('30', component, fixture);

        expect(getInputElementValue(fixture)).toBe('30');
        expect(component.selectedDate).toEqual('30');
        expect(ngModel.valid).toBe(false);
      }));
    });

    describe('min max date', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = inputElement.injector.get(NgModel);
      });

      it('should handle change above max date', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = new Date('5/25/2017');
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/26/2017', fixture);

        expect(ngModel.valid).toBe(false);
      }));

      it('should handle change below min date', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = new Date('5/4/2017');
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/1/2017', fixture);

        expect(ngModel.valid).toBe(false);
      }));

      it('should pass max date to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = new Date('5/25/2017');
        detectChanges(fixture);

        clickTrigger(fixture);

        const dateButtonEl = getCalendarDayButton(30, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = new Date('5/4/2017');
        detectChanges(fixture);

        clickTrigger(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.startingDay = 5;
        detectChanges(fixture);

        clickTrigger(fixture);

        const firstDayCol = getCalendarColumn(0, fixture);
        expect(firstDayCol.textContent).toContain('Fr');
      }));
    });

    describe('custom dates', () => {
      const initialDate = '11/5/1955';
      beforeEach(fakeAsync(() => {
        setInputProperty(initialDate, component, fixture);
      }));

      it('should not set custom dates by default', async () => {
        clickTrigger(fixture, false);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.datepicker.customDates).toBeUndefined();
      });

      it('should set custom dates when an observable is passed back to the change event arguments', async () => {
        component.showCustomDates = true;

        clickTrigger(fixture, false);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.datepicker.customDates).not.toBeUndefined();
      });

      it('should remove custom dates when they exist from a prior event, but then the latest event does not have a defined customDates arg', fakeAsync(() => {
        component.showCustomDates = true;

        clickTrigger(fixture);
        tick(2000); // Trigger 2s fake async call in fixture.
        fixture.detectChanges();

        const disabledButtons: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-disabled');
        const keyDateButtons: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-key-date');

        expect(disabledButtons.length).toBeGreaterThan(0);
        expect(keyDateButtons.length).toBeGreaterThan(0);

        // Click document body to close the picker.
        document.body.click();

        // Turn off custom dates.
        component.showCustomDates = false;

        clickTrigger(fixture);
        tick(2000); // Trigger 2s fake async call in fixture.
        fixture.detectChanges();

        const disabledButtonsNew: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-disabled');
        const keyDateButtonsNew: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-key-date');

        expect(disabledButtonsNew.length).toEqual(0);
        expect(keyDateButtonsNew.length).toEqual(0);
      }));

      it('should not add disabled and key-date CSS classes when custom date is not set', fakeAsync(() => {
        component.showCustomDates = false;

        clickTrigger(fixture);
        tick(2000); // Trigger 2s fake async call in fixture.
        fixture.detectChanges();

        const disabledButtons: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-disabled');
        const keyDateButtons: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-key-date');

        expect(disabledButtons.length).toEqual(0);
        expect(keyDateButtons.length).toEqual(0);
      }));

      it('should add disabled and key-date CSS classes when custom date is set', fakeAsync(() => {
        component.showCustomDates = true;

        clickTrigger(fixture);
        tick(2000); // Trigger 2s fake async call in fixture.
        fixture.detectChanges();

        const disabledButtons: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-disabled');
        const keyDateButtons: NodeListOf<HTMLElement> =
          document.querySelectorAll('.sky-datepicker-btn-key-date');

        expect(disabledButtons.length).toBeGreaterThan(0);
        expect(keyDateButtons.length).toBeGreaterThan(0);
      }));
    });

    describe('disabled state', () => {
      it(
        'should disable the input and trigger button when disabled is set to true ' +
          'and enable them when disabled is changed to false',
        fakeAsync(() => {
          component.isDisabled = true;
          detectChanges(fixture);
          const triggerButton = getTriggerButton(fixture);

          expect(
            fixture.componentInstance.inputDirective.disabled
          ).toBeTruthy();
          expect(fixture.componentInstance.datepicker.disabled).toBeTruthy();
          expect(
            fixture.debugElement.query(By.css('input')).nativeElement.disabled
          ).toBeTruthy();
          expect(triggerButton.disabled).toBeTruthy();

          component.isDisabled = false;
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
          expect(fixture.componentInstance.datepicker.disabled).toBeFalsy();
          expect(
            fixture.debugElement.query(By.css('input')).nativeElement.disabled
          ).toBeFalsy();
          expect(triggerButton.disabled).toBeFalsy();
        })
      );
    });

    describe('detectInputValueChange', () => {
      it('updates selectedDate without a change event', fakeAsync(() => {
        const inputEl = getInputElement(fixture);
        const initialDate = '01/01/2019';
        const newDate = '12/31/2019';
        setInputProperty(initialDate, component, fixture);

        expect(getInputElementValue(fixture)).toBe(initialDate);
        expect(component.selectedDate).toEqual(new Date(initialDate));

        inputEl.value = newDate;

        expect(getInputElementValue(fixture)).toBe(newDate);
        expect(component.selectedDate).toEqual(new Date(initialDate));

        component.inputDirective.detectInputValueChange();

        expect(getInputElementValue(fixture)).toBe(newDate);
        expect(component.selectedDate).toEqual(new Date(newDate));
      }));
    });

    describe('focus properties', () => {
      // We've removed fakeAsync from this test because the neseted setTimeouts()
      // in the setter for calendarRef have trouble with fakeAsync.
      it('should focus on the calendar when the trigger button is clicked', (done) => {
        fixture.detectChanges();

        clickTrigger(fixture, false);

        setTimeout(() => {
          fixture.detectChanges();
          setTimeout(() => {
            fixture.detectChanges();
            setTimeout(() => {
              fixture.detectChanges();
              const calendar = getCalendar();
              expect(calendar.contains(document.activeElement)).toEqual(true);
              done();
            });
          });
        });
      });

      it('should focus back on the trigger button when a selection is made', fakeAsync(() => {
        detectChanges(fixture);
        clickTrigger(fixture);
        const trigger = getTriggerButton(fixture);
        const day = getCalendarDayButton(0, fixture);

        day.click();
        detectChanges(fixture);

        expect(document.activeElement).toEqual(trigger);
      }));

      it('should properly update buttonIsFocused when the button focused state changes', fakeAsync(() => {
        detectChanges(fixture);
        const buttonEl = getTriggerButton(fixture);

        expect(component.datepicker.buttonIsFocused).toBe(false);

        buttonEl.focus();
        fixture.detectChanges();

        expect(component.datepicker.buttonIsFocused).toBe(true);
      }));

      // We've removed fakeAsync from this test because the neseted setTimeouts()
      // in the setter for calendarRef have trouble with fakeAsync.
      it('should properly update calendarIsFocused when the calendar focused state changes', (done) => {
        fixture.detectChanges();
        expect(component.datepicker.calendarIsFocused).toBe(false);

        clickTrigger(fixture, false);

        setTimeout(() => {
          fixture.detectChanges();
          setTimeout(() => {
            fixture.detectChanges();
            setTimeout(() => {
              fixture.detectChanges();
              // Calendar should be automatically focused after clicking the trigger button.
              expect(component.datepicker.calendarIsFocused).toBe(true);

              // Click document body to close the picker.
              document.body.click();

              setTimeout(() => {
                fixture.detectChanges();
                setTimeout(() => {
                  fixture.detectChanges();
                  setTimeout(() => {
                    fixture.detectChanges();
                    // Calendar should be automatically focused after clicking the trigger button.
                    expect(component.datepicker.calendarIsFocused).toBe(false);
                    done();
                  });
                });
              });
            });
          });
        });
      });

      it('should properly update inputIsFocused when the input focus state changes', fakeAsync(() => {
        detectChanges(fixture);
        const inputEl = getInputElement(fixture);

        expect(inputEl).toBeDefined();
        expect(component.inputDirective.inputIsFocused).toBe(false);

        inputEl.focus();
        fixture.detectChanges();

        expect(component.inputDirective.inputIsFocused).toBe(true);
      }));
    });

    describe('calendarIsVisible property', () => {
      it('should reflect the visibility of the calendar element', fakeAsync(() => {
        fixture.detectChanges();

        expect(component.datepicker.calendarIsVisible).toBe(false);

        clickTrigger(fixture);

        expect(component.datepicker.calendarIsVisible).toBe(true);
      }));
    });

    describe('overlay wrapperClass', () => {
      it('should pass a wrapper class to the overlay', fakeAsync(() => {
        component.datepicker.pickerClass = 'example-class';
        fixture.detectChanges();
        clickTrigger(fixture);
        const overlay = document.querySelector('.sky-overlay');
        expect(overlay).toHaveCssClass('example-class');
      }));
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<DatepickerReactiveTestComponent>;
    let component: DatepickerReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(DatepickerReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      // Default to US long date format to avoid any test runners that are using a different locale.
      component.dateFormat = 'MM/DD/YYYY';

      detectChanges(fixture);
    }));

    describe('initial value', () => {
      it('should set the initial value correctly', fakeAsync(() => {
        fixture = TestBed.createComponent(DatepickerReactiveTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        component = fixture.componentInstance;

        // Default to US long date format to avoid any test runners that are using a different locale.
        component.dateFormat = 'MM/DD/YYYY';

        component.initialValue = '5/12/2017';
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
      }));

      it('should handle input change with a ISO string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2009-06-15T00:00:01', fixture);

        expect(getInputElementValue(fixture)).toBe('06/15/2009');
        expect(component.dateControl.value).toEqual(
          moment('2009-06-15T00:00:01', isoFormat).toDate()
        );
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(
          nativeElement,
          '1994-11-05T08:15:30-05:00',
          fixture
        );

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.dateControl.value).toEqual(
          moment('1994-11-05T08:15:30-05:00', isoFormatWithOffset).toDate()
        );
      }));

      it('should handle two digit years', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.dateControl.value).toEqual(new Date('05/12/1998'));
      }));

      it('should handle undefined date', fakeAsync(() => {
        detectChanges(fixture);

        setFormControlProperty('5/12/17', component, fixture);
        setFormControlProperty(undefined, component, fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');
      }));

      it('should pass date to calendar', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);
        clickTrigger(fixture);

        expect(getCalendarTitle(fixture)).toHaveText('May 2017');
        expect(getSelectedCalendarItem()).toHaveText('12');
      }));
    });

    describe('model change', () => {
      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
      }));

      it('should handle model change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('2009-06-15T00:00:01', component, fixture);

        expect(getInputElementValue(fixture)).toBe('06/15/2009');
        expect(component.dateControl.value).toEqual(
          moment('2009-06-15T00:00:01', isoFormat).toDate()
        );
      }));

      it('should handle model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.dateControl.value).toEqual(
          moment('1994-11-05T08:15:30-05:00', isoFormatWithOffset).toDate()
        );
      }));

      it('should attempt to convert poorly formatted date to ISO when strict is false', fakeAsync(() => {
        fixture.detectChanges();
        const expectedISODate = moment('13/11/2019', isoFormat).toDate();
        setFormControlProperty('13/11/2019', component, fixture);

        // '13/11/2019' should get converted to '11/20/2013'.
        expect(getInputElementValue(fixture)).toBe('11/20/2013');
        expect(component.dateControl.value).toEqual(expectedISODate);
        expect(component.dateControl.valid).toEqual(true);
      }));

      it('should NOT attempt to convert poorly formatted date to ISO and be invalid when strict is true', fakeAsync(() => {
        component.strict = true;
        fixture.detectChanges();
        setFormControlProperty('13/11/2019', component, fixture);

        // '13/11/2019' should be seen as an invalid date, based on the formatting.
        expect(getInputElementValue(fixture)).toBe('13/11/2019');
        expect(component.dateControl.value).toEqual('13/11/2019');
        expect(component.dateControl.valid).toEqual(false);
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('5/12/98', component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/1998');
        expect(component.dateControl.value).toEqual(new Date('05/12/1998'));
      }));
    });

    describe('Angular form control statuses', () => {
      it('should set correct statuses when initialized without value', fakeAsync(() => {
        fixture.componentInstance.initialValue = undefined;
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);
      }));

      it('should set correct statuses when initialized with value', fakeAsync(() => {
        fixture.componentInstance.initialValue = '1/1/2000';
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);
      }));

      it('should set correct statuses after user types within input', fakeAsync(() => {
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        setInputElementValue(nativeElement, '1/1/2000', fixture);
        blurInput(nativeElement, fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
      }));

      it('should set correct statuses after user selects from calendar', fakeAsync(() => {
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        clickTrigger(fixture);
        getSelectedCalendarItem().click();
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
      }));
    });

    describe('validation', () => {
      it('should validate properly when invalid date is passed through input change', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
      }));

      it('should validate properly when invalid date on initialization', fakeAsync(() => {
        fixture.detectChanges();

        setFormControlProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');

        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);

        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.touched).toBe(true);
      }));

      it('should validate properly when invalid string on model change', fakeAsync(() => {
        detectChanges(fixture);

        setFormControlProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
        expect(component.dateControl.valid).toBe(false);
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);
        const invalidDate = new Date('abcdebf');

        setFormControlProperty(invalidDate, component, fixture);

        expect(getInputElementValue(fixture)).toBe('Invalid date');
        expect(component.dateControl.value).toBe(invalidDate);
        expect(component.dateControl.valid).toBe(false);
      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '', fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(component.dateControl.value).toBe('');
        expect(component.dateControl.valid).toBe(true);
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('02/12/2015');
        expect(component.dateControl.value).toEqual(new Date('2/12/2015'));
        expect(component.dateControl.valid).toBe(true);
      }));

      it('should handle calendar date on invalid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        clickTrigger(fixture);

        // Current day should be selected.
        const dayOfMonth = ('0' + new Date().getDate()).slice(-2);
        expect(getSelectedCalendarItem()).toHaveText(dayOfMonth);
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
        expect(component.dateControl.valid).toBe(true);
      }));
    });

    describe('shortcut functionality', () => {
      it(`should validate properly when a integer is given but is outside the current month's number of days`, fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '1995', fixture);

        expect(getInputElementValue(fixture)).toBe('1995');
        expect(component.dateControl.value).toBe('1995');
        expect(component.dateControl.valid).toBe(false);
      }));

      it(`should validate properly when a zero is given`, fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '0', fixture);

        expect(getInputElementValue(fixture)).toBe('0');
        expect(component.dateControl.value).toBe('0');
        expect(component.dateControl.valid).toBe(false);
      }));

      it(`should validate properly when a negative number is given`, fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '-1', fixture);

        expect(getInputElementValue(fixture)).toBe('-1');
        expect(component.dateControl.value).toBe('-1');
        expect(component.dateControl.valid).toBe(false);
      }));

      it(`should convert an integer in the current month to a date in that month`, fakeAsync(() => {
        detectChanges(fixture);

        const currentDate = new Date();
        const monthString = (currentDate.getMonth() + 1).toLocaleString(
          'en-US',
          {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }
        );

        setInputElementValue(fixture.nativeElement, '15', fixture);

        const expectedDateString =
          monthString + '/15/' + currentDate.getFullYear();
        expect(getInputElementValue(fixture)).toBe(expectedDateString);
        expect(component.dateControl.value).toEqual(
          new Date(expectedDateString)
        );
        expect(component.dateControl.valid).toBe(true);
      }));

      it(`should not convert an integer not in the current month but that is valid for another month`, fakeAsync(() => {
        detectChanges(fixture);

        const baseTime = new Date('2/2/22');
        jasmine.clock().mockDate(baseTime);

        setInputElementValue(fixture.nativeElement, '30', fixture);

        expect(getInputElementValue(fixture)).toBe('30');
        expect(component.dateControl.value).toEqual('30');
        expect(component.dateControl.valid).toBe(false);
      }));
    });

    describe('min max date', () => {
      it('should handle change above max date', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = new Date('5/25/2017');
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/26/2017', fixture);

        expect(component.dateControl.valid).toBe(false);
      }));

      it('should handle change below min date', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = new Date('5/4/2017');
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/1/2017', fixture);

        expect(component.dateControl.valid).toBe(false);
      }));

      it('should pass max date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = new Date('5/25/2017');
        detectChanges(fixture);

        clickTrigger(fixture);

        const dateButtonEl = getCalendarDayButton(30, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = new Date('5/4/2017');
        detectChanges(fixture);

        clickTrigger(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.startingDay = 5;
        detectChanges(fixture);

        clickTrigger(fixture);

        const firstDayCol = getCalendarColumn(0, fixture);
        expect(firstDayCol.textContent).toContain('Fr');
      }));
    });

    describe('disabled state', () => {
      it(
        'should disable the input and trigger button when disabled is set to true ' +
          'and enable them when disabled is changed to false',
        () => {
          fixture.detectChanges();
          component.isDisabled = true;
          fixture.detectChanges();
          const triggerButton = getTriggerButton(fixture);

          expect(
            fixture.componentInstance.inputDirective.disabled
          ).toBeTruthy();
          expect(fixture.componentInstance.datepicker.disabled).toBeTruthy();
          expect(
            fixture.debugElement.query(By.css('input')).nativeElement.disabled
          ).toBeTruthy();
          expect(triggerButton.disabled).toBeTruthy();

          fixture.detectChanges();
          component.isDisabled = false;
          fixture.detectChanges();

          expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
          expect(fixture.componentInstance.datepicker.disabled).toBeFalsy();
          expect(
            fixture.debugElement.query(By.css('input')).nativeElement.disabled
          ).toBeFalsy();
          expect(triggerButton.disabled).toBeFalsy();
        }
      );
    });
  });

  describe('overriding SkyAppLocaleProvider', () => {
    let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
    let component: DatepickerNoFormatTestComponent;
    let localProvider: SkyAppLocaleProvider;

    beforeEach(inject([SkyAppLocaleProvider], (p: SkyAppLocaleProvider) => {
      localProvider = p;
    }));

    it('should fall back to default locale if the locale provider doesnt return a value', fakeAsync(() => {
      spyOn(localProvider, 'getLocaleInfo').and.returnValue(
        of({
          locale: '',
        })
      );
      fixture = TestBed.createComponent(DatepickerNoFormatTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      setInputProperty(new Date(2017, 9, 24), component, fixture);

      // Expect US default format of MM/DD/YYYY.
      expect(getInputElementValue(fixture)).toBe('10/24/2017');
    }));

    it('should display formatted date based on locale by default', fakeAsync(() => {
      spyOn(localProvider, 'getLocaleInfo').and.returnValue(
        of({
          locale: 'es', // Set locale to Spanish.
        })
      );
      fixture = TestBed.createComponent(DatepickerNoFormatTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      setInputProperty(new Date(2017, 9, 24), component, fixture);

      // Expect spanish default format of DD/MM/YYYY.
      expect(getInputElementValue(fixture)).toBe('24/10/2017');
    }));
  });

  describe('inside input box', () => {
    it('should render in the expected input box containers', fakeAsync(() => {
      const fixture = TestBed.createComponent(DatepickerInputBoxTestComponent);

      detectChanges(fixture);

      const inputBoxEl = fixture.nativeElement.querySelector('sky-input-box');
      const inputEl = inputBoxEl.querySelector('input');
      const inputGroupBtnEl = inputBoxEl.querySelector(
        '.sky-input-group-btn > button'
      );

      expect(inputEl).toHaveCssClass('input-box-datepicker-input');
      expect(inputGroupBtnEl).toHaveCssClass('sky-input-group-datepicker-btn');
    }));
  });
});
