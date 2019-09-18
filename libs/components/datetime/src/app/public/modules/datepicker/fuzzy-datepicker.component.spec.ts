import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  NgModel
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDatepickerComponent
} from './datepicker.component';

import {
  FuzzyDatepickerTestComponent
} from './fixtures/fuzzy-datepicker.component.fixture';

import {
  FuzzyDatepickerTestModule
} from './fixtures/fuzzy-datepicker.module.fixture';

import {
  FuzzyDatepickerNoFormatTestComponent
} from './fixtures/fuzzy-datepicker-noformat.component.fixture';

import {
  FuzzyDatepickerReactiveTestComponent
} from './fixtures/fuzzy-datepicker-reactive.component.fixture';

const moment = require('moment');

// #region helpers
function detectChanges(fixture: ComponentFixture<any>): void {
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
  tick();
}

function getDatepickerButton(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-input-group .sky-input-group-btn .sky-dropdown-button') as HTMLElement;
}

function clickDatepickerButton(fixture: ComponentFixture<any>, isfakeAsync: boolean = true): void {
  getDatepickerButton(fixture).click();
  if (isfakeAsync) {
    detectChanges(fixture);
  }
}
function setInputProperty(value: any, component: any, fixture: ComponentFixture<any>): void {
  component.selectedDate = value;
  detectChanges(fixture);
}

