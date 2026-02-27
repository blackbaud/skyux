import { ComponentRef } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { SkyDatepickerModule } from '../datepicker.module';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarService } from './datepicker-calendar.service';
import { SkyDayPickerCellComponent } from './daypicker-cell.component';
import { SkyDayPickerContext } from './daypicker-context';

class MockSkyCalendarInnerComponent {
  public isActive(): boolean {
    return false;
  }

  public dateFilter(): string {
    return 'Formatted date';
  }
}

const CONTEXT_WITH_KEY_DATE: SkyDayPickerContext = {
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

function expectAriaLabel(
  fixture: ComponentFixture<SkyDayPickerCellComponent>,
  label: string | null,
): void {
  const cell = getDaypickerCell(fixture);

  expect(cell?.getAttribute('aria-label')).toEqual(label);
}

function expectHasPopoverTrigger(
  fixture: ComponentFixture<SkyDayPickerCellComponent>,
  exists: boolean,
): void {
  const cell = getDaypickerCell(fixture);

  if (exists) {
    expect(cell).toHaveClass('sky-popover-trigger');
  } else {
    expect(cell).not.toHaveClass('sky-popover-trigger');
  }
}

function expectPopoverOpened(opened: boolean): void {
  const popover = document.querySelector<HTMLElement>('sky-popover-content');

  expect(!!popover).toEqual(opened);
}

function getDaypickerCell(
  fixture: ComponentFixture<SkyDayPickerCellComponent>,
): HTMLElement | null {
  return fixture.nativeElement.querySelector('.sky-daypicker-cell');
}

describe('daypicker cell', () => {
  let fixture: ComponentFixture<SkyDayPickerCellComponent>;
  let componentRef: ComponentRef<SkyDayPickerCellComponent>;
  let calendarSvc: SkyDatepickerCalendarService;

  const calendarInnerComponent = new MockSkyCalendarInnerComponent();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SkyDatepickerModule],
      providers: [
        {
          provide: SkyDatepickerCalendarInnerComponent,
          useValue: calendarInnerComponent,
        }],
    });

    fixture = TestBed.createComponent(SkyDayPickerCellComponent);
    componentRef = fixture.componentRef;
    calendarSvc = TestBed.inject(SkyDatepickerCalendarService);
  });

  describe('set hasTooltip', () => {
    it('should set hasTooltip to false if not a key date', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDate: false,
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, false);
    });

    it('should set hasTooltip to false if a key date and keyDateText undefined', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDateText: undefined,
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, false);
    });

    it('should set hasTooltip to false if a key date and no keyDateText items', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDateText: [],
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, false);
    });

    it('should set hasTooltip to false if a key date and keyDateText item empty', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDateText: [''],
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, false);
    });

    it('should set hasTooltip to true if key date and keyDateText item not empty', () => {
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);

      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, true);
    });

    it('should enable previously disabled tooltips when date value changes after init', () => {
      fixture.componentRef.setInput('date', {});
      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, false);

      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);
      fixture.detectChanges();

      expectHasPopoverTrigger(fixture, true);
    });
  });

  describe('showTooltip on Init', () => {
    let activeDateSpy: jasmine.Spy;

    beforeEach(() => {
      activeDateSpy = spyOn(calendarInnerComponent, 'isActive').and.returnValue(
        true,
      );
    });

    it('should not show tooltip when not active date', () => {
      activeDateSpy.and.returnValue(false);

      componentRef.setInput('activeDateHasChanged', true);
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);

      fixture.detectChanges();

      expectPopoverOpened(false);
    });

    it('should not show tooltip when active date has not changed', () => {
      componentRef.setInput('activeDateHasChanged', false);
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);

      fixture.detectChanges();

      expectPopoverOpened(false);
    });

    it('should show tooltip on init', () => {
      componentRef.setInput('activeDateHasChanged', true);
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);

      fixture.detectChanges();

      expectPopoverOpened(true);
    });
  });

  describe('datepickerService keyDatePopoverStream', () => {
    beforeEach(() => {
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);
    });

    it('should hide the tooltip if no mouseover date', fakeAsync(() => {
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(true);

      calendarSvc.keyDatePopoverStream.next(undefined);
      fixture.detectChanges();
      tick();

      expectPopoverOpened(false);
    }));

    it('should hide the tooltip if new mouseover date', fakeAsync(() => {
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(true);

      calendarSvc.keyDatePopoverStream.next({
        current: false,
        date: new Date(),
        disabled: false,
        label: '2',
        secondary: false,
        selected: false,
        uid: '2',
      });

      fixture.detectChanges();
      tick();

      expectPopoverOpened(false);
    }));

    it('should not hide the tooltip if mouseover this date', fakeAsync(() => {
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(true);

      calendarSvc.keyDatePopoverStream.next(CONTEXT_WITH_KEY_DATE);
      fixture.detectChanges();
      tick();

      expectPopoverOpened(true);
    }));
  });

  describe('accessibility', () => {
    it('should not assign aria-label if no tooltip', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDate: false,
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectAriaLabel(fixture, null);
    });

    it('should return a single string if a single keyDateText', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDateText: ['foo'],
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectAriaLabel(fixture, 'foo');
    });

    it('should return a comma delimited string if multiple keyDateTexts', () => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDateText: ['important!', 'this too'],
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      expectAriaLabel(fixture, 'important!, this too');
    });
  });

  describe('hideTooltip', () => {
    it('should close the popover on mouseleave if open', fakeAsync(() => {
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(true);

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseleave');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(false);
    }));
  });

  describe('showTooltip', () => {
    it('should not open the tooltip on mouseenter if not a key date', fakeAsync(() => {
      componentRef.setInput('date', {
        ...CONTEXT_WITH_KEY_DATE,
        keyDate: false,
      } satisfies SkyDayPickerContext);

      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(false);
    }));

    it('should open the tooltip on mouseenter', fakeAsync(() => {
      componentRef.setInput('date', CONTEXT_WITH_KEY_DATE);
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(getDaypickerCell(fixture), 'mouseenter');
      fixture.detectChanges();
      tick();

      expectPopoverOpened(true);
    }));
  });
});
