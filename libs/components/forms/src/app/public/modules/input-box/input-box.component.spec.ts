import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  AbstractControl
} from '@angular/forms';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettingsChange,
  SkyThemeSettings
} from '@skyux/theme';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  InputBoxFixtureComponent
} from './fixtures/input-box.component.fixture';

import {
  InputBoxFixturesModule
} from './fixtures/input-box.module.fixture';

import {
  SkyInputBoxAdapterService
} from './input-box-adapter.service';

describe('Input box component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>
  };

  function getInputBoxEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector(`.${parentCls} sky-input-box`);
  }

  function getControlEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector(`.${parentCls} .sky-form-control`);
  }

  function getInsetIconWrapperEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector(`.${parentCls} .sky-input-box-icon-inset-wrapper`);
  }

  function validateInvalid(
    context: string,
    inputBoxEl: Element,
    invalid: boolean
  ): void {
    const formControlEl = inputBoxEl.querySelector('.sky-input-box-group-form-control');

    const invalidCls = 'sky-input-box-group-form-control-invalid';

    if (invalid) {
      (expect(formControlEl).withContext(context) as any).toHaveCssClass(invalidCls);
    } else {
      (expect(formControlEl).withContext(context) as any).not.toHaveCssClass(invalidCls);
    }
  }

  function validateControlValid(
    fixture: ComponentFixture<any>,
    inputBoxEl: Element,
    control: AbstractControl
  ): void {
    validateInvalid(
      'when pristine and untouched',
      inputBoxEl,
      false
    );

    control.markAsTouched();

    fixture.detectChanges();

    validateInvalid(
      'when pristine and touched',
      inputBoxEl,
      true
    );

    control.markAsUntouched();
    control.markAsDirty();

    fixture.detectChanges();

    validateInvalid(
      'when dirty and untouched',
      inputBoxEl,
      true
    );
  }

  describe('default theme', () => {

    function getDefaultEls(fixture: ComponentFixture<any>, parentCls: string): {
      characterCountEl: HTMLElement,
      inputBoxEl: HTMLElement,
      inputEl: HTMLElement,
      inputGroupBtnEls: HTMLElement[],
      inputGroupEl: HTMLElement,
      insetBtnEl: HTMLElement,
      labelEl: HTMLLabelElement
    } {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const formGroupEl = inputBoxEl.querySelector('.sky-form-group') as HTMLElement;

      const labelEl = formGroupEl.children.item(0) as HTMLLabelElement;

      let characterCountEl: HTMLElement;
      let inputGroupEl: HTMLElement;

      if (formGroupEl.children.item(1).tagName === 'SKY-CHARACTER-COUNTER-INDICATOR') {
        characterCountEl = formGroupEl.children.item(1) as HTMLElement;
        inputGroupEl = formGroupEl.children.item(2) as HTMLElement;
      } else {
        inputGroupEl = formGroupEl.children.item(1) as HTMLElement;
      }

      const inputGroupInnerEl = inputGroupEl.children.item(0) as HTMLElement;

      const inputEl = inputGroupInnerEl.children.item(0) as HTMLElement;
      const insetBtnEl = inputGroupInnerEl.children.item(1) as HTMLElement;
      const inputGroupBtnEls = Array.from(inputGroupEl.children).slice(1) as HTMLElement[];

      return {
        characterCountEl,
        inputBoxEl,
        inputEl,
        inputGroupBtnEls,
        inputGroupEl,
        insetBtnEl,
        labelEl
      };
    }

    beforeEach(() => {
      mockThemeSvc = {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
          {
            currentSettings: new SkyThemeSettings(
              SkyTheme.presets.default,
              SkyThemeMode.presets.light
            ),
            previousSettings: undefined
          }
        )
      };

      TestBed.configureTestingModule({
        imports: [
          InputBoxFixturesModule
        ],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc
          }
        ]
      });
    });

    it('should render the label and input elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-basic');

      expect(els.labelEl).toExist();
      expect(els.labelEl.htmlFor).toBe(els.inputEl.id);

      expect(els.inputGroupEl).toExist();

      expect(els.inputEl).toExist();
      expect(els.inputEl.tagName).toBe('INPUT');
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-multiple-buttons');

      expect(els.inputEl).toExist();
      expect(els.inputEl.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0].children.item(0)).toHaveCssClass('test-button-1');
      expect(els.inputGroupBtnEls[1].children.item(0)).toHaveCssClass('test-button-2');
    });

    it('should render the character count element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-character-count');

      expect(els.characterCountEl).toExist();
      expect(els.characterCountEl.tagName).toBe('SKY-CHARACTER-COUNTER-INDICATOR');
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl.children.item(0)).toHaveCssClass('test-button-inset');
    });

    it('should allow a child to place template items inside the input box programmatically', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.inputEl).toExist();
      expect(els.inputEl.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0].children.item(0)).toHaveCssClass('host-service-button-1');
      expect(els.inputGroupBtnEls[1].children.item(0)).toHaveCssClass('host-service-button-2');
    });

    it('should add a disabled CSS class when disabled', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxWrapperEl = inputBoxEl.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.basicDisabled = true;
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    it('should pass accessibility', async(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

  });

  describe('in modern theme', () => {

    function getModernEls(fixture: ComponentFixture<any>, parentCls: string): {
      characterCountEl: HTMLElement,
      inputBoxEl: HTMLElement,
      inputEl: HTMLElement,
      inputGroupBtnEls: HTMLElement[],
      insetBtnEl: HTMLElement,
      insetIconWrapperEl: HTMLElement,
      labelEl: HTMLLabelElement
    } {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const inputGroupEl = inputBoxEl.querySelector('.sky-input-box-group') as HTMLElement;
      const formGroupEl = inputGroupEl.querySelector(
        '.sky-input-box-group-form-control > .sky-form-group'
      );
      const formGroupInnerEl = formGroupEl.children.item(0);

      const labelEl = formGroupInnerEl.children.item(0) as HTMLLabelElement;

      let inputEl: HTMLElement;
      let characterCountEl: HTMLElement;

      if (formGroupInnerEl.children.item(1).tagName === 'SKY-CHARACTER-COUNTER-INDICATOR') {
        characterCountEl = formGroupInnerEl.children.item(1) as HTMLElement;
        inputEl = formGroupInnerEl.children.item(2) as HTMLElement;
      } else {
        inputEl = formGroupInnerEl.children.item(1) as HTMLElement;
      }

      const insetBtnEl = formGroupEl.children.item(1) as HTMLElement;

      const insetIconWrapperEl = formGroupEl.children.item(1) as HTMLElement;

      const inputGroupBtnEls = Array.from(inputGroupEl.children).slice(1) as HTMLElement[];

      return {
        characterCountEl,
        inputBoxEl,
        inputEl,
        inputGroupBtnEls,
        insetBtnEl,
        insetIconWrapperEl,
        labelEl
      };
    }

    beforeEach(() => {
      mockThemeSvc = {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
          {
            currentSettings: new SkyThemeSettings(
              SkyTheme.presets.default,
              SkyThemeMode.presets.light
            ),
            previousSettings: undefined
          }
        )
      };

      TestBed.configureTestingModule({
        imports: [
          InputBoxFixturesModule
        ],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc
          }
        ]
      });

      // Trigger the modern theme.
      mockThemeSvc.settingsChange.next(
        {
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.modern,
            SkyThemeMode.presets.light
          ),
          previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
        }
      );
    });

    it('should render the label and input elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-basic');

      expect(els.labelEl).toExist();
      expect(els.labelEl.htmlFor).toBe(els.inputEl.id);

      expect(els.inputEl).toExist();
      expect(els.inputEl.tagName).toBe('INPUT');
    });

    it('should render the character count element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-character-count');

      const formGroupEl = inputBoxEl.querySelector(
        '.sky-input-box-group > .sky-input-box-group-form-control > .sky-form-group'
      );

      const characterCountEl = formGroupEl.children.item(0).children.item(1) as HTMLElement;

      expect(characterCountEl).toExist();
      expect(characterCountEl.tagName).toBe('SKY-CHARACTER-COUNTER-INDICATOR');
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-multiple-buttons');

      expect(els.inputGroupBtnEls[0].children.item(0)).toHaveCssClass('test-button-1');
      expect(els.inputGroupBtnEls[1].children.item(0)).toHaveCssClass('test-button-2');
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl.children.item(0)).toHaveCssClass('test-button-inset');
    });

    it('should render the inset icon element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset');

      expect(els.insetBtnEl.children.item(0).children.item(0)).toHaveCssClass('test-icon-inset');
    });

    it('should focus on the control when clicking on an inset icon', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);
      const adapterService = TestBed.inject(SkyInputBoxAdapterService);
      const spy = spyOn(adapterService, 'focusControl').and.callThrough();

      fixture.detectChanges();
      const insetIconWrapperEl = getInsetIconWrapperEl(fixture, 'input-icon-inset');
      const el = getControlEl(fixture, 'input-icon-inset') as Element;
      insetIconWrapperEl.click();

      expect(spy).toHaveBeenCalled();
      expect(el).toEqual(document.activeElement);
    });

    it('should not call adapter method when clicking on a disabled inset icon', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);
      fixture.componentInstance.insetIconDisabled = true;
      const adapterService = TestBed.inject(SkyInputBoxAdapterService);
      const spy = spyOn(adapterService, 'focusControl');

      fixture.detectChanges();
      const insetIconWrapperEl = getInsetIconWrapperEl(fixture, 'input-icon-inset');
      insetIconWrapperEl.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should render the left input group button element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-single-button-left');

      const inputBoxGroupEl = inputBoxEl.querySelector('.sky-input-box-group');
      const inputGroupBtnEl1 = inputBoxGroupEl.children.item(0);
      const inputEl = inputBoxGroupEl.children.item(1);

      expect(inputEl).toHaveCssClass('sky-input-box-group-form-control');
      expect(inputGroupBtnEl1.children.item(0)).toHaveCssClass('test-button-left');
    });

    it('should add a CSS class to the form control wrapper on focus in', fakeAsync(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxFormControlEl = inputBoxEl.querySelector('.sky-input-box-group-form-control');

      const focusCls = 'sky-input-box-group-form-control-focus';

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);

      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusin');

      tick();
      fixture.detectChanges();

      expect(inputBoxFormControlEl).toHaveCssClass(focusCls);

      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusout');

      tick();
      fixture.detectChanges();

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);
    }));

    it('should add a disabled CSS class when disabled', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxWrapperEl = inputBoxEl.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.basicDisabled = true;
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    it('should pass accessibility', async(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should add an invalid CSS class when marked invalid with hasErrors property', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-haserrors');

      validateInvalid(
        'when hasErrors is undefined',
        inputBoxEl,
        false
      );

      fixture.componentInstance.hasErrors = true;
      fixture.detectChanges();

      validateInvalid(
        'when hasErrors is true',
        inputBoxEl,
        true
      );
    });

    it('should add an invalid CSS class when ngModel is invalid', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-ngmodel-error');

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorNgModel.control
      );
    });

    it('should add an invalid CSS class when form control is invalid', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-error');

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorField
      );
    });

    it('should add an invalid CSS class when form control by name is invalid', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-name-error');

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorForm.controls['errorFormField']
      );
    });

  });

});
