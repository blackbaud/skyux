import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  async
} from '@angular/core/testing';

import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyTimepickerModule
} from './timepicker.module';

import {
  TimepickerTestComponent
} from './fixtures/timepicker-component.fixture';
import { TimepickerReactiveTestComponent } from './fixtures/timepicker-reactive-component.fixture';

const moment = require('moment');

describe('Timepicker', () => {
  function openTimepicker(element: HTMLElement, compFixture: ComponentFixture<any>) {
    let dropdownButtonEl = element.querySelector('.sky-dropdown-button') as HTMLElement;
    dropdownButtonEl.click();
    tick();
    compFixture.detectChanges();
    tick();
  }

  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<any>
  ) {
    compFixture.detectChanges();
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

  let fixture: ComponentFixture<TimepickerTestComponent | TimepickerReactiveTestComponent>;
  let component: TimepickerTestComponent | TimepickerReactiveTestComponent;
  let nativeElement: HTMLElement;

  function verifyTimepicker(element: HTMLElement) {
    tick();
    fixture.detectChanges();
    let sections = element.querySelectorAll('.sky-timepicker-container');
    let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
    let hours = units.item(0).querySelectorAll('button');
    let minutes = units.item(1).querySelectorAll('button');
    if (component.timeFormat === 'hh' || !component.timeFormat) {
      let meridies = units.item(2).querySelectorAll('button');
      expect(hours.item(0)).toHaveText('1');
      expect(hours.item(11)).toHaveText('12');
      expect(hours.length).toBe(12);
      expect(minutes.item(0)).toHaveText('00');
      expect(minutes.item(11)).toHaveText('55');
      expect(minutes.length).toBe(12);
      expect(meridies.item(0)).toHaveText('AM');
      expect(meridies.length).toBe(2);
    }
    if (component.timeFormat === 'HH') {
      expect(hours.item(0)).toHaveText('0');
      expect(hours.item(11)).toHaveText('11');
      expect(hours.item(23)).toHaveText('23');
      expect(hours.length).toBe(24);
      expect(minutes.item(0)).toHaveText('00');
      expect(minutes.item(3)).toHaveText('45');
      expect(minutes.length).toBe(4);
    }
  }

  describe('template driven', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          TimepickerTestComponent
        ],
        imports: [
          SkyTimepickerModule,
          NoopAnimationsModule,
          FormsModule
        ]
      });

      fixture = TestBed.createComponent(TimepickerTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should default to the twelve hour timepicker without timeFormat', fakeAsync(() => {
      fixture.detectChanges();
      component.timeFormat = undefined;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      openTimepicker(nativeElement, fixture);
      verifyTimepicker(nativeElement);
    }));

    it('should have the twelve hour timepicker', fakeAsync(() => {
      fixture.detectChanges();
      component.timeFormat = 'hh';
      openTimepicker(nativeElement, fixture);
      verifyTimepicker(nativeElement);
    }));

    it('should handle empty time values', fakeAsync(() => {
      (component as any).selectedTime = '';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      openTimepicker(nativeElement, fixture);
      verifyTimepicker(nativeElement);
    }));

    it('should have the twenty four hour timepicker', fakeAsync(() => {
      fixture.detectChanges();
      component.timeFormat = 'HH';
      openTimepicker(nativeElement, fixture);
      verifyTimepicker(nativeElement);
    }));

    it('should allow closing the timepicker', fakeAsync(() => {
      fixture.detectChanges();
      component.timeFormat = 'hh';
      openTimepicker(nativeElement, fixture);
      const closeButton = fixture.nativeElement.querySelector('.sky-timepicker-footer button');
      closeButton.click();
      tick();
      fixture.detectChanges();
      tick();
      const hiddenPopover = fixture.nativeElement.querySelector('.sky-popover-hidden') as HTMLElement;
      expect(hiddenPopover).not.toBeNull();
    }));

    it('should handle input change with a string with the expected timeFormat', fakeAsync(() => {
      component.timeFormat = 'hh';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      setInput(nativeElement, '2:55 AM', fixture);
      expect(nativeElement.querySelector('input').value).toBe('2:55 AM');
      expect(component.selectedTime.local).toEqual('2:55 AM');
    }));

    it('should handle undefined date', fakeAsync(() => {
      component.timeFormat = 'hh';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      setInput(nativeElement, '2:55 AM', fixture);
      component.selectedTime = undefined;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(nativeElement.querySelector('input').value).toBe('');
      expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
    }));

    it('should apply aria-label to the timepicker input when none is provided', () => {
      fixture.detectChanges();
      expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('Time input field');
    });

    it('should not overwrite aria-label on the timepicker input when one is provided', () => {
      nativeElement.querySelector('input').setAttribute('aria-label', 'This is a time field.');
      fixture.detectChanges();
      expect(nativeElement.querySelector('input').getAttribute('aria-label')).toBe('This is a time field.');
    });

    it('should be accessible', async(() => {
      fixture.detectChanges();

      let dropdownButtonEl = nativeElement.querySelector('.sky-dropdown-button') as HTMLElement;
      dropdownButtonEl.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    describe('validation', () => {
      it('should have active css when in twelve hour timeFormat',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'hh';
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          // Test 2:30 AM
          setInput(nativeElement, '2:30 AM', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('2:30 AM');
          expect(hours.item(1)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(6)).toHaveCssClass('sky-btn-active');
          expect(meridies.item(0)).toHaveCssClass('sky-btn-active');
          // Test 4:55 PM
          setInput(nativeElement, '4:55 PM', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('4:55 PM');
          expect(hours.item(3)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(11)).toHaveCssClass('sky-btn-active');
          expect(meridies.item(1)).toHaveCssClass('sky-btn-active');
        })
      );

      it('should have active css when in twenty four hour timeFormat',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'HH';
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          // Test 2:30 AM
          setInput(nativeElement, '2:30', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('2:30');
          expect(hours.item(2)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(2)).toHaveCssClass('sky-btn-active');
          // Test 4:45 PM
          setInput(nativeElement, '16:45', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('16:45');
          expect(hours.item(16)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(3)).toHaveCssClass('sky-btn-active');
        })
      );

      it('should update time on mouse click for twelve four hour timeFormat',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'hh';
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          // Test 2:30 AM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(1).click();
          minutes.item(6).click();
          meridies.item(0).click();
          expect(nativeElement.querySelector('input').value).toBe('2:30 AM');
          // Test 4:55 PM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(3).click();
          minutes.item(11).click();
          meridies.item(1).click();
          expect(nativeElement.querySelector('input').value).toBe('4:55 PM');
        })
      );

      it('should update time on mouse click for twenty four hour timeFormat',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'HH';
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          // Test 2:30 AM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(2).click();
          minutes.item(2).click();
          expect(nativeElement.querySelector('input').value).toBe('02:30');
          // Test 4:45 PM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(16).click();
          minutes.item(3).click();
          expect(nativeElement.querySelector('input').value).toBe('16:45');
        })
      );

      it('should return a custom time timeFormat',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'HH';
          component.returnFormat = 'HH:mm:ssZ';
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges(); tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let tz = moment(new Date()).format('Z');
          // Test 4:45 PM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(16).click();
          minutes.item(3).click();
          expect(nativeElement.querySelector('input').value).toBe('16:45:00' + tz);
        })
      );

      it('should toggle AM and set active css',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'hh';
          setInput(nativeElement, '1:00 PM', fixture);
          openTimepicker(nativeElement, fixture);
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          fixture.detectChanges();
          // Test 12:30 AM
          hours.item(11).click();
          minutes.item(6).click();
          meridies.item(0).click();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('12:30 AM');
          expect(component.selectedTime.local).toEqual('12:30 AM');
          expect(meridies.item(0)).toHaveCssClass('sky-btn-active');
        })
      );

      it('should toggle PM and set active css',
        fakeAsync(() => {
          fixture.detectChanges();
          component.timeFormat = 'hh';
          setInput(nativeElement, '1:00 AM', fixture);
          openTimepicker(nativeElement, fixture);
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          fixture.detectChanges();
          // Test 12:30 PM
          hours.item(11).click();
          minutes.item(6).click();
          meridies.item(1).click();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('12:30 PM');
          expect(component.selectedTime.local).toEqual('12:30 PM');
          expect(meridies.item(1)).toHaveCssClass('sky-btn-active');
          fixture.detectChanges();
          // Test 1:30 PM
          hours.item(0).click();
          minutes.item(6).click();
          meridies.item(1).click();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('1:30 PM');
          expect(component.selectedTime.local).toEqual('1:30 PM');
          expect(meridies.item(1)).toHaveCssClass('sky-btn-active');
        })
      );

      describe('disabled state', () => {

        it('should disable the input and dropdown when disabled is set to true ' +
        'and enable them when disabled is changed to false', () => {
          (<TimepickerTestComponent>component).isDisabled = true;
          fixture.detectChanges();

          expect(fixture.componentInstance.timepicker.disabled).toBeTruthy();
          expect(fixture.componentInstance.timepickerComponent.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();

          (<TimepickerTestComponent>component).isDisabled = false;
          fixture.detectChanges();

          expect(fixture.componentInstance.timepicker.disabled).toBeFalsy();
          expect(fixture.componentInstance.timepickerComponent.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
          expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
        });
      });
    });
  });

  describe('reactive', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          TimepickerReactiveTestComponent
        ],
        imports: [
          SkyTimepickerModule,
          NoopAnimationsModule,
          FormsModule,
          ReactiveFormsModule
        ]
      });

      fixture = TestBed.createComponent(TimepickerReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('initial value', () => {
      it('should set the initial value correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(nativeElement.querySelector('input').value).toBe('2:55 AM');
        expect((<TimepickerReactiveTestComponent>component).timeControl.value.local).toEqual('2:55 AM');
      }));
    });

    describe('validation', () => {
      it('should have active css when in twelve hour timeFormat',
        fakeAsync(() => {
          component.timeFormat = 'hh';
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          // Test 2:30 AM
          setInput(nativeElement, '2:30 AM', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('2:30 AM');
          expect(hours.item(1)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(6)).toHaveCssClass('sky-btn-active');
          expect(meridies.item(0)).toHaveCssClass('sky-btn-active');
          // Test 4:55 PM
          setInput(nativeElement, '4:55 PM', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('4:55 PM');
          expect(hours.item(3)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(11)).toHaveCssClass('sky-btn-active');
          expect(meridies.item(1)).toHaveCssClass('sky-btn-active');
        })
      );

      it('should have active css when in twenty four hour timeFormat',
        fakeAsync(() => {
          component.timeFormat = 'HH';
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          // Test 2:30 AM
          setInput(nativeElement, '2:30', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('2:30');
          expect(hours.item(2)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(2)).toHaveCssClass('sky-btn-active');
          // Test 4:45 PM
          setInput(nativeElement, '16:45', fixture);
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          expect(nativeElement.querySelector('input').value).toBe('16:45');
          expect(hours.item(16)).toHaveCssClass('sky-btn-active');
          expect(minutes.item(3)).toHaveCssClass('sky-btn-active');
        })
      );

      it('should update time on mouse click for twelve four hour timeFormat',
        fakeAsync(() => {
          component.timeFormat = 'hh';
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          // Test 2:30 AM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(1).click();
          minutes.item(6).click();
          meridies.item(0).click();
          expect(nativeElement.querySelector('input').value).toBe('2:30 AM');
          // Test 4:55 PM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(3).click();
          minutes.item(11).click();
          meridies.item(1).click();
          expect(nativeElement.querySelector('input').value).toBe('4:55 PM');
        })
      );

      it('should update time on mouse click for twenty four hour timeFormat',
        fakeAsync(() => {
          component.timeFormat = 'HH';
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges();
          tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          // Test 2:30 AM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(2).click();
          minutes.item(2).click();
          expect(nativeElement.querySelector('input').value).toBe('02:30');
          // Test 4:45 PM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(16).click();
          minutes.item(3).click();
          expect(nativeElement.querySelector('input').value).toBe('16:45');
        })
      );

      it('should return a custom time timeFormat',
        fakeAsync(() => {
          component.timeFormat = 'HH';
          component.returnFormat = 'HH:mm:ssZ';
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          fixture.detectChanges(); tick();
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let tz = moment(new Date()).format('Z');
          // Test 4:45 PM
          fixture.detectChanges();
          openTimepicker(nativeElement, fixture);
          hours.item(16).click();
          minutes.item(3).click();
          expect(nativeElement.querySelector('input').value).toBe('16:45:00' + tz);
        })
      );

      it('should toggle AM and set active css',
        fakeAsync(() => {
          component.timeFormat = 'hh';
          fixture.detectChanges();
          setInput(nativeElement, '1:00 PM', fixture);
          openTimepicker(nativeElement, fixture);
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          fixture.detectChanges();
          // Test 12:30 AM
          hours.item(11).click();
          minutes.item(6).click();
          meridies.item(0).click();
          fixture.detectChanges();
          tick();
          let doneButton = fixture.nativeElement.querySelector('.sky-timepicker-footer button');
          doneButton.click();
          fixture.detectChanges();
          tick();
          let input = nativeElement.querySelector('input');
          input.value = '12:30 AM';
          let inputEvent = document.createEvent('CustomEvent');
          inputEvent.initEvent('input', false, false);
          let changeEvent = document.createEvent('CustomEvent');
          changeEvent.initEvent('change', false, false);
          input.dispatchEvent(inputEvent);
          input.dispatchEvent(changeEvent);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('12:30 AM');
          expect((<TimepickerReactiveTestComponent>component).timepickerForm.get('time').value.local).toEqual('12:30 AM');
          expect(meridies.item(0)).toHaveCssClass('sky-btn-active');
        })
      );

      it('should toggle PM and set active css',
        fakeAsync(() => {
          component.timeFormat = 'hh';
          fixture.detectChanges();
          setInput(nativeElement, '1:00 AM', fixture);
          openTimepicker(nativeElement, fixture);
          let sections = fixture.nativeElement.querySelectorAll('.sky-timepicker-container');
          let units = sections.item(0).querySelectorAll('.sky-timepicker-column');
          let hours = units.item(0).querySelectorAll('button');
          let minutes = units.item(1).querySelectorAll('button');
          let meridies = units.item(2).querySelectorAll('button');
          fixture.detectChanges();
          // Test 12:30 PM
          hours.item(11).click();
          minutes.item(6).click();
          meridies.item(1).click();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('12:30 PM');
          expect((<TimepickerReactiveTestComponent>component).timeControl.value.local).toEqual('12:30 PM');
          expect(meridies.item(1)).toHaveCssClass('sky-btn-active');
          fixture.detectChanges();
          // Test 1:30 PM
          hours.item(0).click();
          minutes.item(6).click();
          meridies.item(1).click();
          fixture.detectChanges();
          expect(nativeElement.querySelector('input').value).toBe('1:30 PM');
          expect((<TimepickerReactiveTestComponent>component).timeControl.value.local).toEqual('1:30 PM');
          expect(meridies.item(1)).toHaveCssClass('sky-btn-active');
        })
      );
    });

    describe('disabled state', () => {

      it('should disable the input and dropdown when disabled is set to true ' +
      'and enable them when the disabled is changed to false', fakeAsync(() => {
        fixture.detectChanges();
        (<TimepickerReactiveTestComponent>component).isDisabled = true;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(fixture.componentInstance.timepicker.disabled).toBeTruthy();
        expect(fixture.componentInstance.timepickerComponent.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeTruthy();

        fixture.detectChanges();
        (<TimepickerReactiveTestComponent>component).isDisabled = false;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(fixture.componentInstance.timepicker.disabled).toBeFalsy();
        expect(fixture.componentInstance.timepickerComponent.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('sky-dropdown button')).nativeElement.disabled).toBeFalsy();
      }));
    });

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.detectChanges();

      let dropdownButtonEl = nativeElement.querySelector('.sky-dropdown-button') as HTMLElement;
      dropdownButtonEl.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

  });
});
