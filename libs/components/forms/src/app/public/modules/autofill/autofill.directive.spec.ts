import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  AutofillDirectiveFixtureComponent
} from './fixtures/autofill.directive.fixture';

import {
  SkyAutofillModule
} from './autofill.module';

import {
  SkyBrowserDetector
} from './browser-detector';

describe('Autofill directive', () => {
  let fixture: ComponentFixture<AutofillDirectiveFixtureComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutofillDirectiveFixtureComponent
      ],
      imports: [
        SkyAutofillModule
      ]
    });

    fixture = TestBed.createComponent(AutofillDirectiveFixtureComponent);
    inputElement = fixture.debugElement.query(By.css('#withName'));

    fixture.detectChanges();
  });

  it('should not add autocomplete attribute when autofill value is undefined', () => {
    expect(inputElement).toBeTruthy();
    expect(inputElement.attributes['autocomplete']).not.toBeTruthy();
  });

  it('should not add autocomplete attribute when autofill value is an empty string', () => {
    fixture.componentInstance.autofill = '';
    fixture.detectChanges();

    expect(inputElement).toBeTruthy();
    expect(inputElement.attributes['autocomplete']).not.toBeTruthy();
  });

  it('should pass along values to autocomplete attribute', () => {
    fixture.componentInstance.autofill = 'on';
    fixture.detectChanges();

    expect(inputElement.attributes['autocomplete']).toEqual('on');

    fixture.componentInstance.autofill = 'name';
    fixture.detectChanges();

    expect(inputElement.attributes['autocomplete']).toEqual('name');

    fixture.componentInstance.autofill = 'email';
    fixture.detectChanges();

    expect(inputElement.attributes['autocomplete']).toEqual('email');
  });

  describe('Chrome browser', () => {

    it('should add autocomplete attribute with prefix of "new-" when autofill value is off', () => {
      const spyBrowserDetector = spyOnAllFunctions(SkyBrowserDetector);
      spyBrowserDetector.isChromeDesktop = true;

      fixture.componentInstance.autofill = 'off';
      fixture.detectChanges();

      expect(inputElement.attributes['autocomplete']).toEqual('new-name');
    });

    it('should add autocomplete attribute "new-sky-input" when autofill value is off and input does not have a name attribute', () => {
      const spyBrowserDetector = spyOnAllFunctions(SkyBrowserDetector);
      spyBrowserDetector.isChromeDesktop = true;
      const inputElementNoName = fixture.debugElement.query(By.css('#noName'));

      fixture.componentInstance.autofill = 'off';
      fixture.detectChanges();

      expect(inputElementNoName.attributes['autocomplete']).toEqual('new-sky-input');
    });
  });

  describe('Non-chrome browser', () => {

    it('should add autocomplete attribute with value of "off" when autofill value is off', () => {
      const spyBrowserDetector = spyOnAllFunctions(SkyBrowserDetector);
      spyBrowserDetector.isChromeDesktop = false;

      fixture.componentInstance.autofill = 'off';
      fixture.detectChanges();

      expect(inputElement.attributes['autocomplete']).toEqual('off');
    });
  });
});
