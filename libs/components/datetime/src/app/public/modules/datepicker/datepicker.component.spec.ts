import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  async
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
  DatepickerTestComponent
} from './fixtures/datepicker.component.fixture';

import {
  DatepickerNoFormatTestComponent
} from './fixtures/datepicker-noformat.component.fixture';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDatepickerComponent
} from './datepicker.component';

import {
  DatepickerReactiveTestComponent
} from './fixtures/datepicker-reactive.component.fixture';

import {
  DatepickerTestModule
} from './fixtures/datepicker.module.fixture';

const moment = require('moment');

describe('datepicker', () => {

  function openDatepicker(element: HTMLElement, compFixture: ComponentFixture<any>) {
    let dropdownButtonEl = element.querySelector('.sky-dropdown-button') as HTMLElement;
    dropdownButtonEl.click();
    compFixture.detectChanges();
  }

  function setInput(
    element: HTMLElement,
    text: string,
    fixture: ComponentFixture<any>
  ) {
    const inputEl = element.querySelector('input');
    inputEl.value = text;
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change');
    fixture.detectChanges();
    tick();
  }

  function blurInput(
    element: HTMLElement,
    fixture: ComponentFixture<any>
  ) {
    const inputEl = element.querySelector('input');
    SkyAppTestUtility.fireDomEvent(inputEl, 'blur');

    fixture.detectChanges();
    tick();
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        DatepickerTestModule
      ]
    });

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
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      setInput(nativeElement, '5/12/2017', fixture);

      expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

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
      expect(nativeElement.querySelector('input')).toHaveCssClass('sky-form-control');
      expect(nativeElement
        .querySelector('.sky-input-group .sky-input-group-btn .sky-dropdown-button'))
        .not.toBeNull();
    });

    it('should apply aria-label to the datepicker input when none is provided', () => {
      fixture.detectChanges();
      expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('Date input field.');
    });

    it('should not overwrite aria-label on the datepicker input when one is provided', () => {
      nativeElement.querySelector('input').setAttribute('aria-label', 'This is a date field.');
      fixture.detectChanges();
      expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('This is a date field.');
    });

    it('should keep the calendar open on mode change', fakeAsync(() => {
      fixture.detectChanges();
      openDatepicker(nativeElement, fixture);
      tick();
      fixture.detectChanges();
      tick();

      let dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');
      expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');

      let titleEl = nativeElement.querySelector('.sky-datepicker-calendar-title') as HTMLButtonElement;

      titleEl.click();
      tick();
      fixture.detectChanges();
      tick();

      dropdownMenuEl = nativeElement.querySelector('.sky-popover-container');
      expect(dropdownMenuEl).not.toHaveCssClass('sky-popover-hidden');
    }));

    it('should pass date back when date is selected in calendar', fakeAsync(() => {
      component.selectedDate = new Date('5/12/2017');
      fixture.detectChanges();
      openDatepicker(nativeElement, fixture);
      tick();
      fixture.detectChanges();
      tick();

      expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
        .toHaveText('12');

      expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
        .toHaveText('May 2017');

      // Click May 2nd
      let dateButtonEl
        = nativeElement
          .querySelectorAll('tbody tr td .sky-btn-default').item(2) as HTMLButtonElement;

      dateButtonEl.click();
      tick();
      fixture.detectChanges();
      tick();

      expect(component.selectedDate).toEqual(new Date('5/2/2017'));
      expect(nativeElement.querySelector('input').value).toBe('05/02/2017');
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();
      openDatepicker(nativeElement, fixture);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    describe('initialization', () => {
      it('should handle initializing with a Date object', fakeAsync(() => {
        component.selectedDate = new Date('5/12/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
      }));

      it('should handle initializing with a string with the expected format', fakeAsync(() => {
        component.selectedDate = '5/12/2017';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

        expect(component.selectedDate).toEqual(new Date('05/12/2017'));
      }));

      it('should handle initializing with a ISO string', fakeAsync(() => {
        component.selectedDate = '2009-06-15T00:00:01';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('06/15/2009');

        expect(component.selectedDate)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle initializing with an ISO string with offset', fakeAsync(() => {
        component.selectedDate = '1994-11-05T08:15:30-05:00';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

        expect(component.selectedDate)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
      }));

      it('should handle two digit years', fakeAsync(() => {
        component.selectedDate = '5/12/17';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

        expect(component.selectedDate).toEqual(new Date('05/12/2017'));
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(nativeElement, '5/12/2017', fixture);
        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('5/12/2017'));
      }));

      it('should handle input change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '2009-06-15T00:00:01', fixture);
        expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
        expect(component.selectedDate)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

        expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

        expect(component.selectedDate)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '5/12/98', fixture);

        expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

        expect(component.selectedDate).toEqual(new Date('05/12/1998'));
      }));

      it('should handle undefined date', fakeAsync(() => {
        component.selectedDate = '5/12/17';

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        component.selectedDate = undefined;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('');
        expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
      }));

      it('should pass date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '5/12/2017', fixture);

        openDatepicker(nativeElement, fixture);
        tick();
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
          .toHaveText('12');

        expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
          .toHaveText('May 2017');
      }));
    });

    describe('formats', () => {
      it('should handle a dateFormat on the input different than the default', fakeAsync(() => {
        component.format = 'DD/MM/YYYY';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(nativeElement, '5/12/2017', fixture);

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');

        expect(component.selectedDate).toEqual(new Date('12/05/2017'));
      }));
    });

    describe('model change', () => {
      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = new Date('5/12/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = '5/12/2017';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.selectedDate).toEqual(new Date('5/12/2017'));
      }));

      it('should handle model change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = '2009-06-15T00:00:01';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
        expect(component.selectedDate)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = '1994-11-05T08:15:30-05:00';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

        expect(component.selectedDate)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedDate = '5/12/98';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

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
          fixture.detectChanges();
          tick();
          setInput(nativeElement, 'abcdebf', fixture);
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.selectedDate)
            .toBe('abcdebf');

          expect(ngModel.valid).toBe(false);
          expect(ngModel.pristine).toBe(false);
          expect(ngModel.touched).toBe(true);

        }));

      it('should validate properly when invalid date on initialization', fakeAsync(() => {
        component.selectedDate = 'abcdebf';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('abcdebf');

        expect(component.selectedDate)
          .toBe('abcdebf');

        expect(ngModel.valid).toBe(false);

        expect(ngModel.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);
        expect(ngModel.valid).toBe(false);
        expect(ngModel.touched).toBe(true);
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        component.selectedDate = 'abcdebf';

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('abcdebf');

        expect(component.selectedDate)
          .toBe('abcdebf');

        expect(ngModel.valid).toBe(false);

      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);

        setInput(fixture.nativeElement, '', fixture);

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(component.selectedDate)
          .toBe('');

        expect(ngModel.valid).toBe(true);
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);

        setInput(fixture.nativeElement, '2/12/2015', fixture);

        expect(nativeElement.querySelector('input').value).toBe('02/12/2015');

        expect(component.selectedDate)
          .toEqual(new Date('2/12/2015'));

        expect(ngModel.valid).toBe(true);
      }));

      it('should handle calendar date on invalid date', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);
        tick();

        openDatepicker(fixture.nativeElement, fixture);
        tick();
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);

        expect(nativeElement.querySelector('input').value).toBe('abcdebf');

        expect(component.selectedDate)
          .toBe('abcdebf');

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
        component.selectedDate = new Date('5/21/2017');
        component.maxDate = new Date('5/25/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '5/26/2017', fixture);

        expect(ngModel.valid).toBe(false);

      }));

      it('should handle change below min date', fakeAsync(() => {
        component.selectedDate = new Date('5/21/2017');
        component.minDate = new Date('5/4/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '5/1/2017', fixture);

        expect(ngModel.valid).toBe(false);
      }));

      it('should pass max date to calendar', fakeAsync(() => {
        component.selectedDate = new Date('5/21/2017');
        component.maxDate = new Date('5/25/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        openDatepicker(fixture.nativeElement, fixture);
        tick();

        let dateButtonEl
          = fixture.nativeElement
            .querySelectorAll('tbody tr td .sky-btn-default').item(30) as HTMLButtonElement;

        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        component.selectedDate = new Date('5/21/2017');
        component.minDate = new Date('5/4/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        openDatepicker(fixture.nativeElement, fixture);
        tick();

        let dateButtonEl
          = fixture.nativeElement
            .querySelectorAll('tbody tr td .sky-btn-default').item(1) as HTMLButtonElement;

        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        component.selectedDate = new Date('5/21/2017');
        component.startingDay = 5;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        openDatepicker(fixture.nativeElement, fixture);
        tick();

        let firstDayCol = fixture.nativeElement
          .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;

        expect(firstDayCol.textContent).toContain('Fr');
      }));
    });

    describe('disabled state', () => {

      it('should disable the input and dropdown when disable is set to true', fakeAsync(() => {
        component.isDisabled = true;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
      }));

      it('should not disable the input and dropdown when disable is set to false', () => {
        component.isDisabled = false;
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
      });

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
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
      }));
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(nativeElement, '5/12/2017', fixture);
        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
      }));

      it('should handle input change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '2009-06-15T00:00:01', fixture);
        expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
        expect(component.dateControl.value)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle input change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '1994-11-05T08:15:30-05:00', fixture);

        expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

        expect(component.dateControl.value)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '5/12/98', fixture);

        expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

        expect(component.dateControl.value).toEqual(new Date('05/12/1998'));
      }));

      it('should handle undefined date', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue('5/12/17');

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        component.dateControl.setValue(undefined);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('');
        expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
      }));

      it('should pass date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        setInput(nativeElement, '5/12/2017', fixture);

        openDatepicker(nativeElement, fixture);
        tick();
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('td .sky-datepicker-btn-selected'))
          .toHaveText('12');

        expect(nativeElement.querySelector('.sky-datepicker-calendar-title'))
          .toHaveText('May 2017');
      }));
    });

    describe('model change', () => {
      it('should handle model change with a Date object', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue(new Date('5/12/2017'));
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
      }));

      it('should handle model change with a string with the expected format', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue('5/12/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/2017');
        expect(component.dateControl.value).toEqual(new Date('5/12/2017'));
      }));

      it('should handle model change with a ISO string', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue('2009-06-15T00:00:01');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('06/15/2009');
        expect(component.dateControl.value)
          .toEqual(moment('2009-06-15T00:00:01', 'YYYY-MM-DDTHH:mm:ss').toDate());
      }));

      it('should handle model change with an ISO string with offset', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue('1994-11-05T08:15:30-05:00');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('11/05/1994');

        expect(component.dateControl.value)
          .toEqual(moment('1994-11-05T08:15:30-05:00', 'YYYY-MM-DDThh:mm:ss.sssZ').toDate());
      }));

      it('should handle two digit years', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue('5/12/98');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('05/12/1998');

        expect(component.dateControl.value).toEqual(new Date('05/12/1998'));
      }));
    });

    describe('validation', () => {

      it('should validate properly when invalid date is passed through input change',
        fakeAsync(() => {
          fixture.detectChanges();
          tick();
          setInput(nativeElement, 'abcdebf', fixture);
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('abcdebf');

          expect(component.dateControl.value)
            .toBe('abcdebf');

          expect(component.dateControl.valid).toBe(false);
          expect(component.dateControl.pristine).toBe(false);
          expect(component.dateControl.touched).toBe(true);

        }));

      it('should validate properly when invalid date on initialization', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue('abcdebf');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('abcdebf');

        expect(component.dateControl.value)
          .toBe('abcdebf');

        expect(component.dateControl.valid).toBe(false);

        expect(component.dateControl.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);
        expect(component.dateControl.valid).toBe(false);
        expect(component.dateControl.touched).toBe(true);
      }));

      it('should validate properly when invalid date on model change', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        component.dateControl.setValue('abcdebf');

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').value).toBe('abcdebf');

        expect(component.dateControl.value)
          .toBe('abcdebf');

        expect(component.dateControl.valid).toBe(false);

      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);

        setInput(fixture.nativeElement, '', fixture);

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(component.dateControl.value)
          .toBe('');

        expect(component.dateControl.valid).toBe(true);
      }));

      it('should handle invalid and then valid date', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);

        setInput(fixture.nativeElement, '2/12/2015', fixture);

        expect(nativeElement.querySelector('input').value).toBe('02/12/2015');

        expect(component.dateControl.value)
          .toEqual(new Date('2/12/2015'));

        expect(component.dateControl.valid).toBe(true);
      }));

      it('should handle calendar date on invalid date', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);
        tick();

        openDatepicker(fixture.nativeElement, fixture);
        tick();
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, 'abcdebf', fixture);

        expect(nativeElement.querySelector('input').value).toBe('abcdebf');

        expect(component.dateControl.value)
          .toBe('abcdebf');

        expect(component.dateControl.valid).toBe(true);

      }));
    });

    describe('min max date', () => {
      it('should handle change above max date', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue(new Date('5/21/2017'));
        component.maxDate = new Date('5/25/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '5/26/2017', fixture);

        expect(component.dateControl.valid).toBe(false);

      }));

      it('should handle change below min date', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue(new Date('5/21/2017'));
        component.minDate = new Date('5/4/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '5/1/2017', fixture);

        expect(component.dateControl.valid).toBe(false);
      }));

      it('should pass max date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue(new Date('5/21/2017'));
        component.maxDate = new Date('5/25/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        openDatepicker(fixture.nativeElement, fixture);
        tick();

        let dateButtonEl
          = fixture.nativeElement
            .querySelectorAll('tbody tr td .sky-btn-default').item(30) as HTMLButtonElement;

        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass min date to calendar', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue(new Date('5/21/2017'));
        component.minDate = new Date('5/4/2017');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        openDatepicker(fixture.nativeElement, fixture);
        tick();

        let dateButtonEl
          = fixture.nativeElement
            .querySelectorAll('tbody tr td .sky-btn-default').item(1) as HTMLButtonElement;

        expect(dateButtonEl).toHaveCssClass('sky-btn-disabled');
      }));

      it('should pass starting day to calendar', fakeAsync(() => {
        fixture.detectChanges();
        component.dateControl.setValue(new Date('5/21/2017'));
        component.startingDay = 5;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        openDatepicker(fixture.nativeElement, fixture);
        tick();

        let firstDayCol = fixture.nativeElement
          .querySelectorAll('.sky-datepicker-center.sky-datepicker-weekdays').item(0) as HTMLElement;

        expect(firstDayCol.textContent).toContain('Fr');
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
    let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
    let component: DatepickerNoFormatTestComponent;
    let nativeElement: HTMLElement;

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
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should display formatted date based on locale by default', fakeAsync(() => {
      component.selectedDate = new Date('10/24/2017');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(nativeElement.querySelector('input').value).toBe('24/10/2017');
    }));
  });
});
