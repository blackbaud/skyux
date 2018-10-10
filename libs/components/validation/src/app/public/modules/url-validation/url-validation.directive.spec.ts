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
  SkyUrlValidationFixturesModule
} from './fixtures/url-validation-fixtures.module';
import {
  UrlValidationTestComponent
} from './fixtures/url-validation.component.fixture';

describe('Url validation', () => {
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

  let component: UrlValidationTestComponent;
  let fixture: ComponentFixture<UrlValidationTestComponent>;
  let ngModel: NgModel;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyUrlValidationFixturesModule,
        FormsModule
      ]
    });
    fixture = TestBed.createComponent(UrlValidationTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    let input = fixture.debugElement.query(By.css('input'));
    ngModel = <NgModel>input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should validate correct input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput(nativeElement, 'https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe('https://blackbaud.com');

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

  it('should handle invalid and then valid input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
    setInput(nativeElement, 'blackbaud.com', fixture);

    expect(nativeElement.querySelector('input').value).toBe('blackbaud.com');
    expect(component.urlValidator).toEqual('blackbaud.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
