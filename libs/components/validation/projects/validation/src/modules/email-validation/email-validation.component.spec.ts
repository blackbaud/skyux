import {
  async,
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  FormsModule,
  NgModel
} from '@angular/forms';
import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyEmailValidationFixturesModule
} from './fixtures/email-validation-fixtures.module';
import {
  EmailValidationTestComponent
} from './fixtures/email-validation.component.fixture';

describe('Email validation', () => {
    function setInput(
      element: HTMLElement,
      text: string,
      compFixture: ComponentFixture<any>) {
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

  }

    let component: EmailValidationTestComponent;
    let fixture: ComponentFixture<EmailValidationTestComponent>;
    let ngModel: NgModel;
    let nativeElement: HTMLElement;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                SkyEmailValidationFixturesModule,
                FormsModule
            ]
        });
        fixture = TestBed.createComponent(EmailValidationTestComponent);
        nativeElement = fixture.nativeElement as HTMLElement;
        let input = fixture.debugElement.query(By.css('input'));
        ngModel = <NgModel> input.injector.get(NgModel);
        component = fixture.componentInstance;
    }));

    it('should validate correct input', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      setInput(nativeElement, 'joe@abc.com', fixture);
      fixture.detectChanges();

      expect(nativeElement.querySelector('input').value).toBe('joe@abc.com');

      expect(ngModel.control.valid).toBe(true);
      expect(ngModel.control.pristine).toBe(false);
      expect(ngModel.control.touched).toBe(false);
    }));

    it('should validate incorrect input', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
      fixture.detectChanges();

      expect(nativeElement.querySelector('input').value).toBe('[]awefhawenfc0293ejwf]');

      expect(ngModel.control.valid).toBe(false);
      expect(ngModel.control.pristine).toBe(false);
      expect(ngModel.control.touched).toBe(false);
    }));

    it('should validate incorrect input — multiple @ symbols in email', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      setInput(nativeElement, 'joe@abc.com@abc.com', fixture);
      fixture.detectChanges();

      expect(nativeElement.querySelector('input').value).toBe('joe@abc.com@abc.com');

      expect(ngModel.control.valid).toBe(false);
      expect(ngModel.control.pristine).toBe(false);
      expect(ngModel.control.touched).toBe(false);
    }));

    it('should handle invalid and then valid input', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
      setInput(nativeElement, 'joe@abc.com', fixture);

      expect(nativeElement.querySelector('input').value).toBe('joe@abc.com');
      expect(component.emailValidator).toEqual('joe@abc.com');

      expect(ngModel.control.valid).toBe(true);
      expect(ngModel.control.pristine).toBe(false);
      expect(ngModel.control.touched).toBe(false);
    }));

    it('should pass accessibility', async(() => {
      setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
});
