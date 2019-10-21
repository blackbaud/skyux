import {
  async,
  ComponentFixture,
  fakeAsync,
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
  DatepickerTestComponent
} from './fixtures/datepicker.component.fixture';

import {
  DatepickerTestModule
} from './fixtures/datepicker.module.fixture';

import {
  DatepickerNoFormatTestComponent
} from './fixtures/datepicker-noformat.component.fixture';

import {
  DatepickerReactiveTestComponent
} from './fixtures/datepicker-reactive.component.fixture';

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

describe('datepicker', () => {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        DatepickerTestModule
      ]
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
                dateFormat: 'DD/MM/YYYY'
              }
            }
          ]
        }
      }).createComponent(DatepickerNoFormatTestComponent);

      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should handle different format from configuration', fakeAsync(() => {
      detectChanges(fixture);

      setInputElementValue(nativeElement, '5/12/2017', fixture);

      expect(getInputElementValue(fixture)).toBe('05/12/2017');
      expect(component.selectedDate).toEqual(new Date('12/05/2017'));
    }));
  });

  describe('standard configuration', () => {
    let fixture: ComponentFixture<DatepickerTestComponent>;
    let component: DatepickerTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(DatepickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

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
    }));

    it('should pass date back when date is selected in calendar', fakeAsync(() => {
      setInputProperty(new Date('5/12/2017'), component, fixture);
      clickDatepickerButton(fixture);

      expect(getSelectedCalendarItem(fixture)).toHaveText('12');
      expect(getCalendarTitle(fixture)).toHaveText('May 2017');

      // Click May 2nd
      clickCalendarDateButton(2, fixture);

      expect(component.selectedDate).toEqual(new Date('5/2/2017'));
      expect(getInputElementValue(fixture)).toBe('05/02/2017');
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();
      clickDatepickerButton(fixture, false);

      // Due to the nature of the calendar popup and this being an async test,
      // we need a couple whenStable() blocks to ensure the calendar is showing.
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.nativeElement).toBeAccessible();
        });
      });
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
        expect(component.selectedDate)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle initializing with an ISO string with offset', fakeAsync(() => {
        setInputProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
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
        expect(component.selectedDate)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
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

        clickDatepickerButton(fixture);

        expect(getCalendarTitle(fixture)).toHaveText('May 2017');
        expect(getSelectedCalendarItem(fixture)).toHaveText('12');
      }));
    });

    describe('formats', () => {
      it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
        component.format = 'DD/MM/YYYY';
        detectChanges(fixture);

        setInputElementValue(nativeElement, '5/12/2017', fixture);

        expect(getInputElementValue(fixture)).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('12/05/2017'));
      }));
    });

    describe('model change', () => {
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
        expect(component.selectedDate)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        setInputProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.selectedDate)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
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
        let inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = <NgModel>inputElement.injector.get(NgModel);
      });

      it('should validate properly when invalid date is passed through input change',
        fakeAsync(() => {
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

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);

        setInputProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.selectedDate).toBe('abcdebf');
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
        clickDatepickerButton(fixture);

        // Current day should be selected.
        const dayOfMonth = ('0' + new Date().getDate()).slice(-2);
        expect(getSelectedCalendarItem(fixture)).toHaveText(dayOfMonth);
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

    describe('min max date', () => {
      let ngModel: NgModel;
      beforeEach(() => {
        let inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = <NgModel>inputElement.injector.get(NgModel);
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

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(30, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = new Date('5/4/2017');
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        setInputProperty(new Date('5/21/2017'), component, fixture);
        component.startingDay = 5;
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const firstDayCol = getCalendarColumn(0, fixture);
        expect(firstDayCol.textContent).toContain('Fr');
      }));
    });

    describe('disabled state', () => {
      it('should disable the input and dropdown when disabled is set to true ' +
      'and enable them when disabled is changed to false', fakeAsync(() => {
        component.isDisabled = true;
        detectChanges(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.componentInstance.datepicker.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();

        component.isDisabled = false;
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.componentInstance.datepicker.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
      }));
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
      // #region helpers
      type focusProperty = 'buttonIsFocused' | 'calendarIsFocused';

      function validateFocus(hasFocus: boolean, focusedEl?: HTMLElement, focusPropertyName: focusProperty = 'buttonIsFocused'): void {
        if (hasFocus && focusedEl) {
          focusedEl.focus();
        }

        expect(component.datepicker[focusPropertyName]).toBe(hasFocus);
      }

      function validateCalendarFocus(hasFocus: boolean, focusedEl?: HTMLElement): void {
        clickDatepickerButton(fixture);

        validateFocus(hasFocus, focusedEl, 'calendarIsFocused');

        clickDatepickerButton(fixture);
      }
      // #endregion

      it('should reflect the state of focus for the datepicker component', fakeAsync(() => {
        detectChanges(fixture);
        const buttonEl = getDatepickerButton(fixture);
        const selectedDayEl = getSelectedCalendarItem(fixture);
        const dropdownContainerEl =
          nativeElement.querySelector('.sky-popover-container') as HTMLElement;

        expect(buttonEl).toBeDefined();
        expect(dropdownContainerEl).toBeDefined();
        expect(selectedDayEl).toBeDefined();

        validateFocus(false);
        validateFocus(true, buttonEl);

        validateCalendarFocus(false);
        validateCalendarFocus(true, dropdownContainerEl);
        validateCalendarFocus(true, selectedDayEl);
      }));

      it('should reflect the state of focus for the input', fakeAsync(() => {
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

        clickDatepickerButton(fixture);

        expect(component.datepicker.calendarIsVisible).toBe(true);
      }));
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<DatepickerReactiveTestComponent>;
    let component: DatepickerReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(DatepickerReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('initial value', () => {
      it('should set the initial value correctly', fakeAsync(() => {
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
        expect(component.dateControl.value)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        detectChanges(fixture);

        setInputElementValue(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.dateControl.value)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
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
        clickDatepickerButton(fixture);

        expect(getCalendarTitle(fixture)).toHaveText('May 2017');
        expect(getSelectedCalendarItem(fixture)).toHaveText('12');
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
        expect(component.dateControl.value)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty('1994-11-05T08:15:30-05:00', component, fixture);

        expect(getInputElementValue(fixture)).toBe('11/05/1994');
        expect(component.dateControl.value)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
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

        clickDatepickerButton(fixture);
        getSelectedCalendarItem(fixture).click();
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

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        detectChanges(fixture);

        setFormControlProperty('abcdebf', component, fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
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
        clickDatepickerButton(fixture);

        // Current day should be selected.
        const dayOfMonth = ('0' + new Date().getDate()).slice(-2);
        expect(getSelectedCalendarItem(fixture)).toHaveText(dayOfMonth);
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;
        detectChanges(fixture);

        setInputElementValue(fixture.nativeElement, 'abcdebf', fixture);

        expect(getInputElementValue(fixture)).toBe('abcdebf');
        expect(component.dateControl.value).toBe('abcdebf');
        expect(component.dateControl.valid).toBe(true);
      }));

      it('should invalidate field on keyup', fakeAsync(() => {
        detectChanges(fixture);

        const inputElement = fixture.nativeElement.querySelector('input');

        setInputElementValue(fixture.nativeElement, 'abc 123', fixture);
        SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');

        fixture.detectChanges();
        tick();

        expect(inputElement.value).toBe('abc 123');
        expect(component.dateControl.value).toEqual('abc 123');
        expect(component.dateControl.valid).toBe(false);
      }));

      it('should respect noValidate on keyup', fakeAsync(() => {
        fixture.componentInstance.noValidate = true;
        detectChanges(fixture);

        const inputElement = fixture.nativeElement.querySelector('input');

        setInputElementValue(fixture.nativeElement, 'abc 123', fixture);
        SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');

        fixture.detectChanges();
        tick();

        expect(inputElement.value).toBe('12/03/2019');
        expect(component.dateControl.value).toEqual(new Date('12/03/2019'));
        expect(component.dateControl.valid).toBe(true);
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

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(30, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.minDate = new Date('5/4/2017');
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const dateButtonEl = getCalendarDayButton(1, fixture);
        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        fixture.detectChanges();
        setFormControlProperty(new Date('5/21/2017'), component, fixture);
        component.startingDay = 5;
        detectChanges(fixture);

        clickDatepickerButton(fixture);

        const firstDayCol = getCalendarColumn(0, fixture);
        expect(firstDayCol.textContent).toContain('Fr');
      }));
    });

    describe('disabled state', () => {
      it('should disable the input and dropdown when disabled is set to true ' +
      'and enable them when disabled is changed to false', () => {
        fixture.detectChanges();
        component.isDisabled = true;
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.componentInstance.datepicker.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();

        fixture.detectChanges();
        component.isDisabled = false;
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.componentInstance.datepicker.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
      });

    });

  });

  describe('default locale configuration', () => {
    let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
    let component: DatepickerNoFormatTestComponent;

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

      fixture = TestBed.createComponent(DatepickerNoFormatTestComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should display formatted date based on locale by default', fakeAsync(() => {
      setInputProperty(new Date('10/24/2017'), component, fixture);

      expect(getInputElementValue(fixture)).toBe('24/10/2017');
    }));
  });
});
