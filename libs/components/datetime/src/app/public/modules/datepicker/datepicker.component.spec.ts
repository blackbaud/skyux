import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  async
} from '@angular/core/testing';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  FormsModule,
  NgModel
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDatepickerModule
} from './datepicker.module';

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
      compFixture: ComponentFixture<any>) {
    let inputEvent = document.createEvent('Event');
    let params = {
      bubbles: false,
      cancelable: false
    };
    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    let inputEl = element.querySelector('input');
    inputEl.value = text;

    inputEl.dispatchEvent(inputEvent);
    compFixture.detectChanges();

    inputEl.dispatchEvent(changeEvent);
    compFixture.detectChanges();
    tick();

  }

  function blurInput(
    element: HTMLElement,
    compFixture: ComponentFixture<any>) {

    let inputEvent = document.createEvent('Event');
    let params = {
      bubbles: false,
      cancelable: false
    };
    inputEvent.initEvent('blur', params.bubbles, params.cancelable);
    let inputEl = element.querySelector('input');

    inputEl.dispatchEvent(inputEvent);
    compFixture.detectChanges();
    tick();
  }

  describe('nonstandard configuration', () => {
    let fixture: ComponentFixture<DatepickerNoFormatTestComponent>;
    let component: DatepickerNoFormatTestComponent;
    let nativeElement: HTMLElement;

    it('should handle different format from configuration', fakeAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          DatepickerNoFormatTestComponent
        ],
        imports: [
          SkyDatepickerModule,
          NoopAnimationsModule,
          FormsModule
        ]
      });

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
      TestBed.configureTestingModule({
        declarations: [
          DatepickerTestComponent
        ],
        imports: [
          SkyDatepickerModule,
          NoopAnimationsModule,
          FormsModule
        ]
      });

      fixture = TestBed.createComponent(DatepickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
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
        ngModel = <NgModel> inputElement.injector.get(NgModel);
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
        expect(ngModel.touched).toBe(false);

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

        expect(ngModel.touched).toBe(false);

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
        ngModel = <NgModel> inputElement.injector.get(NgModel);
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

      it('should disable the input and dropdown when disable is set to true', () => {
        component.isDisabled = true;
        fixture.detectChanges();

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();
      });

      it('should not disable the input and dropdown when disable is set to false', () => {
        component.isDisabled = false;
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
      TestBed.configureTestingModule({
        declarations: [
          DatepickerNoFormatTestComponent
        ],
        imports: [
          SkyDatepickerModule,
          NoopAnimationsModule,
          FormsModule
        ],
        providers: [
          { provide: SkyWindowRefService, useValue: mockWindowService }
        ]
      });

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
