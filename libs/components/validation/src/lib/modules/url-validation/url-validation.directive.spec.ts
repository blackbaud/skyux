import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyUrlValidationFixturesModule } from './fixtures/url-validation-fixtures.module';
import { UrlValidationRulesetTestComponent } from './fixtures/url-validation-ruleset.component.fixture';
import { UrlValidationTestComponent } from './fixtures/url-validation.component.fixture';

function getInputElement(
  fixture: ComponentFixture<
    UrlValidationTestComponent | UrlValidationRulesetTestComponent
  >
): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

describe('URL validation via directive - ruleset v1 (implicit)', () => {
  function setInput(
    text: string,
    compFixture: ComponentFixture<UrlValidationTestComponent>
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

  let component: UrlValidationTestComponent;
  let fixture: ComponentFixture<UrlValidationTestComponent>;
  let ngModel: NgModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationTestComponent);
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should validate correct input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('https://blackbaud.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('[]awefhawenfc0293ejwf]');

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate invalid and then valid input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();
    tick();
    expect(getInputElement(fixture).value).toBe('[]awefhawenfc0293ejwf]');
    expect(component.urlValidator).toEqual('[]awefhawenfc0293ejwf]');
    expect(ngModel.control.valid).toBe(false);
    fixture.detectChanges();
    tick();
    setInput('blackbaud.com', fixture);

    expect(getInputElement(fixture).value).toBe('blackbaud.com');
    expect(component.urlValidator).toEqual('blackbaud.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('URL validation via directive - ruleset v1 (explicit)', () => {
  function setInput(text: string, compFixture: ComponentFixture<any>) {
    const params = {
      bubbles: false,
      cancelable: false,
    };

    const inputEl = getInputElement(fixture);
    inputEl.value = text;

    SkyAppTestUtility.fireDomEvent(inputEl, 'input', params);
    compFixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change', params);
    compFixture.detectChanges();
  }

  let component: UrlValidationRulesetTestComponent;
  let fixture: ComponentFixture<UrlValidationRulesetTestComponent>;
  let ngModel: NgModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationRulesetTestComponent);
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
    setInput('https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('https://blackbaud.com');

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
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('[]awefhawenfc0293ejwf]');

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));
});

describe('URL validation via directive - ruleset v2', () => {
  function setInput(
    text: string,
    compFixture: ComponentFixture<UrlValidationRulesetTestComponent>
  ) {
    const params = {
      bubbles: false,
      cancelable: false,
    };

    const inputEl = getInputElement(fixture);
    inputEl.value = text;

    SkyAppTestUtility.fireDomEvent(inputEl, 'input', params);
    compFixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change', params);
    compFixture.detectChanges();
  }

  let component: UrlValidationRulesetTestComponent;
  let fixture: ComponentFixture<UrlValidationRulesetTestComponent>;
  let ngModel: NgModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationRulesetTestComponent);
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should validate correct input using ruleset version 2', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('https://blackbaud.com', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('https://blackbaud.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate incorrect input using ruleset version 2', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('[]awefhawenfc0293ejwf]');

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should validate invalid and then valid input using ruleset version 2', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();
    tick();
    expect(getInputElement(fixture).value).toBe('[]awefhawenfc0293ejwf]');
    expect(component.urlValidator).toEqual('[]awefhawenfc0293ejwf]');
    expect(ngModel.control.valid).toBe(false);
    fixture.detectChanges();
    tick();
    setInput('blackbaud.com', fixture);

    expect(getInputElement(fixture).value).toBe('blackbaud.com');
    expect(component.urlValidator).toEqual('blackbaud.com');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));

  it('should pass accessibility using ruleset version 2', async () => {
    fixture.detectChanges();
    setInput('[]awefhawenfc0293ejwf]', fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('URL validation via directive - non-onceability', () => {
  function setInput(text: string, compFixture: ComponentFixture<any>) {
    const params = {
      bubbles: false,
      cancelable: false,
    };

    const inputEl = getInputElement(fixture);
    inputEl.value = text;

    SkyAppTestUtility.fireDomEvent(inputEl, 'input', params);
    compFixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change', params);
    compFixture.detectChanges();
  }

  let component: UrlValidationRulesetTestComponent;
  let fixture: ComponentFixture<UrlValidationRulesetTestComponent>;
  let ngModel: NgModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyUrlValidationFixturesModule, FormsModule],
    });
    fixture = TestBed.createComponent(UrlValidationRulesetTestComponent);
    const input = fixture.debugElement.query(By.css('input'));
    ngModel = input.injector.get(NgModel);
    component = fixture.componentInstance;
  });

  it('should change validation rules asynchronously/reactively', fakeAsync(() => {
    component.skyUrlValidationOptions = {
      rulesetVersion: 1,
    };
    fixture.detectChanges();
    tick();
    setInput('sub.domain,com/pagename', fixture);
    fixture.detectChanges();

    expect(getInputElement(fixture).value).toBe('sub.domain,com/pagename');

    expect(ngModel.control.valid).toBe(true);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);

    component.skyUrlValidationOptions = {
      rulesetVersion: 2,
    };
    fixture.detectChanges();
    tick();

    expect(ngModel.control.valid).toBe(false);
    expect(ngModel.control.pristine).toBe(false);
    expect(ngModel.control.touched).toBe(false);
  }));
});