function setInputElementValue(element: HTMLElement, text: string, fixture: ComponentFixture<any>): void {
  const inputEl = element.querySelector('input');
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

function setFormControlProperty(value: any, component: any, fixture: ComponentFixture<any>): void {
  component.dateControl.setValue(value);
  detectChanges(fixture);
}

function getInputElement(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function getInputElementValue(fixture: ComponentFixture<any>): string {
  return getInputElement(fixture).value;
}

function getCalendarDayButton(index: number, fixture: ComponentFixture<any>): HTMLButtonElement {
  return fixture.nativeElement.querySelectorAll('tbody tr td .sky-btn-default').item(index) as HTMLButtonElement;
}

function clickCalendarDateButton(index: number, fixture: ComponentFixture<any>): void {
  getCalendarDayButton(index, fixture).click();
  detectChanges(fixture);
}

function getCalendarColumn(index: number, fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;
}

function getCalendarTitle(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-datepicker-calendar-title') as HTMLElement;
}

function clickCalendarTitle(fixture: ComponentFixture<any>): void {
  getCalendarTitle(fixture).click();
  detectChanges(fixture);
}

function getSelectedCalendarItem(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('td .sky-datepicker-btn-selected') as HTMLElement;
}
// #endregion

describe('fuzzy datepicker input', () => {

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        FuzzyDatepickerTestModule
      ]
    });
  });

  describe('nonstandard configuration', () => {
    let fixture: ComponentFixture<FuzzyDatepickerNoFormatTestComponent>;
    let component: FuzzyDatepickerNoFormatTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(function () {
      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: {
                dateFormat: 'DD/MM/YYYY'
              }
            }
          ]
        }
      }).createComponent(FuzzyDatepickerNoFormatTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should handle different format from configuration', fakeAsync(() => {
      detectChanges(fixture);

      setInputElementValue(nativeElement, '5/12/2017', fixture);

      expect(getInputElementValue(fixture)).toBe('5/12/2017');
      expect(component.selectedDate).toEqual({ day: 5, month: 12, year: 2017 });
    }));
  });

  describe('standard configuration', () => {
    let fixture: ComponentFixture<FuzzyDatepickerTestComponent>;
    let component: FuzzyDatepickerTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: {
                dateFormat: 'MM/DD/YYYY',
                maxDate: new Date('5/28/2017'),
                minDate: new Date('5/2/2017')
              }
            }
          ]
        }
      }).createComponent(FuzzyDatepickerTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should throw an error if directive is added in isolation', () => {
      try {
        component.showInvalidDirective = true;
        fixture.detectChanges();
      } catch (err) {
        expect(err.message).toContain('skyFuzzyDatepickerInput');
      }
    });

    it('should throw an error if yearRequired conflicts with the dateFormat', () => {
      try {
        component.yearRequired = true;
        component.dateFormat = 'mm/dd';
        fixture.detectChanges();
      } catch (err) {
        expect(err.message).toEqual('You have configured conflicting settings. Year is required and dateFormat does not include year.');
      }
    });

    it('should mark the control as dirty on keyup', () => {
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
      expect(getDatepickerButton(fixture)).not.toBeNull();
    });

    it('should apply aria-label to the datepicker input when none is provided', () => {
      fixture.detectChanges();

      expect(getInputElement(fixture).getAttribute('aria-label')).toBe('Date input field');
    });

    it('should not overwrite aria-label on the datepicker input when one is provided', () => {
      getInputElement(fixture).setAttribute('aria-label', 'This is a date field.');
      fixture.detectChanges();

      expect(getInputElement(fixture).getAttribute('aria-label')).toBe('This is a date field.');
    });

    it('should keep the calendar open on mode change', fakeAsync(() => {
      fixture.detectChanges();
      clickDatepickerButton(fixture);
      let dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');

      expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');

      clickCalendarTitle(fixture);
      dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');

      expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');

      flush();
    }));

    it('should pass date back when date is selected in calendar', fakeAsync(() => {
      setInputProperty(new Date('5/12/2017'), component, fixture);
      clickDatepickerButton(fixture);

      expect(getSelectedCalendarItem(fixture)).toHaveText('12');
      expect(getCalendarTitle(fixture)).toHaveText('May 2017');

      // Click May 6th
      clickCalendarDateButton(6, fixture);

      expect(component.selectedDate).toEqual({ year: 2017, day: 6, month: 5 });
      expect(getInputElementValue(fixture)).toBe('05/06/2017');

      flush();
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();
      clickDatepickerButton(fixture, false);

      // Due to the nature of the calendar popup and this being an async test,
      // we need a couple when stable blocks to ensure the calendar is showing.
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.nativeElement).toBeAccessible();
        });
      });
    }));

    describe('initialization', () => {
      it('should handle initializing with a Fuzzy Date object', fakeAsync(() => {
        setInputProperty({ month: 5, day: 12, year: 2017 }, component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });

        flush();
      }));

      it('should handle initializing with a Fuzzy Date object excluding year', fakeAsync(() => {
        setInputProperty({ month: 5, day: 12 }, component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12');
        expect(component.selectedDate).toEqual({ day: 12, month: 5 });

        flush();
      }));

      it('should handle initializing with a Fuzzy Date object with a zero year', fakeAsync(() => {
        setInputProperty({ month: 5, day: 12, year: 0 }, component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 0 });

        flush();
      }));

      it('should handle initializing with a Date object', fakeAsync(() => {
        setInputProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });

        flush();
      }));

      it('should handle initializing with a string with the expected format', fakeAsync(() => {
        setInputProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });

        flush();
      }));

      it('should handle initializing with a string with a two digit years', fakeAsync(() => {
        setInputProperty('5/12/17', component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/17');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });

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

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });

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

        setInputElementValue(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');
        expect(component.selectedDate).toEqual('1994-11-05T08:15:30-05:00');

        flush();
      }));

      it('should handle two digit years', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/98');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 1998 });

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

        expect(getCalendarTitle(fixture)).toHaveText('May 2017');
        expect(getSelectedCalendarItem(fixture)).toHaveText('12');

        flush();
      }));

      it('should format date on blur', fakeAsync(() => {
        detectChanges(fixture);
        const inputElement = fixture.debugElement.query(By.css('input'));

        setInputElementValue(nativeElement, 'April 4', fixture);
        SkyAppTestUtility.fireDomEvent(inputElement.nativeElement, 'blur');
        fixture.detectChanges();

        expect(getInputElementValue(fixture)).toBe('4/4');

        flush();
      }));
    });

    describe('formats', () => {
      it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'DD/MM/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.selectedDate).toEqual({ day: 5, month: 12, year: 2017 });

        flush();
      }));

      it('should handle a dateFormat excluding year on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'MM/DD';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: undefined });

        flush();
      }));

      it('should handle a dateFormat with day before month excluding year on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'DD/MM';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '12/5', fixture);

        expect(getInputElementValue(fixture)).toBe('12/5');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: undefined });

        flush();
      }));

      it('should handle a dateFormat excluding day on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'MM/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('5/2017');
        expect(component.selectedDate).toEqual({ month: 5, year: 2017, day: undefined });

        flush();
      }));

      it('should handle a dateFormat with year before month and excluding day on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'YYYY/MM';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2017/5', fixture);

        expect(getInputElementValue(fixture)).toBe('2017/5');
        expect(component.selectedDate).toEqual({ month: 5, year: 2017, day: undefined });

        flush();
      }));

      it('should handle a dateFormat with a 2 digit year excluding day on the input different than the default', fakeAsync(() => {
        component.dateFormat = 'MM/YY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/17', fixture);

        expect(getInputElementValue(fixture)).toBe('5/17');
        expect(component.selectedDate).toEqual({ month: 5, year: 2017, day: undefined });

        flush();
      }));

      it(`should handle a dateFormat with a 2 digit year before month excluding day on the input
       different than the default`, fakeAsync(() => {
        component.dateFormat = 'YY/MM';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '17/5', fixture);

        expect(getInputElementValue(fixture)).toBe('17/5');
        expect(component.selectedDate).toEqual({ month: 5, year: 2017, day: undefined });

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

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 2017 });

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

        expect(getInputElementValue(fixture)).toBe('5/12/98');
        expect(component.selectedDate).toEqual({ day: 12, month: 5, year: 1998 });

        flush();
      }));
    });

    describe('validation', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        let inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = <NgModel>inputElement.injector.get(NgModel);
      });

      it('should validate properly when invalid date is passed through input change', fakeAsync(() => {
        detectChanges(fixture);
        setInputElementValue(nativeElement, 'abcdebf', fixture);
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toEqual('abcdebf');

        expect(ngModel.valid).toBe(false);
        expect(ngModel.pristine).toBe(false);
        expect(ngModel.touched).toBe(true);

        flush();
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

        flush();
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);
        setInputProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
        expect(ngModel.valid).toBe(false);

        flush();

      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '', fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(component.selectedDate).toBe('');
        expect(ngModel.valid).toBe(true);

        flush();
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/12/2015');
        expect(component.selectedDate).toEqual({ day: 12, month: 2, year: 2015 });
        expect(ngModel.valid).toBe(true);

        flush();
      }));

      // TODO: should this expect something?
      it('should handle calendar date on invalid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        clickDatepickerButton(fixture);

        flush();
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
        expect(ngModel.valid).toBe(true);

        flush();
      }));

      it('should validate properly when an invalid date format is passed through input change', fakeAsync(() => {
        fixture.componentInstance.dateFormat = 'mm/dd/yyyy';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2015/2/12', fixture);

        expect(getInputElementValue(fixture)).toBe('2015/2/12');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors.skyFuzzyDate.invalid).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/12/2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));

      it(`should validate properly when futureDisabled = true and a future date is passed through input change`, fakeAsync(() => {
        fixture.componentInstance.futureDisabled = true;
        detectChanges(fixture);

        const futureDateString = moment().add(1, 'days').format('L');
        setInputElementValue(nativeElement, futureDateString, fixture);

        expect(getInputElementValue(fixture)).toBe(futureDateString);
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors.skyFuzzyDate.futureDisabled).toBeTruthy();

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

        expect(getInputElementValue(fixture)).toBe('2/12');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors.skyFuzzyDate.yearRequired).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/12/2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));
    });

    describe('min max fuzzy date', () => {

      let ngModel: NgModel;
      beforeEach(() => {
        let inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = <NgModel>inputElement.injector.get(NgModel);
      });

      it('should validate properly when the date is passed through input change'
        + ' beyond the max fuzzy date', fakeAsync(() => {
        fixture.componentInstance.maxDate = { month: 2, day: 15, year: 2015 };
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2/16/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/16/2015');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors.skyFuzzyDate.maxDate).toBeTruthy();

        setInputElementValue(nativeElement, '2/15/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/15/2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));

      it('should validate properly when the date is passed through input change'
        + ' prior to the min fuzzy date', fakeAsync(() => {
        fixture.componentInstance.minDate = { month: 2, day: 15, year: 2015 };
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2/14/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/14/2015');
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors.skyFuzzyDate.minDate).toBeTruthy();

        setInputElementValue(nativeElement, '2/15/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/15/2015');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.touched).toBe(true);
        expect(ngModel.errors).toBeNull();

        flush();
      }));

      it('should handle model change above max fuzzy fuzzy date', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.maxDate = { month: 5, day: 25, year: 2017 };
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/26/2017', fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.errors.skyFuzzyDate.maxDate).toBeTruthy();

        flush();
      }));

      it('should handle model change below min fuzzy date', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = { month: 5, day: 4, year: 2017 };
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, '5/1/2017', fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.errors.skyFuzzyDate.minDate).toBeTruthy();

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

        const firstDayCol = getCalendarColumn(0, fixture);
        expect(firstDayCol.textContent).toContain('Fr');

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
        expect(component.selectedDate).toEqual({ month: 1, day: 1, year: 2019 });

        inputEl.value = newDate;
        component.inputDirective.detectInputValueChange();

        expect(getInputElementValue(fixture)).toBe(newDate);
        expect(component.selectedDate).toEqual({ month: 12, day: 31, year: 2019 });

        flush();
      }));
    });

    describe('disabled state', () => {
      it('should disable the input and dropdown when disable is set to true', fakeAsync(() => {
        component.isDisabled = true;
        detectChanges(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();

        flush();
      }));

      it('should not disable the input and dropdown when disable is set to false', fakeAsync(() => {
        component.isDisabled = false;
        detectChanges(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();

        flush();
      }));
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<FuzzyDatepickerReactiveTestComponent>;
    let component: FuzzyDatepickerReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.overrideComponent(SkyDatepickerComponent, {
        add: {
          providers: [
            {
              provide: SkyDatepickerConfigService,
              useValue: {
                dateFormat: 'MM/DD/YYYY',
                maxDate: new Date('5/28/2017'),
                minDate: new Date('5/2/2017')
              }
            }
          ]
        }
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

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });

        flush();
      }));

      it('should set the Fuzzy Date object excluding year value correctly', fakeAsync(() => {
        component.initialValue = { month: 5, day: 12 };
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('5/12');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5 });

        flush();
      }));

      it('should set the Fuzzy Date object with a zero year value correctly', fakeAsync(() => {
        component.initialValue = { month: 5, day: 12, year: 0 };
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('5/12');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 0 });

        flush();
      }));

      it('should set the string initial value correctly', fakeAsync(() => {
        component.initialValue = '5/12/2017';
        detectChanges(fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });

        flush();
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });

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

        setInputElementValue(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

        expect(getInputElementValue(fixture)).toBe('1994-11-05T08:15:30-05:00');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');
      }));

      it('should be invalid following input change with a date string excluding month', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '21/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('21/2015');
        expect(getInputElement(fixture)).toHaveCssClass('ng-invalid');

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/98');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 1998 });
        expect(getInputElement(fixture)).not.toHaveCssClass('ng-invalid');

        flush();
      }));

      it('should handle intput change with a two digit year', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/98');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 1998 });

        flush();
      }));

      it('should handle intput change with year only', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '2017', fixture);

        expect(getInputElementValue(fixture)).toBe('2017');
        expect(component.dateControl.value).toEqual({ day: undefined, month: undefined, year: 2017 });

        setInputElementValue(nativeElement, '5/12/98', fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/98');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 1998 });

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

        expect(getCalendarTitle(fixture)).toHaveText('May 2017');
        expect(getSelectedCalendarItem(fixture)).toHaveText('12');

        flush();
      }));
    });

    describe('model change', () => {
      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/12/2017'), component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');

        flush();
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('5/12/2017', component, fixture);

        expect(getInputElementValue(fixture)).toBe('5/12/2017');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 2017 });

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

        expect(getInputElementValue(fixture)).toBe('5/12/1998');
        expect(component.dateControl.value).toEqual({ day: 12, month: 5, year: 1998 });

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
        blurInput(nativeElement, fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));

      it('should set correct statuses after user selects from calendar', fakeAsync(function () {
        fixture.componentInstance.initialValue = '5/15/2017';
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(true);
        expect(component.dateControl.touched).toBe(false);

        clickDatepickerButton(fixture);
        getSelectedCalendarItem(fixture).click();
        detectChanges(fixture);

        expect(component.dateControl.valid).toBe(true);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
      }));
    });

    describe('validation', () => {

      it('should validate properly when invalid date is passed through input change', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        setInputElementValue(nativeElement, 'abcdebf', fixture);
        fixture.detectChanges();

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toEqual('abcdebf');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);

        flush();
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

        flush();
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);

        setFormControlProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
        expect(component.dateControl.valid).toBe(false);

        flush();
      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '', fixture);

        expect(getInputElementValue(fixture)).toBe('');
        expect(component.dateControl.value).toBe('');
        expect(component.dateControl.valid).toBe(true);

        flush();
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);
        setInputElementValue(fixture.nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/12/2015');
        expect(component.dateControl.value).toEqual( { day: 12, month: 2, year: 2015 });
        expect(component.dateControl.valid).toBe(true);

        flush();
      }));

      // TODO: Should this test expect something?
      it('should handle calendar date on invalid date', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        clickDatepickerButton(fixture);

        flush();
      }));

      it('should validate properly when an invalid date format is passed through input change', fakeAsync(() => {
        fixture.componentInstance.dateFormat = 'mm/dd/yyyy';
        detectChanges(fixture);
        setInputElementValue(nativeElement, '2015/2/12', fixture);

        expect(getInputElementValue(fixture)).toBe('2015/2/12');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(component.dateControl.errors.skyFuzzyDate.invalid).toBeTruthy();

        setInputElementValue(nativeElement, '2/12/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/12/2015');
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
        expect(component.dateControl.errors.skyFuzzyDate.futureDisabled).toBeTruthy();

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

          expect(getInputElementValue(fixture)).toBe('2/12');
          expect(component.dateControl.valid).toBe(false);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);
          expect(component.dateControl.errors.skyFuzzyDate.yearRequired).toBeTruthy();

          setInputElementValue(nativeElement, '2/12/2015', fixture);

          expect(getInputElementValue(fixture)).toBe('2/12/2015');
          expect(component.dateControl.errors).toBeNull();
          expect(component.dateControl.valid).toBe(true);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);

          flush();
        }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
        expect(component.dateControl.valid).toBe(true);

        flush();
      }));
    });

    describe('min max fuzzy date', () => {
      it('should validate properly when the date is passed through input change beyond the max fuzzy date', fakeAsync(() => {
        fixture.componentInstance.maxDate = { month: 2, day: 15, year: 2015 };
        detectChanges(fixture);
        setInputElementValue(nativeElement, '2/16/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/16/2015');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(component.dateControl.errors.skyFuzzyDate.maxDate).toBeTruthy();

        setInputElementValue(nativeElement, '2/15/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/15/2015');
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

        expect(getInputElementValue(fixture)).toBe('2/14/2015');
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.pristine).toBe(false);
        expect(component.dateControl.touched).toBe(true);
        expect(component.dateControl.errors.skyFuzzyDate.minDate).toBeTruthy();

        setInputElementValue(nativeElement, '2/15/2015', fixture);

        expect(getInputElementValue(fixture)).toBe('2/15/2015');
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

        const firstDayCol = getCalendarColumn(0, fixture);
        expect(firstDayCol.textContent).toContain('Fr');

        flush();
      }));
    });

    describe('disabled state', () => {
      it('should disable the input and dropdown when disable is set to true', () => {
        fixture.detectChanges();
        component.dateControl.disable();
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
      });

      it('should not disable the input and dropdown when disable is set to false', () => {
        fixture.detectChanges();
        component.dateControl.enable();
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
      });
    });
  });

  describe('default locale configuration', () => {
    let fixture: ComponentFixture<FuzzyDatepickerNoFormatTestComponent>;
    let component: FuzzyDatepickerNoFormatTestComponent;

    class MockWindowService {
      public getWindow() {
        return {
          navigator: {
            languages: ['es']
          }
        };
      }
    }

    let mockWindowService = new MockWindowService();
    beforeEach(() => {
      TestBed.overrideProvider(
        SkyWindowRefService,
        {
          useValue: mockWindowService
        }
      );

      fixture = TestBed.createComponent(FuzzyDatepickerNoFormatTestComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should display formatted date based on locale by default', fakeAsync(() => {
      setInputProperty(new Date('10/24/2017'), component, fixture);

      expect(getInputElementValue(fixture)).toBe('24/10/2017');

      flush();
    }));
  });
});
