import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  NgModel
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect, SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  TimepickerTestComponent
} from './fixtures/timepicker-component.fixture';

import {
  TimepickerReactiveTestComponent
} from './fixtures/timepicker-reactive-component.fixture';

import {
  SkyTimepickerModule
} from './timepicker.module';

import * as moment_ from 'moment';
const moment = moment_;

//#region helpers
function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function getTriggerButton(fixture: ComponentFixture<any>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('.sky-input-group-datepicker-btn') as HTMLButtonElement;
}

function openTimepicker(fixture: ComponentFixture<any>, isAsync: boolean = false): void {
  const triggerButton = getTriggerButton(fixture);
  triggerButton.click();
  fixture.detectChanges();

  if (!isAsync) {
    tick();
  }
}

function getTimepicker(): HTMLElement {
  return document.querySelector('.sky-timepicker-container') as HTMLElement;
}

function getHourButtons(): NodeListOf<HTMLElement> {
  const timepicker = getTimepicker();
  return timepicker.querySelectorAll('button[name="hour"]') as NodeListOf<HTMLElement>;
}

function getMinuteButtons(): NodeListOf<HTMLElement> {
  const timepicker = getTimepicker();
  return timepicker.querySelectorAll('button[name="minute"]') as NodeListOf<HTMLElement>;
}

function getMeridieButtons(): NodeListOf<HTMLElement> {
  const timepicker = getTimepicker();
  return timepicker.querySelectorAll('button[name="meridie"]') as NodeListOf<HTMLElement>;
}

function getCloseButton(): HTMLElement {
  return document.querySelector('.sky-timepicker-footer button') as HTMLElement;
}

function closeTimepicker(fixture: ComponentFixture<any>): void {
  const closeButton = getCloseButton();
  closeButton.click();
  fixture.detectChanges();
  tick();
}

/**
 * Avoid 'X timers in queue' error by cycling all setTimeouts to end.
 */
function flushTimers(): void {
  flush();
}

function setInput(
  text: string,
  fixture: ComponentFixture<any>
): void {
  const inputElement = fixture.nativeElement.querySelectorAll('input').item(0);
  inputElement.value = text;
  fixture.detectChanges();

  SkyAppTestUtility.fireDomEvent(inputElement, 'change');
  fixture.detectChanges();
  tick();
}

