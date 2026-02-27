import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import {
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SKY_STACKING_CONTEXT } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

import { TimepickerTestComponent } from './fixtures/timepicker-component.fixture';
import { TimepickerInputBoxTestComponent } from './fixtures/timepicker-input-box-component.fixture';
import { TimepickerReactiveTestComponent } from './fixtures/timepicker-reactive-component.fixture';
import { SkyTimepickerModule } from './timepicker.module';

//#region helpers
function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function getTriggerButton(fixture: ComponentFixture<any>): HTMLButtonElement {
  return fixture.nativeElement.querySelector(
    '.sky-input-group-timepicker-btn',
  ) as HTMLButtonElement;
}

function openTimepicker(fixture: ComponentFixture<any>, isAsync = false): void {
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
  return timepicker.querySelectorAll(
    'button[name="hour"]',
  ) as NodeListOf<HTMLElement>;
}

function getMinuteButtons(): NodeListOf<HTMLElement> {
  const timepicker = getTimepicker();
  return timepicker.querySelectorAll(
    'button[name="minute"]',
  ) as NodeListOf<HTMLElement>;
}

function getMeridieButtons(): NodeListOf<HTMLElement> {
  const timepicker = getTimepicker();
  return timepicker.querySelectorAll(
    'button[name="meridie"]',
  ) as NodeListOf<HTMLElement>;
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

function blurInput(fixture: ComponentFixture<any>): void {
  const inputElement = fixture.nativeElement.querySelectorAll('input').item(0);
  SkyAppTestUtility.fireDomEvent(inputElement, 'blur');
  fixture.detectChanges();
  tick();
}

function setInput(text: string, fixture: ComponentFixture<any>): void {
  const inputElement = fixture.nativeElement.querySelectorAll('input').item(0);
  inputElement.value = text;
  fixture.detectChanges();

  SkyAppTestUtility.fireDomEvent(inputElement, 'change');
  fixture.detectChanges();
  tick();

  blurInput(fixture);
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
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };
  });

  describe('basic setup', () => {
    let fixture: ComponentFixture<TimepickerTestComponent>;
    let component: TimepickerTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TimepickerTestComponent],
        imports: [SkyTimepickerModule, FormsModule],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc,
          },
          {
            provide: SKY_STACKING_CONTEXT,
            useValue: {
              zIndex: new BehaviorSubject(111),
            },
          }],
      });

      fixture = TestBed.createComponent(TimepickerTestComponent);
      component = fixture.componentInstance;
    });

    afterEach(() => {
      (
        TestBed.inject(SKY_STACKING_CONTEXT).zIndex as BehaviorSubject<number>
      ).complete();
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

    it('should allow switching between time formats', fakeAsync(() => {
      component.timeFormat = 'hh';
      detectChangesAndTick(fixture);
      openTimepicker(fixture);
      verifyTimepicker(fixture);
      closeTimepicker(fixture);

      component.timeFormat = 'HH';
      detectChangesAndTick(fixture);
      openTimepicker(fixture);
      verifyTimepicker(fixture);
      closeTimepicker(fixture);

      component.timeFormat = 'hh';
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
      expect(component.selectedTime?.local).toEqual('12:30 AM');
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
      expect(component.selectedTime?.local).toEqual('12:30 PM');
      expect(meridies.item(1)).toHaveCssClass('sky-btn-active');

      // Test 1:30 PM
      hours.item(0).click();
      minutes.item(6).click();
      meridies.item(1).click();

      expect(getInput(fixture).value).toBe('1:30 PM');
      expect(component.selectedTime?.local).toEqual('1:30 PM');
      expect(meridies.item(1)).toHaveCssClass('sky-btn-active');

      flushTimers();
    }));

    it('should not overwrite aria-label on the timepicker input when one is provided', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(getInput(fixture).getAttribute('aria-label')).toBe(
        'This is a time field.',
      );
    }));

    it('should close picker when `escape` key is pressed', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);
      let picker = getTimepicker();

      SkyAppTestUtility.fireDomEvent(picker, 'keyup', {
        customEventInit: {
          key: 'escape',
        },
      });
      detectChangesAndTick(fixture);
      picker = getTimepicker();

      expect(picker).toBeNull();
    }));

    it('should handle non-keyboard events', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);
      let picker = getTimepicker();

      SkyAppTestUtility.fireDomEvent(picker, 'keyup', {
        customEventInit: {}, // Don't pass in a key value.
      });
      detectChangesAndTick(fixture);
      picker = getTimepicker();

      expect(picker).not.toBeNull();
    }));

    it('should close picker when clicking on a backdrop', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);

      document.body.click();
      detectChangesAndTick(fixture);
      const picker = getTimepicker();

      expect(picker).toBeNull();
    }));

    it('should hide when timepicker is scrolled off screen', fakeAsync(() => {
      // Make the body element scrollable.
      window.document.body.style.height = '5000px';

      detectChangesAndTick(fixture);
      openTimepicker(fixture);

      // Scroll timepicker offscreen.
      window.scrollTo(0, 1000);
      SkyAppTestUtility.fireDomEvent(window.visualViewport, 'scroll');
      detectChangesAndTick(fixture);

      expect(component.timepickerComponent.isVisible).toBe(false);

      // Reset body height.
      window.document.body.style.height = 'initial';
    }));

    it('should be accessible', async () => {
      fixture.detectChanges();
      openTimepicker(fixture, true);
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('template-driven form', () => {
    let fixture: ComponentFixture<TimepickerTestComponent>;
    let component: TimepickerTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TimepickerTestComponent],
        providers: [NgModel],
        imports: [SkyTimepickerModule, FormsModule],
      });

      fixture = TestBed.createComponent(TimepickerTestComponent);
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should update input value when form control is set programmatically', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const newDate = moment({ hour: 12, minute: 30 }).toDate();
      component.selectedTime = {
        hour: 12,
        minute: 30,
        meridie: 'PM',
        timezone: 0,
        iso8601: newDate,
        local: '12:30 PM',
        customFormat: 'h:mm A',
      };
      detectChangesAndTick(fixture);

      expect(getInput(fixture).value).toBe('12:30 PM');
      expect(component.selectedTime?.local).toEqual('12:30 PM');
    }));

    it('should update model when input value is changed', fakeAsync(() => {
      detectChangesAndTick(fixture);

      setInput('2:55 AM', fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.selectedTime?.local).toEqual('2:55 AM');
    }));

    it('should highlight the minute that is the passed multiple of five in the 12 hour picker', fakeAsync(() => {
      detectChangesAndTick(fixture);
      setInput('2:33 AM', fixture);
      openTimepicker(fixture);

      const timepicker = getTimepicker();
      const highlightedMinute = timepicker.querySelector(
        'button[name="minute"].sky-btn-active',
      );

      expect(highlightedMinute).toHaveText('30');
    }));

    it('should highlight the minute that is the passed multiple of fifteen in the 24 hour picker ', fakeAsync(() => {
      component.timeFormat = 'HH';
      detectChangesAndTick(fixture);
      setInput('02:23', fixture);
      openTimepicker(fixture);

      const timepicker = getTimepicker();
      const highlightedMinute = timepicker.querySelector(
        'button[name="minute"].sky-btn-active',
      );

      expect(highlightedMinute).toHaveText('15');
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
      detectChangesAndTick(fixture);
      component.disabled = true;
      detectChangesAndTick(fixture);

      expect(fixture.componentInstance.timepicker.disabled).toBeTruthy();
      expect(
        fixture.componentInstance.timepickerComponent.disabled,
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.disabled,
      ).toBeTruthy();
      expect(getTriggerButton(fixture).disabled).toBeTruthy();

      component.disabled = false;
      fixture.detectChanges();

      expect(fixture.componentInstance.timepicker.disabled).toBeFalsy();
      expect(
        fixture.componentInstance.timepickerComponent.disabled,
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.disabled,
      ).toBeFalsy();
      expect(getTriggerButton(fixture).disabled).toBeFalsy();
    }));
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<TimepickerReactiveTestComponent>;
    let component: TimepickerReactiveTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TimepickerReactiveTestComponent],
        imports: [
          SkyTimepickerModule,
          FormsModule,
          ReactiveFormsModule],
      });

      fixture = TestBed.createComponent(TimepickerReactiveTestComponent);
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should not change date when switching meridies', fakeAsync(() => {
      detectChangesAndTick(fixture);
      openTimepicker(fixture);
      detectChangesAndTick(fixture);

      const meridieButtons = getMeridieButtons();
      const date = component.timepickerComponent.selectedTime?.iso8601.getDay;

      meridieButtons.item(1).click();

      expect(component.timepickerComponent.selectedTime?.meridie).toBe('PM');
      expect(component.timepickerComponent.selectedTime?.iso8601.getDay).toBe(
        date,
      );

      meridieButtons.item(0).click();

      expect(component.timepickerComponent.selectedTime?.meridie).toBe('AM');
      expect(component.timepickerComponent.selectedTime?.iso8601.getDay).toBe(
        date,
      );
    }));

    it('should set the initial value correctly', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.timeControl?.value.local).toEqual('2:55 AM');
      expect(component.timeControl?.dirty).toBeFalse();
      expect(component.timeControl?.touched).toBeFalse();
    }));

    it('should set the control to touched on blur', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.timeControl?.value.local).toEqual('2:55 AM');
      expect(component.timeControl?.dirty).toBeFalse();
      expect(component.timeControl?.touched).toBeFalse();

      blurInput(fixture);

      expect(component.timeControl?.dirty).toBeFalse();
      expect(component.timeControl?.touched).toBeTrue();
    }));

    it('should update input value when form control is set programmatically', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.timeControl?.setValue('12:30 PM');
      fixture.detectChanges();

      expect(getInput(fixture).value).toBe('12:30 PM');
      expect(component.timeControl?.value.local).toEqual('12:30 PM');
    }));

    it('should update form control when the input value is changed', fakeAsync(() => {
      detectChangesAndTick(fixture);

      setInput('2:55 AM', fixture);

      expect(getInput(fixture).value).toBe('2:55 AM');
      expect(component.timeControl?.value.local).toEqual('2:55 AM');
      expect(component.timeControl?.dirty).toBeTrue();
      expect(component.timeControl?.touched).toBeTrue();
    }));

    it('should handle an undefined date', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.timeControl?.setValue(undefined);
      fixture.detectChanges();

      expect(getInput(fixture).value).toBe('');
      expect(getInput(fixture)).not.toHaveCssClass('ng-invalid');
      expect(component.timeControl?.value).toBeUndefined();
    }));

    it('should properly update form control state when required and undefined', fakeAsync(() => {
      detectChangesAndTick(fixture);
      component.timeControl?.setValidators(Validators.required);
      fixture.detectChanges();

      expect(component.timeControl?.valid).toEqual(true);
      expect(getInput(fixture)).not.toHaveCssClass('ng-invalid');

      component.timeControl?.setValue(undefined);
      fixture.detectChanges();

      expect(component.timeControl?.valid).toEqual(false);
      expect(getInput(fixture)).toHaveCssClass('ng-invalid');
    }));

    it('should properly set disabled state on input and trigger button', fakeAsync(() => {
      detectChangesAndTick(fixture);

      component.timeControl?.disable();
      fixture.detectChanges();

      expect(
        fixture.componentInstance.timepickerDirective.disabled,
      ).toBeTruthy();
      expect(
        fixture.componentInstance.timepickerComponent.disabled,
      ).toBeTruthy();
      expect(getInput(fixture).disabled).toBeTruthy();
      expect(getTriggerButton(fixture).disabled).toBeTruthy();

      component.timeControl?.enable();
      fixture.detectChanges();

      expect(
        fixture.componentInstance.timepickerDirective.disabled,
      ).toBeFalsy();
      expect(
        fixture.componentInstance.timepickerComponent.disabled,
      ).toBeFalsy();
      expect(getInput(fixture).disabled).toBeFalsy();
      expect(getTriggerButton(fixture).disabled).toBeFalsy();
    }));

    it('should immediately initialize input value', fakeAsync(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.timeControlValueAfterInit.local).toEqual('2:55 AM');
    }));
  });

  describe('inside input box', () => {
    let fixture: ComponentFixture<TimepickerInputBoxTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TimepickerInputBoxTestComponent],
        imports: [SkyTimepickerModule, SkyInputBoxModule],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc,
          }],
      });

      fixture = TestBed.createComponent(TimepickerInputBoxTestComponent);
    });

    it('should render in the expected input box containers', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const inputBoxEl = fixture.nativeElement.querySelector('sky-input-box');
      const inputEl = inputBoxEl.querySelector('input');
      const inputGroupBtnEl = inputBoxEl.querySelector(
        '.sky-input-group-btn > button',
      );

      expect(inputEl).toHaveCssClass('input-box-timepicker-input');
      expect(inputGroupBtnEl).toHaveCssClass('sky-input-group-timepicker-btn');
    }));

    it('should set the picker button to a context specific aria label when input box easy mode is used', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const pickerButton = fixture.nativeElement.querySelector(
        '.sky-input-group-timepicker-btn',
      );

      expect(pickerButton.getAttribute('aria-label')).toBe(
        'Open time picker for Time',
      );
    }));

    it('should set the calendar button to a default aria label when input box easy mode is not used', fakeAsync(() => {
      fixture.componentInstance.labelText = '';
      detectChangesAndTick(fixture);

      const pickerButton = fixture.nativeElement.querySelector(
        '.sky-input-group-timepicker-btn',
      );

      expect(pickerButton.getAttribute('aria-label')).toBe('Choose time');
    }));
  });
});
