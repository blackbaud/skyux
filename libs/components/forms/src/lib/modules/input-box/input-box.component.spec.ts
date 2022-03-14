import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { InputBoxFixtureComponent } from './fixtures/input-box.component.fixture';
import { InputBoxFixturesModule } from './fixtures/input-box.module.fixture';
import { SkyInputBoxAdapterService } from './input-box-adapter.service';

describe('Input box component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
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
    return fixture.nativeElement.querySelector(
      `.${parentCls} .sky-form-control`
    );
  }

  function getInsetIconWrapperEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      `.${parentCls} .sky-input-box-icon-inset-wrapper`
    );
  }

  function validateInvalid(
    context: string,
    inputBoxEl: Element,
    invalid: boolean
  ): void {
    const formControlEl = inputBoxEl.querySelector(
      '.sky-input-box-group-form-control'
    );

    const invalidCls = 'sky-input-box-group-form-control-invalid';

    if (invalid) {
      (expect(formControlEl).withContext(context) as any).toHaveCssClass(
        invalidCls
      );
    } else {
      (expect(formControlEl).withContext(context) as any).not.toHaveCssClass(
        invalidCls
      );
    }
  }

  function validateControlValid(
    fixture: ComponentFixture<any>,
    inputBoxEl: Element,
    control: AbstractControl
  ): void {
    validateInvalid('when pristine and untouched', inputBoxEl, false);

    control.markAsTouched();

    fixture.detectChanges();

    validateInvalid('when pristine and touched', inputBoxEl, true);

    control.markAsUntouched();
    control.markAsDirty();

    fixture.detectChanges();

    validateInvalid('when dirty and untouched', inputBoxEl, true);
  }

  describe('default theme', () => {
    function getDefaultEls(
      fixture: ComponentFixture<any>,
      parentCls: string
    ): {
      characterCountEl: HTMLElement;
      inputBoxEl: HTMLElement;
      inputEl: HTMLElement;
      inputGroupBtnEls: HTMLElement[];
      inputGroupEl: HTMLElement;
      insetBtnEl: HTMLElement;
      labelEl: HTMLLabelElement;
      inlineHelpEl: HTMLElement;
    } {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const formGroupEl = inputBoxEl.querySelector(
        '.sky-form-group'
      ) as HTMLElement;

      const labelEl = formGroupEl.querySelector(
        '.sky-control-label'
      ) as HTMLLabelElement;

      const inlineHelpEl = formGroupEl.querySelector(
        '.sky-control-help'
      ) as HTMLElement;

      const characterCountEl = formGroupEl.querySelector(
        'sky-character-counter-indicator'
      ) as HTMLElement;

      const inputGroupEl = formGroupEl.querySelector(
        '.sky-input-group'
      ) as HTMLElement;

      const inputGroupInnerEl = inputGroupEl.querySelector(
        '.sky-input-box-input-group-inner'
      ) as HTMLElement;

      const inputEl = inputGroupInnerEl.querySelector(
        '.sky-form-control'
      ) as HTMLElement;

      const insetBtnEl = inputGroupInnerEl.querySelector(
        '.sky-input-box-btn-inset'
      ) as HTMLElement;

      const inputGroupBtnEls = Array.from(inputGroupEl.children).slice(
        1
      ) as HTMLElement[];

      return {
        characterCountEl,
        inputBoxEl,
        inputEl,
        inputGroupBtnEls,
        inputGroupEl,
        insetBtnEl,
        labelEl,
        inlineHelpEl,
      };
    }

    beforeEach(() => {
      mockThemeSvc = {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
          ),
          previousSettings: undefined,
        }),
      };

      TestBed.configureTestingModule({
        imports: [InputBoxFixturesModule],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc,
          },
        ],
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

    it('should render the inline help in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-inline-help');

      expect(els.inlineHelpEl).toExist();
      expect(els.inlineHelpEl.innerText.trim()).toBe('CUSTOM HELP WIDGET');
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-multiple-buttons');

      expect(els.inputEl).toExist();
      expect(els.inputEl.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0].children.item(0)).toHaveCssClass(
        'test-button-1'
      );
      expect(els.inputGroupBtnEls[1].children.item(0)).toHaveCssClass(
        'test-button-2'
      );
    });

    it('should render the character count element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-character-count');

      expect(els.characterCountEl).toExist();
      expect(els.characterCountEl.tagName).toBe(
        'SKY-CHARACTER-COUNTER-INDICATOR'
      );
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl.children.item(0)).toHaveCssClass(
        'test-button-inset'
      );
    });

    it('should allow a child to place template items inside the input box programmatically', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.inputEl).toExist();
      expect(els.inputEl.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0].children.item(0)).toHaveCssClass(
        'host-service-button-1'
      );
      expect(els.inputGroupBtnEls[1].children.item(0)).toHaveCssClass(
        'host-service-button-2'
      );
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
    function getModernEls(
      fixture: ComponentFixture<any>,
      parentCls: string
    ): {
      characterCountEl: HTMLElement;
      inputBoxEl: HTMLElement;
      inputEl: HTMLElement;
      inputGroupBtnEls: HTMLElement[];
      insetBtnEl: HTMLElement;
      insetIconEl: HTMLElement;
      insetIconWrapperEl: HTMLElement;
      leftInsetIconEl: HTMLElement;
      labelEl: HTMLLabelElement;
      inlineHelpEl: HTMLElement;
    } {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const inputGroupEl = inputBoxEl.querySelector(
        '.sky-input-box-group'
      ) as HTMLElement;

      const formGroupEl = inputGroupEl.querySelector(
        '.sky-input-box-group-form-control > .sky-form-group'
      );

      const formGroupInnerEl = formGroupEl.querySelector(
        '.sky-input-box-form-group-inner'
      ) as HTMLElement;

      const labelEl = formGroupInnerEl.querySelector(
        '.sky-input-box-label-wrapper > .sky-control-label'
      ) as HTMLLabelElement;

      const inlineHelpEl = formGroupEl.querySelector(
        '.sky-control-help'
      ) as HTMLElement;

      const characterCountEl = formGroupInnerEl.children
        .item(0)
        .children.item(1) as HTMLLabelElement;

      const inputEl = formGroupInnerEl.querySelector(
        '.sky-form-control'
      ) as HTMLElement;

      const insetBtnEl = formGroupEl.querySelector(
        '.sky-input-box-btn-inset'
      ) as HTMLElement;

      const insetIconEl = formGroupEl.querySelector(
        '.sky-input-box-icon-inset'
      ) as HTMLElement;

      const insetIconWrapperEl = formGroupEl.querySelector(
        '.sky-input-box-icon-inset-wrapper'
      ) as HTMLElement;

      const leftInsetIconEl = formGroupEl.querySelector(
        '.sky-input-box-icon-inset-left'
      ) as HTMLElement;

      const inputGroupBtnEls = Array.from(inputGroupEl.children).slice(
        1
      ) as HTMLElement[];

      return {
        characterCountEl,
        inputBoxEl,
        inputEl,
        inputGroupBtnEls,
        insetBtnEl,
        insetIconEl,
        insetIconWrapperEl,
        leftInsetIconEl,
        labelEl,
        inlineHelpEl,
      };
    }

    beforeEach(() => {
      mockThemeSvc = {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
          ),
          previousSettings: undefined,
        }),
      };

      TestBed.configureTestingModule({
        imports: [InputBoxFixturesModule],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc,
          },
        ],
      });

      // Trigger the modern theme.
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });
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

    it('should render the inline help in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-inline-help');

      expect(els.inlineHelpEl).toExist();
      expect(els.inlineHelpEl.innerText.trim()).toBe('CUSTOM HELP WIDGET');
    });

    it('should render the character count element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const moderlEls = getModernEls(fixture, 'input-character-count');

      expect(moderlEls.characterCountEl).toExist();
      expect(moderlEls.characterCountEl.tagName).toBe(
        'SKY-CHARACTER-COUNTER-INDICATOR'
      );
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-multiple-buttons');

      expect(els.inputGroupBtnEls[0].children.item(0)).toHaveCssClass(
        'test-button-1'
      );
      expect(els.inputGroupBtnEls[1].children.item(0)).toHaveCssClass(
        'test-button-2'
      );
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl.children.item(0)).toHaveCssClass(
        'test-button-inset'
      );
    });

    it('should render the inset icon element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset');

      expect(els.insetIconEl.children.item(0)).toHaveCssClass(
        'test-icon-inset'
      );
    });

    it('should render the left inset icon element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset-left');

      expect(els.leftInsetIconEl.children.item(0)).toHaveCssClass(
        'test-icon-inset'
      );
    });

    it('should focus on the control when clicking on an inset icon', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);
      const spy = spyOn(
        SkyInputBoxAdapterService.prototype,
        'focusControl'
      ).and.callThrough();

      fixture.detectChanges();
      const insetIconWrapperEl = getInsetIconWrapperEl(
        fixture,
        'input-icon-inset'
      );
      const el = getControlEl(fixture, 'input-icon-inset') as Element;
      insetIconWrapperEl.click();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(el).toEqual(document.activeElement);
    });

    it('should not call adapter method when clicking on a disabled inset icon', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);
      fixture.componentInstance.insetIconDisabled = true;
      const spy = spyOn(
        SkyInputBoxAdapterService.prototype,
        'focusControl'
      ).and.callThrough();

      fixture.detectChanges();
      const insetIconWrapperEl = getInsetIconWrapperEl(
        fixture,
        'input-icon-inset'
      );
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
      expect(inputGroupBtnEl1.children.item(0)).toHaveCssClass(
        'test-button-left'
      );
    });

    it('should add a CSS class to the form control wrapper on focus in', fakeAsync(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxFormControlEl = inputBoxEl.querySelector(
        '.sky-input-box-group-form-control'
      );

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

    it('should not add a CSS class to the form control wrapper when focusing on inline help', fakeAsync(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-inline-help');
      const inputBoxFormControlEl = inputBoxEl.querySelector(
        '.sky-input-box-group-form-control'
      );
      const helpBtn = inputBoxEl.querySelector('button');

      const focusCls = 'sky-input-box-group-form-control-focus';

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);

      helpBtn.focus();
      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusin');

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

      validateInvalid('when hasErrors is undefined', inputBoxEl, false);

      fixture.componentInstance.hasErrors = true;
      fixture.detectChanges();

      validateInvalid('when hasErrors is true', inputBoxEl, true);
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

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-name-error'
      );

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorForm.controls['errorFormField']
      );
    });
  });
});
