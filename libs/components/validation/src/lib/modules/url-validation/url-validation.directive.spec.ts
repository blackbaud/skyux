import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import { SkyUrlValidationFixturesModule } from './fixtures/url-validation-fixtures.module';
import { UrlValidationRulesetTestComponent } from './fixtures/url-validation-ruleset.component.fixture';
import { UrlValidationTestComponent } from './fixtures/url-validation.component.fixture';

describe('Url validation', () => {
  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<any>
  ) {
    const inputEvent = document.createEvent('Event');
    const params = {
      bubbles: false,
      cancelable: false,
    };

    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    const inputEl = element.querySelector('input');
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
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should validate correct input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput(nativeElement, 'https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe(
      'https://blackbaud.com'
    );

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe(
      '[]awefhawenfc0293ejwf]'
    );

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

describe('URL validation - ruleset v1', () => {
  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<any>
  ) {
    const inputEvent = document.createEvent('Event');
    const params = {
      bubbles: false,
      cancelable: false,
    };

    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    const inputEl = element.querySelector('input');
    inputEl.value = text;

    inputEl.dispatchEvent(inputEvent);
    compFixture.detectChanges();

    inputEl.dispatchEvent(changeEvent);
    compFixture.detectChanges();
  }

  let component: UrlValidationRulesetTestComponent;
  let fixture: ComponentFixture<UrlValidationRulesetTestComponent>;
  let ngModel: NgModel;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationRulesetTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should validate correct input using ruleset version 1', fakeAsync(() => {
    component.skyUrlValidationOptions = {
      rulesetVersion: 1,
    };
    fixture.detectChanges();
    tick();
    setInput(nativeElement, 'https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe(
      'https://blackbaud.com'
    );

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input using ruleset version 1', fakeAsync(() => {
    component.skyUrlValidationOptions = {
      rulesetVersion: 1,
    };
    fixture.detectChanges();
    tick();
    setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe(
      '[]awefhawenfc0293ejwf]'
    );

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));
});

describe('URL validation - ruleset v2', () => {
  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<any>
  ) {
    const inputEvent = document.createEvent('Event');
    const params = {
      bubbles: false,
      cancelable: false,
    };

    inputEvent.initEvent('input', params.bubbles, params.cancelable);

    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', params.bubbles, params.cancelable);
    const inputEl = element.querySelector('input');
    inputEl.value = text;

    inputEl.dispatchEvent(inputEvent);
    compFixture.detectChanges();

    inputEl.dispatchEvent(changeEvent);
    compFixture.detectChanges();
  }

  let component: UrlValidationRulesetTestComponent;
  let fixture: ComponentFixture<UrlValidationRulesetTestComponent>;
  let ngModel: NgModel;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationRulesetTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should validate correct input using ruleset version 2', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput(nativeElement, 'https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe(
      'https://blackbaud.com'
    );

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input using ruleset version 2', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();

    expect(nativeElement.querySelector('input').value).toBe(
      '[]awefhawenfc0293ejwf]'
    );

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should handle invalid and then valid input using ruleset version 2', fakeAsync(() => {
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

  it('should pass accessibility using ruleset version 2', async(() => {
    fixture.detectChanges();
    setInput(nativeElement, '[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