function verifyTimepicker(fixture: ComponentFixture<any>): void {
  const component = fixture.componentInstance;
  const hours = getHourButtons();
  const minutes = getMinuteButtons();
  const meridies = getMeridieButtons();

  if (component.timeFormat === 'hh' || !component.timeFormat) {
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

function detectChangesAndTick(fixture: ComponentFixture<any>): void {
  fixture.detectChanges();
  tick();
}
//#endregion

describe('Timepicker', () => {
  describe('basic setup', () => {
    let fixture: ComponentFixture<TimepickerTestComponent>;
    let component: TimepickerTestComponent;

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
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should show timepicker when button is clicked', fakeAsync(() => {
      detectChangesAndTick(fixture);

      openTimepicker(fixture);
      const timepicker = getTimepicker();

      expect(timepicker).not.toBeNull();

      flushTimers();
    }));

    it('should close timepicker when "done" button is clicked', fakeAsync(() => {
      detectChangesAndTick(fixture);

      openTimepicker(fixture);
      closeTimepicker(fixture);
      const timepicker = getTimepicker();

      expect(timepicker).toBeNull();

      flushTimers();
    }));

    it('should default to the 12-hour timepicker when timeFormat is undefined', fakeAsync(() => {
      component.timeFormat = undefined;
      detectChangesAndTick(fixture);

      openTimepicker(fixture);

      verifyTimepicker(fixture);

      flushTimers();
    }));

    it('should properly display the 12-hour timepicker', fakeAsync(() => {
      component.timeFormat = 'hh';
      detectChangesAndTick(fixture);

      openTimepicker(fixture);

      verifyTimepicker(fixture);

      flushTimers();
    }));

    it('should handle empty time values', fakeAsync(() => {
      (component.selectedTime as any) = '';
      detectChangesAndTick(fixture);

      openTimepicker(fixture);

      verifyTimepicker(fixture);

      flushTimers();
    }));

    it('should properly display the 24-hour timepicker', fakeAsync(() => {
      component.timeFormat = 'HH';
      detectChangesAndTick(fixture);

      openTimepicker(fixture);

      verifyTimepicker(fixture);

      flushTimers();
    }));

    it('should update active buttons when input value changes in twelve hour timeFormat', fakeAsync(() => {
      component.timeFormat = 'hh';
      fixture.detectChanges();
      tick();

      // Test 2:30 AM
      setInput('2:30 AM', fixture);

      openTimepicker(fixture);
      const hours = getHourButtons();
      const minutes = getMinuteButtons();
      const meridies = getMeridieButtons();

      expect(getInput(fixture).value).toBe('2:30 AM');
      expect(hours.item(1)).toHaveCssClass('sky-btn-active');
      expect(minutes.item(6)).toHaveCssClass('sky-btn-active');
      expect(meridies.item(0)).toHaveCssClass('sky-btn-active');

      // Test 4:55 PM
      setInput('4:55 PM', fixture);

      expect(getInput(fixture).value).toBe('4:55 PM');
      expect(hours.item(3)).toHaveCssClass('sky-btn-active');
      expect(minutes.item(11)).toHaveCssClass('sky-btn-active');
      expect(meridies.item(1)).toHaveCssClass('sky-btn-active');

      flushTimers();
    }));

    it('should update active buttons when input value changes in twenty four hour timeFormat', fakeAsync(() => {
      component.timeFormat = 'HH';
      fixture.detectChanges();
      tick();

      // Test 2:30 AM
      setInput('2:30', fixture);

      openTimepicker(fixture);
      const hours = getHourButtons();
      const minutes = getMinuteButtons();

      expect(getInput(fixture).value).toBe('2:30');
      expect(hours.item(2)).toHaveCssClass('sky-btn-active');
      expect(minutes.item(2)).toHaveCssClass('sky-btn-active');

      // Test 4:45 PM
      setInput('16:45', fixture);

      expect(getInput(fixture).value).toBe('16:45');
      expect(hours.item(16)).toHaveCssClass('sky-btn-active');
      expect(minutes.item(3)).toHaveCssClass('sky-btn-active');

      flushTimers();
    }));

    it('should update input value on mouse click for twelve hour timeFormat', fakeAsync(() => {
      component.timeFormat = 'hh';
      fixture.detectChanges();
      tick();

      openTimepicker(fixture);

      const hours = getHourButtons();
      const minutes = getMinuteButtons();
      const meridies = getMeridieButtons();

      // Test 2:30 AM
      hours.item(1).click();
      minutes.item(6).click();
      meridies.item(0).click();

      expect(getInput(fixture).value).toBe('2:30 AM');

      // Test 4:55 PM
      hours.item(3).click();
      minutes.item(11).click();
      meridies.item(1).click();

      expect(getInput(fixture).value).toBe('4:55 PM');

      flushTimers();
    }));

    it('should update input value on mouse click for twenty four hour timeFormat', fakeAsync(() => {
      component.timeFormat = 'HH';
      fixture.detectChanges();
      tick();

      openTimepicker(fixture);

      const hours = getHourButtons();
      const minutes = getMinuteButtons();

      // Test 2:30 AM
      hours.item(2).click();
      minutes.item(2).click();

      expect(getInput(fixture).value).toBe('02:30');

      // Test 4:45 PM
      hours.item(16).click();
      minutes.item(3).click();

      expect(getInput(fixture).value).toBe('16:45');

      flushTimers();
    }));

    it('should return a custom time timeFormat', fakeAsync(() => {
      component.timeFormat = 'HH';
      component.returnFormat = 'HH:mm:ssZ';
      fixture.detectChanges();
      tick();

      openTimepicker(fixture);

      const hours = getHourButtons();
      const minutes = getMinuteButtons();
      const tz = moment(new Date()).format('Z');

      // Test 4:45 PM
      hours.item(16).click();
      minutes.item(3).click();

      expect(getInput(fixture).value).toBe('16:45:00' + tz);

      flushTimers();
    }));

    it('should toggle AM and set active css', fakeAsync(() => {
      component.timeFormat = 'hh';
      fixture.detectChanges();
      tick();

      setInput('1:00 PM', fixture);

      openTimepicker(fixture);
      const hours = getHourButtons();
      const minutes = getMinuteButtons();
      const meridies = getMeridieButtons();

      // Test 12:30 AM
      hours.item(11).click();
      minutes.item(6).click();
      meridies.item(0).click();

      expect(getInput(fixture).value).toBe('12:30 AM');
      expect(component.selectedTime.local).toEqual('12:30 AM');
      expect(meridies.item(0)).toHaveCssClass('sky-btn-active');

      flushTimers();
    }));

    it('should toggle PM and set active css', fakeAsync(() => {
      component.timeFormat = 'hh';
      fixture.detectChanges();
      tick();

      setInput('1:00 AM', fixture);

      openTimepicker(fixture);
      const hours = getHourButtons();
      const minutes = getMinuteButtons();
      const meridies = getMeridieButtons();

      // Test 12:30 PM
      hours.item(11).click();
      minutes.item(6).click();
      meridies.item(1).click();

      expect(getInput(fixture).value).toBe('12:30 PM');
      expect(component.selectedTime.local).toEqual('12:30 PM');
      expect(meridies.item(1)).toHaveCssClass('sky-btn-active');

      // Test 1:30 PM
      hours.item(0).click();
      minutes.item(6).click();
      meridies.item(1).click();

      expect(getInput(fixture).value).toBe('1:30 PM');
      expect(component.selectedTime.local).toEqual('1:30 PM');
      expect(meridies.item(1)).toHaveCssClass('sky-btn-active');

      flushTimers();
    }));

    it('should apply aria-label to the timepicker input when none is provided', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(getInput(fixture).getAttribute('aria-label')).toBe('Time input field');
    }));

    it('should not overwrite aria-label on the timepicker input when one is provided', fakeAsync(() => {
      getInput(fixture).setAttribute('aria-label', 'This is a time field.');
      detectChangesAndTick(fixture);

      expect(getInput(fixture).getAttribute('aria-label')).toBe('This is a time field.');
    }));

    it('should close picker when `escape` key is pressed', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);

      SkyAppTestUtility.fireDomEvent(window.document, 'keydown', {
        customEventInit: {
          key: 'escape'
        }
      });
      detectChangesAndTick(fixture);
      const picker = getTimepicker();

      expect(picker).toBeNull();
    }));

    it('should close picker when clicking on a dackdrop', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);

      document.body.click();
      detectChangesAndTick(fixture);
      const picker = getTimepicker();

      expect(picker).toBeNull();
    }));

    it('should hide when timepicker is scrolled off screen', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);

      const affixer = component.timepickerComponent['affixer'];
      // tslint:disable-next-line: no-null-keyword
      affixer['_placementChange'].next({ placement: null });
      detectChangesAndTick(fixture);

      expect(component.timepickerComponent.isVisible).toBe(false);
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();

      openTimepicker(fixture, true);

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('template-driven form', () => {
    let fixture: ComponentFixture<TimepickerTestComponent>;
    let component: TimepickerTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          TimepickerTestComponent
        ],
        providers: [
          NgModel
        ],
        imports: [
          SkyTimepickerModule,
          NoopAnimationsModule,
          FormsModule
        ]
      });

      fixture = TestBed.createComponent(TimepickerTestComponent);
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should update input value when form control is set programatically', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const newDate = moment({'hour': 12, 'minute': 30}).toDate();
      component.selectedTime = {
        hour: 12,
        minute: 30,
        meridie: 'PM',
        timezone: 0,
        iso8601: newDate,
        local: '12:30 PM',
        customFormat: 'h:mm A'
      };
      detectChangesAndTick(fixture);

      expect(getInput(fixture).value).toBe('12:30 PM');
      expect(component.selectedTime.local).toEqual('12:30 PM');
    }));

    it('should update model when input value is changed', fakeAsync(() => {
      detectChangesAndTick(fixture);

      setInput('2:55 AM', fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.selectedTime.local).toEqual('2:55 AM');
    }));

    it('should handle undefined date', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.selectedTime = undefined;
      fixture.detectChanges();

      expect(getInput(fixture).value).toBe('');
      expect(getInput(fixture)).not.toHaveCssClass('ng-invalid');
    }));

    it('should properly update model and input when required and undefined', fakeAsync(() => {
      detectChangesAndTick(fixture);
      const inputElement = fixture.debugElement.query(By.css('input'));
      const ngModel = inputElement.injector.get(NgModel);

      setInput('2:30 PM', fixture);
      component.required = true;
      fixture.detectChanges();

      expect(ngModel.valid).toEqual(true);
      expect(getInput(fixture)).not.toHaveCssClass('ng-invalid');

      component.selectedTime = undefined;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(ngModel.valid).toEqual(false);
      expect(getInput(fixture)).toHaveCssClass('ng-invalid');
    }));

    it('should properly set disabled state on input and trigger button', fakeAsync(() => {
      component.disabled = true;
      detectChangesAndTick(fixture);

      expect(fixture.componentInstance.timepicker.disabled).toBeTruthy();
      expect(fixture.componentInstance.timepickerComponent.disabled).toBeTruthy();
      expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
      expect(getTriggerButton(fixture).disabled).toBeTruthy();

      component.disabled = false;
      fixture.detectChanges();

      expect(fixture.componentInstance.timepicker.disabled).toBeFalsy();
      expect(fixture.componentInstance.timepickerComponent.disabled).toBeFalsy();
      expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
      expect(getTriggerButton(fixture).disabled).toBeFalsy();
    }));
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<TimepickerReactiveTestComponent>;
    let component: TimepickerReactiveTestComponent;

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
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should set the initial value correctly', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.timeControl.value.local).toEqual('2:55 AM');
    }));

    it('should update input value when form control is set programatically', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.timeControl.setValue('12:30 PM');
      fixture.detectChanges();

      expect(getInput(fixture).value).toBe('12:30 PM');
      expect(component.timeControl.value.local).toEqual('12:30 PM');
    }));

    it('should update form control when the input value is changed', fakeAsync(() => {
      detectChangesAndTick(fixture);

      setInput('2:55 AM', fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.timeControl.value.local).toEqual('2:55 AM');
    }));

    it('should handle an undefined date', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.timeControl.setValue(undefined);
      fixture.detectChanges();

      expect(getInput(fixture).value).toBe('');
      expect(getInput(fixture)).not.toHaveCssClass('ng-invalid');
      expect(component.timeControl.value).toBeUndefined();
    }));

    it('should properly update form control state when required and undefined', fakeAsync(() => {
      detectChangesAndTick(fixture);
      component.timeControl.setValidators(Validators.required);
      fixture.detectChanges();

      expect(component.timeControl.valid).toEqual(true);
      expect(getInput(fixture)).not.toHaveCssClass('ng-invalid');

      component.timeControl.setValue(undefined);
      fixture.detectChanges();

      expect(component.timeControl.valid).toEqual(false);
      expect(getInput(fixture)).toHaveCssClass('ng-invalid');
    }));

    it('should properly set disabled state on input and trigger button', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.timeControl.disable();
      fixture.detectChanges();

      expect(fixture.componentInstance.timepickerDirective.disabled).toBeTruthy();
      expect(fixture.componentInstance.timepickerComponent.disabled).toBeTruthy();
      expect(getInput(fixture).disabled).toBeTruthy();
      expect(getTriggerButton(fixture).disabled).toBeTruthy();

      component.timeControl.enable();
      fixture.detectChanges();

      expect(fixture.componentInstance.timepickerDirective.disabled).toBeFalsy();
      expect(fixture.componentInstance.timepickerComponent.disabled).toBeFalsy();
      expect(getInput(fixture).disabled).toBeFalsy();
      expect(getTriggerButton(fixture).disabled).toBeFalsy();
    }));
  });
});
