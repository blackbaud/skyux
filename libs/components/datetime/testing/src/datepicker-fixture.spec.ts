import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { expect } from '@skyux-sdk/testing';

import { SkyDatepickerModule } from '@skyux/datetime';

import { SkyPopoverModule } from '@skyux/popovers';

import { SkyDatepickerFixture } from './datepicker-fixture';

//#region Test component
@Component({
  selector: 'sky-datepicker-test',
  template: `
    <sky-datepicker data-sky-id="test-datepicker">
      <input skyDatepickerInput [(ngModel)]="selectedDate" />
    </sky-datepicker>
  `,
})
class TestComponent {
  public date = '01/01/2019';

  public disabled = false;

  public selectedDate = new Date(this.date);
}
//#endregion Test component

describe('Datepicker fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule, SkyDatepickerModule, SkyPopoverModule],
    });
  });

  it('should expose the provided properties', async(() => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const datepicker = new SkyDatepickerFixture(fixture, 'test-datepicker');

    fixture.whenStable().then(() => {
      expect(datepicker.disabled).toBe(false);
      expect(datepicker.date).toEqual(fixture.componentInstance.date);
    });
  }));

  it('should open and close the calendar when clicked', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);

    const datepicker = new SkyDatepickerFixture(fixture, 'test-datepicker');

    fixture.detectChanges();
    tick();

    expect(datepicker.calendarEl).toBeNull();

    datepicker.clickDatepickerCalenderButtonEl();

    fixture.detectChanges();
    tick();

    expect(datepicker.calendarEl).toBeTruthy();
  }));

  it('should select the day element at the given index', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();
    tick();

    const datepicker = new SkyDatepickerFixture(fixture, 'test-datepicker');

    fixture.detectChanges();
    tick();

    datepicker.clickDatepickerCalenderButtonEl();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(datepicker.date).toEqual(fixture.componentInstance.date);

    datepicker.clickDayEl(10);

    fixture.detectChanges();
    tick();

    expect(datepicker.date).toEqual('01/09/2019');
  }));

  it('should throw an error when trying selecting a day element that does not exist', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);

    const datepicker = new SkyDatepickerFixture(fixture, 'test-datepicker');

    fixture.detectChanges();
    tick();

    datepicker.clickDatepickerCalenderButtonEl();

    fixture.detectChanges();
    tick();

    expect(() => datepicker.clickDayEl(100)).toThrowError(
      'No day exists at index 100.'
    );
  }));
});
