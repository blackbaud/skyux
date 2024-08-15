import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyInputBoxErrorsComponent } from './input-box-errors.component';

describe('SkyInputBoxErrorsComponent', () => {
  let component: SkyInputBoxErrorsComponent;
  let fixture: ComponentFixture<SkyInputBoxErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyInputBoxErrorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyInputBoxErrorsComponent);
    component = fixture.componentInstance;

    fixture.componentInstance.errors = {
      required: {
        invalid: true,
      },
      maxlength: {
        invalid: true,
        requiredLength: 1,
      },
    };
    fixture.componentInstance.labelText = 'input box';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render only max length error when dirty', () => {
    fixture.componentInstance.dirty = true;
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll(
      'span.sky-status-indicator-message',
    );

    expect(errorMessages.length).toBe(1);
    expect(errorMessages[0]?.innerText).toBe(
      'Limit input box to 1 character(s).',
    );
  });

  it('should render all errors when touched and dirty', () => {
    fixture.componentInstance.dirty = true;
    fixture.componentInstance.touched = true;
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll(
      'span.sky-status-indicator-message',
    );

    expect(errorMessages.length).toBe(2);
    expect(errorMessages[0]?.innerText).toBe(
      'Limit input box to 1 character(s).',
    );
    expect(errorMessages[1]?.innerText).toBe('input box is required.');
  });
});
