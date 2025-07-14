import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import moment from 'moment';

import { SkyDatepickerModule } from '../datepicker.module';
import { DatepickerCalendarTestComponent } from '../fixtures/datepicker-calendar.component.fixture';

describe('datepicker calendar', () => {
  let fixture: ComponentFixture<DatepickerCalendarTestComponent>;
  let component: DatepickerCalendarTestComponent;
  let nativeElement: HTMLElement;

  //#region helpers
  function verifyDatepicker(
    element: HTMLElement,
    header: string,
    selectedLabel: string,
    activeLabel: string,
    firstSecondaryDate: string,
  ) {
    // Daypicker
    // verify month and year header
    expect(element.querySelector('.sky-datepicker-calendar-title')).toHaveText(
      header,
    );

    // verify selected date
    if (selectedLabel !== '') {
      expect(
        element.querySelector('td .sky-datepicker-btn-selected'),
      ).toHaveText(selectedLabel);
    } else {
      expect(
        element.querySelector('td .sky-datepicker-btn-selected'),
      ).toBeNull();
    }

    // verify active date
    expect(element.querySelector('td .sky-btn-active')).toHaveText(activeLabel);

    // verify secondary date
    if (firstSecondaryDate !== '') {
      const secondaryEl = element.querySelector('tbody tr td .sky-btn-sm');
      expect(secondaryEl).toHaveText(firstSecondaryDate);

      expect(secondaryEl?.querySelector('span')).toHaveCssClass(
        'sky-datepicker-secondary',
      );
    }
  }

  function clickDatepickerTitle(element: HTMLElement) {
    const monthTrigger = element.querySelector(
      '.sky-datepicker-calendar-title',
    ) as HTMLButtonElement;

    monthTrigger.click();

    fixture.detectChanges();
  }

  function getNextArrow(element: HTMLElement): HTMLButtonElement {
    return element.querySelector(
      '.sky-datepicker-btn-next',
    ) as HTMLButtonElement;
  }

  function clickNextArrow(element: HTMLElement) {
    const nextArrowEl = getNextArrow(element);

    nextArrowEl.click();
    fixture.detectChanges();
  }

  function getPreviousArrow(element: HTMLElement): HTMLButtonElement {
    return element.querySelector(
      '.sky-datepicker-btn-previous',
    ) as HTMLButtonElement;
  }

  function clickPreviousArrow(element: HTMLElement) {
    const previousArrowEl = getPreviousArrow(element);

    previousArrowEl.click();
    fixture.detectChanges();
  }

  function clickNthDate(element: HTMLElement, index: number) {
    const dateButtonEl = element
      .querySelectorAll('tbody tr td .sky-btn-default')
      .item(index) as HTMLButtonElement;

    dateButtonEl.click();
    fixture.detectChanges();
  }

  function verifyNthDateDisabled(
    element: HTMLElement,
    index: number,
    header: string,
    selectedLabel: string,
    activeLabel: string,
    firstSecondaryDate: string,
  ) {
    const dateButtonEl = element
      .querySelectorAll('tbody tr td .sky-btn-default')
      .item(index) as HTMLButtonElement;

    expect(dateButtonEl.disabled).toBeTrue();

    dateButtonEl.click();
    fixture.detectChanges();
    verifyDatepicker(
      element,
      header,
      selectedLabel,
      activeLabel,
      firstSecondaryDate,
    );
  }
  //#endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatepickerCalendarTestComponent],
      imports: [SkyDatepickerModule],
    });

    fixture = TestBed.createComponent(DatepickerCalendarTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  it('should show the appropriate daypicker with the selected date', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    verifyDatepicker(nativeElement, 'April 2017', '04', '04', '26');

    // verify day of week labels
    const dayLabels = nativeElement.querySelectorAll(
      '.sky-datepicker-weekdays',
    );
    expect(dayLabels.item(0)).toHaveText('Su');
    expect(dayLabels.item(1)).toHaveText('Mo');
    expect(dayLabels.item(2)).toHaveText('Tu');
    expect(dayLabels.item(3)).toHaveText('We');
    expect(dayLabels.item(4)).toHaveText('Th');
    expect(dayLabels.item(5)).toHaveText('Fr');
    expect(dayLabels.item(6)).toHaveText('Sa');
  });

  it('should show the month picker with selected date when clicking on the month', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);

    verifyDatepicker(nativeElement, '2017', 'April', 'April', '');
  });

  it('should show the year picker with selected date when clicking the year', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);
    clickDatepickerTitle(nativeElement);

    verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2017', '');
  });

  it('should move to another day within the current month in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickNthDate(nativeElement, 7);

    expect(component.selectedDate).toEqual(new Date('4/2/2017'));

    verifyDatepicker(nativeElement, 'April 2017', '02', '02', '26');
  });

  it('should move to another day in the next month in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickNthDate(nativeElement, 37);

    verifyDatepicker(nativeElement, 'May 2017', '02', '02', '30');
  });

  it('should move to the next month using arrows in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickNextArrow(nativeElement);
    verifyDatepicker(nativeElement, 'May 2017', '', '01', '30');
  });

  it('should move to the previous month using arrows in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');

    fixture.detectChanges();

    clickPreviousArrow(nativeElement);

    verifyDatepicker(nativeElement, 'March 2017', '04', '01', '26');
  });

  it('should move to the next month and move to daypicker when clicking a month in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);

    clickNthDate(nativeElement, 4);

    verifyDatepicker(nativeElement, 'May 2017', '', '01', '30');
  });

  it('should move to the next year when clicking arrows monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);

    clickNextArrow(nativeElement);

    verifyDatepicker(nativeElement, '2018', '', 'April', '');
  });

  it('should move to the previous year when clicking arrows in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);

    clickPreviousArrow(nativeElement);

    verifyDatepicker(nativeElement, '2016', '', 'April', '');
  });

  it('should move to the next year and move to monthpicker when clicking year in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);
    clickDatepickerTitle(nativeElement);

    clickNthDate(nativeElement, 3);

    verifyDatepicker(nativeElement, '2004', '', 'January', '');
  });

  it('should move to the next set of years when clicking arrows in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);
    clickDatepickerTitle(nativeElement);

    clickNextArrow(nativeElement);

    verifyDatepicker(nativeElement, '2021 - 2040', '', '2037', '');
  });

  it('should move to the previous set of years when clicking arrows in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);
    clickDatepickerTitle(nativeElement);

    clickPreviousArrow(nativeElement);

    verifyDatepicker(nativeElement, '1981 - 2000', '', '1997', '');
  });

  it('should handle minDate in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.minDate = new Date('4/2/2017');
    fixture.detectChanges();

    verifyNthDateDisabled(nativeElement, 6, 'April 2017', '04', '04', '');
  });

  it('should handle maxDate in daypicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.maxDate = new Date('4/15/2017');
    fixture.detectChanges();

    verifyNthDateDisabled(nativeElement, 28, 'April 2017', '04', '04', '');
  });

  it('should handle minDate in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.minDate = new Date('4/2/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);

    verifyNthDateDisabled(nativeElement, 2, '2017', 'April', 'April', '');
  });

  it('should handle maxDate in monthpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.maxDate = new Date('4/15/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);

    verifyNthDateDisabled(nativeElement, 4, '2017', 'April', 'April', '');
  });

  it('should handle minDate in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.minDate = new Date('4/2/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);
    clickDatepickerTitle(nativeElement);
    clickPreviousArrow(nativeElement);

    verifyNthDateDisabled(nativeElement, 2, '1981 - 2000', '', '1997', '');

    clickNextArrow(nativeElement);

    verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2017', '');
  });

  it('should handle maxDate in yearpicker', () => {
    component.selectedDate = new Date('4/4/2017');
    component.maxDate = new Date('4/2/2017');
    fixture.detectChanges();

    clickDatepickerTitle(nativeElement);
    clickDatepickerTitle(nativeElement);
    verifyNthDateDisabled(nativeElement, 19, '2001 - 2020', '2017', '2017', '');
  });

  function verifyTodayDayPicker(element: HTMLElement, todaySelected = false) {
    const today = new Date();

    const monthLabel = moment(today.getTime()).format('MMMM');

    const yearLabel = moment(today.getTime()).format('YYYY');

    const dayLabel = moment(today.getTime()).format('DD');

    const dayPickerLabel = monthLabel + ' ' + yearLabel;

    let selectedLabel = '';
    if (todaySelected) {
      selectedLabel = dayLabel;
    }

    verifyDatepicker(element, dayPickerLabel, selectedLabel, dayLabel, '');
  }

  it('should open current month in daypicker when no selected date and no startAtDate is provided', () => {
    fixture.detectChanges();

    verifyTodayDayPicker(nativeElement);
  });

  it('should handle a different startingDay input', () => {
    component.startingDay = 1;

    fixture.detectChanges();

    const dayLabels = nativeElement.querySelectorAll(
      '.sky-datepicker-weekdays',
    );
    expect(dayLabels.item(6)).toHaveText('Su');
    expect(dayLabels.item(0)).toHaveText('Mo');
    expect(dayLabels.item(1)).toHaveText('Tu');
    expect(dayLabels.item(2)).toHaveText('We');
    expect(dayLabels.item(3)).toHaveText('Th');
    expect(dayLabels.item(4)).toHaveText('Fr');
    expect(dayLabels.item(5)).toHaveText('Sa');
  });

  it('should handle a different startingDay input', () => {
    component.startingDay = 3;
    component.selectedDate = new Date('5/4/2017');

    fixture.detectChanges();

    const dayLabels = nativeElement.querySelectorAll(
      '.sky-datepicker-weekdays',
    );
    expect(dayLabels.item(4)).toHaveText('Su');
    expect(dayLabels.item(5)).toHaveText('Mo');
    expect(dayLabels.item(6)).toHaveText('Tu');
    expect(dayLabels.item(0)).toHaveText('We');
    expect(dayLabels.item(1)).toHaveText('Th');
    expect(dayLabels.item(2)).toHaveText('Fr');
    expect(dayLabels.item(3)).toHaveText('Sa');

    verifyDatepicker(nativeElement, 'May 2017', '04', '04', '26');
  });

  it('should allow users to set selected date using the writeValue function', () => {
    fixture.detectChanges();

    component.datepicker.writeValue(undefined);
    fixture.detectChanges();
    verifyTodayDayPicker(nativeElement, true);

    component.datepicker.writeValue(new Date('4/4/2017'));
    fixture.detectChanges();
    verifyDatepicker(nativeElement, 'April 2017', '04', '04', '');

    component.datepicker.writeValue(new Date('4/4/2017'));
    fixture.detectChanges();
    verifyDatepicker(nativeElement, 'April 2017', '04', '04', '');
  });

  it('should handle selected date being set after initialization', fakeAsync(function () {
    // Initialize value.
    component.selectedDate = undefined;
    fixture.detectChanges();
    tick();

    verifyTodayDayPicker(nativeElement);

    // Set the value again.
    component.selectedDate = new Date('1/1/2000');
    fixture.detectChanges();
    tick();

    verifyDatepicker(nativeElement, 'January 2000', '01', '01', '');
  }));

  describe('keyboard behaviors', () => {
    function triggerKeydown(
      componentFixture: ComponentFixture<DatepickerCalendarTestComponent>,
      eventObj: any,
    ) {
      Object.assign(eventObj, {
        stopPropagation: function () {},
        preventDefault: function () {},
      });

      componentFixture.debugElement
        .query(By.css('.sky-datepicker-calendar-table-container'))
        .triggerEventHandler('keydown', eventObj);
      componentFixture.detectChanges();
    }

    it('should do nothing on unrecognized keys or shift or alt', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();
      triggerKeydown(fixture, { key: 'tab' });
      verifyDatepicker(nativeElement, 'April 2017', '04', '04', '');

      triggerKeydown(fixture, { key: 'Enter', shiftKey: true });
      verifyDatepicker(nativeElement, 'April 2017', '04', '04', '');

      triggerKeydown(fixture, { key: 'Enter', altKey: true });
      verifyDatepicker(nativeElement, 'April 2017', '04', '04', '');
    });

    it('should select active date on enter or space', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();

      clickNextArrow(nativeElement);
      triggerKeydown(fixture, { key: 'Enter' });
      verifyDatepicker(nativeElement, 'May 2017', '01', '01', '');
      expect(component.selectedDate).toEqual(new Date('5/1/2017'));

      clickPreviousArrow(nativeElement);
      triggerKeydown(fixture, { key: ' ' });
      verifyDatepicker(nativeElement, 'April 2017', '01', '01', '');
      expect(component.selectedDate).toEqual(new Date('4/1/2017'));
    });

    it('should not select active date when active date is disabled', () => {
      component.selectedDate = new Date('4/4/2017');
      component.maxDate = new Date('4/5/2017');
      fixture.detectChanges();
      clickNextArrow(nativeElement);
      triggerKeydown(fixture, { key: 'Enter' });
      verifyDatepicker(nativeElement, 'May 2017', '', '01', '');
      expect(component.selectedDate).toEqual(new Date('4/4/2017'));
    });

    it('should toggle mode up when doing ctrl + up', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();
      triggerKeydown(fixture, { key: 'ArrowUp', ctrlKey: true });
      verifyDatepicker(nativeElement, '2017', 'April', 'April', '');
    });

    it('should toggle mode down when doing ctrl + down', () => {
      component.selectedDate = new Date('4/4/2017');
      fixture.detectChanges();
      clickDatepickerTitle(nativeElement);
      triggerKeydown(fixture, { key: 'ArrowDown', ctrlKey: true });
      verifyDatepicker(nativeElement, 'April 2017', '04', '04', '');
    });

    describe('daypicker accessibility', () => {
      it('should have the correct aria labels for the previous and next buttons', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        const nextArrowEl = getNextArrow(nativeElement);
        expect(nextArrowEl.getAttribute('aria-label')).toBe('Next month');
        const prevArrowEl = getPreviousArrow(nativeElement);
        expect(prevArrowEl.getAttribute('aria-label')).toBe('Previous month');
      });

      it('should move to the previous day when hitting left arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'ArrowLeft' });
        verifyDatepicker(nativeElement, 'April 2017', '04', '03', '');
      });

      it('should move to the next day when hitting the right arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'ArrowRight' });
        verifyDatepicker(nativeElement, 'April 2017', '04', '05', '');
      });

      it('should move to the next week when hitting the down arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'ArrowDown' });
        verifyDatepicker(nativeElement, 'April 2017', '04', '11', '');
      });

      it('should move to the previous week when hitting the up arrow key', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'ArrowUp' });
        verifyDatepicker(nativeElement, 'March 2017', '04', '28', '');
      });

      it('should move to the next month when using pagedown', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'PageDown' });
        verifyDatepicker(nativeElement, 'May 2017', '', '04', '');
      });

      it('should move to the previous month when using pageup', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'PageUp' });
        verifyDatepicker(nativeElement, 'March 2017', '04', '04', '');
      });

      it('should move to the first day of the month when using home', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'Home' });
        verifyDatepicker(nativeElement, 'April 2017', '04', '01', '');
      });

      it('should move to the last day of the month when using end', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'End' });
        verifyDatepicker(nativeElement, 'April 2017', '04', '30', '');
      });

      it('handles pressing end button on leap years', () => {
        component.selectedDate = new Date('2/4/2016');
        fixture.detectChanges();
        triggerKeydown(fixture, { key: 'End' });
        verifyDatepicker(nativeElement, 'February 2016', '04', '29', '');
      });
    });

    describe('monthpicker accessibility', () => {
      it('should have the correct aria labels for the previous and next buttons', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        const nextArrowEl = getNextArrow(nativeElement);
        expect(nextArrowEl.getAttribute('aria-label')).toBe('Next year');
        const prevArrowEl = getPreviousArrow(nativeElement);
        expect(prevArrowEl.getAttribute('aria-label')).toBe('Previous year');
      });

      it('should move to the previous month with left arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowLeft' });
        verifyDatepicker(nativeElement, '2017', 'April', 'March', '');
      });

      it('should move to the next month with right arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowRight' });
        verifyDatepicker(nativeElement, '2017', 'April', 'May', '');
      });

      it('should move back appropriately when up arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowUp' });
        verifyDatepicker(nativeElement, '2017', 'April', 'January', '');
      });

      it('should move forward appropriately when down arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowDown' });
        verifyDatepicker(nativeElement, '2017', 'April', 'July', '');
      });

      it('should move to previous year with pageup', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'PageUp' });
        verifyDatepicker(nativeElement, '2016', '', 'April', '');
      });

      it('should move to the next year with pagedown', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'PageDown' });
        verifyDatepicker(nativeElement, '2018', '', 'April', '');
      });

      it('should move to January when home button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'Home' });
        verifyDatepicker(nativeElement, '2017', 'April', 'January', '');
      });

      it('should move to December when end button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'End' });
        verifyDatepicker(nativeElement, '2017', 'April', 'December', '');
      });
    });

    describe('year accessibility', () => {
      it('should have the correct aria labels for the previous and next buttons', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        const nextArrowEl = getNextArrow(nativeElement);
        expect(nextArrowEl.getAttribute('aria-label')).toBe('Next page');
        const prevArrowEl = getPreviousArrow(nativeElement);
        expect(prevArrowEl.getAttribute('aria-label')).toBe('Previous page');
      });

      it('should move to the previous year with left arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowLeft' });
        verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2016', '');
      });

      it('should move to the next year with right arrow', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowRight' });
        verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2018', '');
      });

      it('should move back appropriately when up arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowUp' });
        verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2012', '');
      });

      it('should move forward appropriately when down arrow is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'ArrowDown' });
        verifyDatepicker(nativeElement, '2021 - 2040', '', '2022', '');
      });

      it('should move to next set of year with pagedown', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'PageDown' });
        verifyDatepicker(nativeElement, '2021 - 2040', '', '2037', '');
      });

      it('should move to the previous set of year with pageup', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'PageUp' });
        verifyDatepicker(nativeElement, '1981 - 2000', '', '1997', '');
      });

      it('should move to first year in grid when home button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'Home' });
        verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2001', '');
      });

      it('should move to last year in grid when end button is pressed', () => {
        component.selectedDate = new Date('4/4/2017');
        fixture.detectChanges();
        clickDatepickerTitle(nativeElement);
        clickDatepickerTitle(nativeElement);
        triggerKeydown(fixture, { key: 'End' });
        verifyDatepicker(nativeElement, '2001 - 2020', '2017', '2020', '');
      });
    });

    describe('custom disabled dates', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should not select active date when selected date is disabled', () => {
        component.selectedDate = new Date('4/4/2017');

        fixture.detectChanges();
        clickNextArrow(nativeElement);

        component.customDates = [
          {
            date: new Date(2017, 4, 1),
            disabled: true,
            keyDate: false,
            keyDateText: [],
          },
        ];
        fixture.detectChanges();

        triggerKeydown(fixture, { key: 'Enter' });
        verifyDatepicker(nativeElement, 'May 2017', '', '01', '');
        expect(component.selectedDate).toEqual(new Date('4/4/2017'));
      });

      it('should select active date when selected date is not disabled', () => {
        component.selectedDate = new Date('4/4/2017');

        fixture.detectChanges();
        clickNextArrow(nativeElement);

        component.customDates = [
          {
            date: new Date(2017, 4, 1),
            disabled: false,
            keyDate: true,
            keyDateText: [],
          },
        ];
        fixture.detectChanges();

        triggerKeydown(fixture, { key: 'Enter' });
        verifyDatepicker(nativeElement, 'May 2017', '01', '01', '');
        expect(component.selectedDate).toEqual(new Date('5/1/2017'));
      });
    });
  });

  describe('startAtDate', () => {
    it('should select correct date when provided', () => {
      component.startAtDate = new Date('3/10/1995');
      fixture.detectChanges();

      component.datepicker.writeValue(undefined);
      fixture.detectChanges();

      verifyDatepicker(nativeElement, 'March 1995', '10', '10', '');
    });

    it('should display selectedDate instead of startAtDate if selectedDate is provided', () => {
      component.startAtDate = new Date('3/10/1995');
      component.selectedDate = new Date('12/21/1991');
      fixture.detectChanges();

      verifyDatepicker(nativeElement, 'December 1991', '21', '21', '');
    });
  });
});
