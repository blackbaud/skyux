import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import { SkyPopoverMessageType } from '@skyux/popovers';

import { SkyDatepickerModule } from '../datepicker.module';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarService } from './datepicker-calendar.service';
import { SkyDayPickerCellComponent } from './daypicker-cell.component';
import { SkyDayPickerContext } from './daypicker-context';

function getDaypickerCell(
  fixture: ComponentFixture<SkyDayPickerCellComponent>,
): HTMLElement | null {
  return fixture.nativeElement.querySelector('.sky-daypicker-cell');
}

function setActiveUid(component: any, uid?: string): void {
  if (uid) {
    const date: SkyDayPickerContext = {
      date: new Date(),
      label: 'foo',
      selected: false,
      disabled: false,
      current: false,
      secondary: false,
      uid: uid,
    };
    TestBed.inject(SkyDatepickerCalendarService).keyDatePopoverStream.next(
      date,
    );
  }
}

class MockSkyCalendarInnerComponent {
  public isActive(value: any): boolean {
    return false;
  }

  public dateFilter(value: Date, format: string): string {
    return 'Formatted date';
  }
}

describe('daypicker cell', () => {
  let fixture: ComponentFixture<SkyDayPickerCellComponent>;
  let component: SkyDayPickerCellComponent;
  let datepickerService: SkyDatepickerCalendarService;
  const calendarInnerComponent = new MockSkyCalendarInnerComponent();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SkyDatepickerModule, NoopAnimationsModule],
      providers: [
        {
          provide: SkyDatepickerCalendarInnerComponent,
          useValue: calendarInnerComponent,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyDayPickerCellComponent);
    component = fixture.componentInstance;
    component.date = {
      current: false,
      date: new Date(2021, 9, 1),
      disabled: false,
      label: '1',
      secondary: false,
      selected: false,
      uid: '1',
      keyDate: true,
      keyDateText: ['important!'],
    };
    datepickerService = TestBed.inject(SkyDatepickerCalendarService);
  });

  describe('set hasTooltip', () => {
    it('should set hasTooltip to false if not a key date', () => {
      if (component.date) {
        component.date.keyDate = false;
      }
      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to false if a key date and keyDateText undefined', () => {
      if (component.date) {
        component.date.keyDateText = undefined;
      }

      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to false if a key date and no keyDateText items', () => {
      if (component.date) {
        component.date.keyDateText = [];
      }

      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to false if a key date and keyDateText item empty', () => {
      if (component.date) {
        component.date.keyDateText = [''];
      }

      fixture.detectChanges();

      expect(component.hasTooltip).toBeFalsy();
    });

    it('should set hasTooltip to true if key date and keyDateText item not empty', () => {
      fixture.detectChanges();

      expect(component.hasTooltip).toBeTruthy();
    });
  });

  describe('showTooltip on Init', () => {
    let controllerSpy: jasmine.Spy;
    let activeDateSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();

      activeDateSpy = spyOn(calendarInnerComponent, 'isActive').and.returnValue(
        true,
      );
      component.activeDateHasChanged = true;
    });

    it('should not show tooltip when not active date', fakeAsync(() => {
      activeDateSpy.and.returnValue(false);
      fixture.detectChanges();
      tick(500);

      expect(controllerSpy).not.toHaveBeenCalled();
    }));

    it('should not show tooltip when no tooltip', fakeAsync(() => {
      if (component.date) {
        component.date.keyDate = false;
      }
      fixture.detectChanges();
      tick(500);

      expect(controllerSpy).not.toHaveBeenCalled();
    }));

    it('should not show tooltip when active date has not changed', fakeAsync(() => {
      component.activeDateHasChanged = false;
      fixture.detectChanges();
      tick(500);

      expect(controllerSpy).not.toHaveBeenCalled();
    }));

    it('should show tooltip', fakeAsync(() => {
      fixture.detectChanges();
      tick(500);

      expect(controllerSpy).toHaveBeenCalled();
    }));
  });

  describe('datepickerService keyDatePopoverStream', () => {
    let controllerSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();

      fixture.detectChanges();
    });

    it('should hide the tooltip if no mouseover date', fakeAsync(() => {
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      tick(500);
      fixture.detectChanges();
      datepickerService.keyDatePopoverStream.next(undefined);

      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Close,
      });
    }));

    it('should hide the tooltip if new mouseover date', fakeAsync(() => {
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      tick(500);
      fixture.detectChanges();
      datepickerService.keyDatePopoverStream.next({
        current: false,
        date: new Date(),
        disabled: false,
        label: '2',
        secondary: false,
        selected: false,
        uid: '2',
      });

      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Close,
      });
    }));

    it('should not hide the tooltip if mouseover this date', fakeAsync(() => {
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      tick(500);
      fixture.detectChanges();
      controllerSpy.calls.reset();
      datepickerService.keyDatePopoverStream.next(component.date);

      expect(controllerSpy).not.toHaveBeenCalled();
    }));
  });

  describe('onDayMouseenter', () => {
    let controllerSpy: jasmine.Spy;
    let nextDateSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();

      nextDateSpy = spyOn(
        datepickerService.keyDatePopoverStream,
        'next',
      ).and.callThrough();
    });

    it('should not call showTooltip if no tooltip', fakeAsync(() => {
      if (component.date) {
        component.date.keyDate = false;
      }
      fixture.detectChanges();

      component.onDayMouseenter();
      fixture.detectChanges();
      tick(500);

      expect(component.hasTooltip).toBeFalsy();
      expect(controllerSpy).not.toHaveBeenCalled();
      expect(nextDateSpy).not.toHaveBeenCalled();
    }));

    it('should call showTooltip if have tooltip', fakeAsync(() => {
      fixture.detectChanges();

      component.onDayMouseenter();
      fixture.detectChanges();
      tick(500);

      expect(component.hasTooltip).toBeTruthy();
      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Open,
      });
      expect(nextDateSpy).toHaveBeenCalledWith(component.date);
    }));
  });

  describe('onDayMouseleave', () => {
    let controllerSpy: jasmine.Spy;
    let nextDateSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();

      nextDateSpy = spyOn(
        datepickerService.keyDatePopoverStream,
        'next',
      ).and.callThrough();
    });

    it('should not call controller if no tooltip', fakeAsync(() => {
      if (component.date) {
        component.date.keyDate = false;
      }
      fixture.detectChanges();

      component.onDayMouseleave();
      fixture.detectChanges();
      tick(500);

      expect(component.hasTooltip).toBeFalsy();
      expect(controllerSpy).not.toHaveBeenCalled();
      expect(nextDateSpy).toHaveBeenCalledWith(undefined);
    }));

    it('should call controller to close tooltip if have tooltip', fakeAsync(() => {
      fixture.detectChanges();

      component.onDayMouseenter();
      fixture.detectChanges();
      tick(500);
      component.onDayMouseleave();

      expect(component.hasTooltip).toBeTruthy();
      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Close,
      });
      expect(nextDateSpy).toHaveBeenCalledWith(undefined);
    }));
  });

  describe('onPopoverOpen', () => {
    let controllerSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();
    });

    it('should hide popover if cancelled', () => {
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseleave');

      component.onPopoverOpened();

      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Close,
      });
    });
  });

  describe('getKeyDateLabel', () => {
    it('should return empty string if no tooltip', () => {
      if (component.date) {
        component.date.keyDate = false;
      }
      fixture.detectChanges();

      expect(component.getKeyDateLabel()).toBe('');
    });

    it('should return a single string if a single keyDateText', () => {
      fixture.detectChanges();

      expect(component.getKeyDateLabel()).toBe('important!');
    });

    it('should return a comma delimited string if multiple keyDateTexts', () => {
      if (component.date) {
        component.date.keyDateText = ['important!', 'this too'];
      }

      fixture.detectChanges();

      expect(component.getKeyDateLabel()).toBe('important!, this too');
    });
  });

  describe('hideTooltip', () => {
    let controllerSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();
    });

    it('should close the popover if open', fakeAsync(() => {
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      tick(500);
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseleave');

      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Close,
      });
    }));

    it('should not close the popover if not open', () => {
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseleave');

      expect(controllerSpy).not.toHaveBeenCalled();
    });
  });

  describe('showTooltip', () => {
    let controllerSpy: jasmine.Spy;

    beforeEach(() => {
      controllerSpy = spyOn(
        component.popoverController,
        'next',
      ).and.callThrough();
    });

    it('should not open the tool tip if hasTooltip is false', fakeAsync(() => {
      if (component.date) {
        component.date.keyDate = false;
      }
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');

      tick(500);
      fixture.detectChanges();

      expect(controllerSpy).not.toHaveBeenCalled();
    }));

    it('should not open the tool tip if already open', fakeAsync(() => {
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');

      tick(500);
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');

      tick(500);
      fixture.detectChanges();

      expect(controllerSpy).toHaveBeenCalledTimes(1);
    }));

    it('should not open the tool tip if cancelled', async () => {
      fixture.detectChanges();
      setActiveUid(component, component.date?.uid);

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseleave');

      await fixture.whenStable();
      fixture.detectChanges();

      await fixture.whenStable();
      expect(controllerSpy).not.toHaveBeenCalled();
    });

    it('should not open the tool tip if activeUid differs', fakeAsync(() => {
      fixture.detectChanges();
      setActiveUid(component, '2');
      // The mouseenter will reset this - for this test we want to test the state if this wouldn't have happened
      spyOn(
        TestBed.inject(SkyDatepickerCalendarService).keyDatePopoverStream,
        'next',
      );
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');

      tick(500);
      fixture.detectChanges();

      expect(controllerSpy).not.toHaveBeenCalled();
    }));

    it('should open the tool tip', fakeAsync(() => {
      fixture.detectChanges();
      setActiveUid(component, component.date?.uid);

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');

      tick(500);
      fixture.detectChanges();

      expect(controllerSpy).toHaveBeenCalledWith({
        type: SkyPopoverMessageType.Open,
      });
    }));
  });
});
