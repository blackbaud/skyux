import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarLabelPipe } from './datepicker-calendar-label.pipe';

@Component({
  selector: 'sky-datepicker-calendar-label-pipe-test',
  template: '{{ value | skyDatepickerCalendarLabel : format }}',
  imports: [SkyDatepickerCalendarLabelPipe],
})
export class SkyDatepickerCalendarLabelPipeTestComponent {
  @Input() public value: any;
  @Input() public format: string | undefined;
}

class MockSkyCalendarInnerComponent {
  public isActive(value: any): boolean {
    return false;
  }

  public dateFilter(value: Date, format: string): string {
    return 'Formatted date';
  }
}

function setupTest(
  component: SkyDatepickerCalendarLabelPipeTestComponent,
  args?: { value?: Date; format?: string },
): void {
  if (args) {
    component.value = args.value;
    component.format = args.format;
  }
}

describe('Datepicker calendar label pipe', () => {
  let fixture: ComponentFixture<SkyDatepickerCalendarLabelPipeTestComponent>;
  let component: SkyDatepickerCalendarLabelPipeTestComponent;
  const calendarInnerComponent = new MockSkyCalendarInnerComponent();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyDatepickerCalendarInnerComponent,
          useValue: calendarInnerComponent,
        },
      ],
    });

    fixture = TestBed.createComponent(
      SkyDatepickerCalendarLabelPipeTestComponent,
    );
    component = fixture.componentInstance;
  });

  it('should display a formatted date object', () => {
    setupTest(component, { value: new Date(2000, 0, 1) });
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toBe('Formatted date');
  });

  it('should display nothing when given an invalid date', () => {
    setupTest(component);
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toBe('');
  });
});
