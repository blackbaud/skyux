import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyEmailValidationFixturesModule } from './fixtures/email-validation-fixtures.module';
import { EmailValidationTestComponent } from './fixtures/email-validation.component.fixture';

describe('Email validation', () => {
  function getInputElement(
    fixture: ComponentFixture<EmailValidationTestComponent>
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function setInput(
    text: string,
    compFixture: ComponentFixture<EmailValidationTestComponent>
  ) {
    const inputEvent = document.createEvent('Event');
    const params = {
      bubbles: false,
      cancelable: false,
    };

    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    const inputEl = getInputElement(fixture);
    inputEl.value = text;

    inputEl.dispatchEvent(inputEvent);
    compFixture.detectChanges();

    inputEl.dispatchEvent(changeEvent);
    compFixture.detectChanges();
  }

  let component: EmailValidationTestComponent;
  let fixture: ComponentFixture<EmailValidationTestComponent>;
  let ngModel: NgModel;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SkyEmailValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(EmailValidationTestComponent);
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  }));

  it('should validate correct input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('joe@abc.com', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('joe@abc.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('[]abcdefgh0293abcd]', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('[]abcdefgh0293abcd]');

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input — multiple @ symbols in email', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('joe@abc.com@abc.com', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('joe@abc.com@abc.com');

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should handle invalid and then valid input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('[[]abcdefgh0293abcd]', fixture);
    setInput('joe@abc.com', fixture);

    expect(getInputElement(fixture).value).toBe('joe@abc.com');
    expect(component.emailValidator).toEqual('joe@abc.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should pass accessibility', async () => {
    setInput('[[]abcdefgh0293abcd]', fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
