import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
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

interface InputBoxA11yTestingOptions {
  disabled?: boolean;
  hasErrors?: boolean;
  characterCountHelp?: boolean;
  a11yInsetIconLeft?: boolean;
  a11yInsetIcon?: boolean;
  a11yButtonLeft?: boolean;
  a11yInsetButton?: boolean;
  a11yNormalButton?: boolean;
  inlineHelpType?: 'custom' | 'sky';
}

describe('Input box component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  function a11yTests(): void {
    for (const inputType of ['input', 'textarea', 'select']) {
      it(`should pass accessibility (content: ${inputType}, disabled: undefined, hasErrors: undefined)`, async () => {
        await validateA11y(`${inputType}`);
      });

      it(`should pass accessibility (content: ${inputType}, disabled: false, hasErrors: undefined)`, async () => {
        await validateA11y(`${inputType}`, { disabled: false });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: true, hasErrors: undefined)`, async () => {
        await validateA11y(`${inputType}`, { disabled: true });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: undefined, hasErrors: false)`, async () => {
        await validateA11y(`${inputType}`, { hasErrors: false });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: false, hasErrors: false)`, async () => {
        await validateA11y(`${inputType}`, {
          disabled: false,
          hasErrors: false,
        });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: true, hasErrors: false)`, async () => {
        await validateA11y(`${inputType}`, {
          disabled: true,
          hasErrors: false,
        });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: undefined, hasErrors: true)`, async () => {
        await validateA11y(`${inputType}`, { hasErrors: true });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: false, hasErrors: true)`, async () => {
        await validateA11y(`${inputType}`, {
          disabled: false,
          hasErrors: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, disabled: true, hasErrors: true)`, async () => {
        await validateA11y(`${inputType}`, {
          disabled: true,
          hasErrors: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, inline-help: custom)`, async () => {
        await validateA11y(`.${inputType}-inline-help`);
      });

      it(`should pass accessibility (content: ${inputType}, inline-help: sky)`, async () => {
        await validateA11y(`.${inputType}-inline-help`, {
          inlineHelpType: 'sky',
        });
      });

      it(`should pass accessibility (content: ${inputType}, character-count)`, async () => {
        await validateA11y(`.${inputType}-character-count`);
      });

      it(`should pass accessibility (content: ${inputType}, character-count, inline-help: sky)`, async () => {
        await validateA11y(`.${inputType}-character-count`, {
          characterCountHelp: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: undefined, right-internal: button)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yNormalButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: undefined, right-internal: button inset)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yInsetButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: undefined, right-internal: icon inset)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yInsetIcon: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: undefined)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yButtonLeft: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: button)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yButtonLeft: true,
          a11yNormalButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: button inset)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yButtonLeft: true,
          a11yInsetButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: icon inset)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yButtonLeft: true,
          a11yInsetIcon: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: button, disabled: true)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          disabled: true,
          a11yButtonLeft: true,
          a11yNormalButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: button, hasErrors: true)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          hasErrors: true,
          a11yButtonLeft: true,
          a11yNormalButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: button inset, disabled: true)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          disabled: true,
          a11yButtonLeft: true,
          a11yInsetButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: button, right-internal: button inset, hasErrors: true)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          hasErrors: true,
          a11yButtonLeft: true,
          a11yInsetButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: icon inset, right-internal: undefined)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yInsetIconLeft: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: icon inset, right-internal: button)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yInsetIconLeft: true,
          a11yNormalButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: icon inset, right-internal: button inset)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yInsetIconLeft: true,
          a11yInsetButton: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: icon inset, right-internal: icon inset)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          a11yInsetIconLeft: true,
          a11yInsetIcon: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: icon inset, right-internal: icon inset, disabled: true)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          disabled: true,
          a11yInsetIconLeft: true,
          a11yInsetIcon: true,
        });
      });

      it(`should pass accessibility (content: ${inputType}, left-internal: icon inset, right-internal: icon inset, hasErrors: true)`, async () => {
        await validateA11y(`.${inputType}-internal-components`, {
          hasErrors: true,
          a11yInsetIconLeft: true,
          a11yInsetIcon: true,
        });
      });
    }
  }

  function getInputBoxEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLDivElement | null {
    return fixture.nativeElement.querySelector(`.${parentCls} sky-input-box`);
  }

  function getControlEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLInputElement | null {
    return fixture.nativeElement.querySelector(
      `.${parentCls} .sky-form-control`
    );
  }

  function getInsetIconWrapperEl(
    fixture: ComponentFixture<any>,
    parentCls: string
  ): HTMLInputElement | null {
    return fixture.nativeElement.querySelector(
      `.${parentCls} .sky-input-box-icon-inset-wrapper`
    );
  }

  async function validateA11y(
    selector: string,
    options: InputBoxA11yTestingOptions = {}
  ): Promise<void> {
    const fixture = TestBed.createComponent(InputBoxFixtureComponent);
    const cmp = fixture.componentInstance;

    cmp.basicDisabled = options.disabled;
    cmp.hasErrors = options.hasErrors;
    cmp.characterCountHelp = options.characterCountHelp ?? false;
    cmp.a11yInsetIconLeft = options.a11yInsetIconLeft ?? false;
    cmp.a11yInsetIcon = options.a11yInsetIcon ?? false;
    cmp.a11yButtonLeft = options.a11yButtonLeft ?? false;
    cmp.a11yInsetButton = options.a11yInsetButton ?? false;
    cmp.a11yNormalButton = options.a11yNormalButton ?? false;
    cmp.inlineHelpType = options.inlineHelpType ?? 'custom';

    fixture.detectChanges();

    await fixture.whenStable();
    await expectAsync(
      fixture.nativeElement.querySelector(selector)
    ).toBeAccessible();
  }

  function validateInvalid(
    context: string,
    inputBoxEl: Element | null,
    invalid: boolean
  ): void {
    const formControlEl = inputBoxEl?.querySelector(
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
    inputBoxEl: Element | null,
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
      characterCountEl: HTMLElement | null;
      inputBoxEl: HTMLElement | null;
      inputEl: HTMLElement | null;
      inputGroupBtnEls: HTMLElement[];
      inputGroupEl: HTMLElement | null;
      insetBtnEl: HTMLElement | null;
      labelEl: HTMLLabelElement | null;
      inlineHelpEl: HTMLElement | null;
    } {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const formGroupEl = inputBoxEl?.querySelector(
        '.sky-form-group'
      ) as HTMLElement | null;

      const labelEl = formGroupEl?.querySelector(
        '.sky-control-label'
      ) as HTMLLabelElement | null;

      const inlineHelpEl = formGroupEl?.querySelector(
        '.sky-control-help'
      ) as HTMLElement | null;

      const characterCountEl = formGroupEl?.querySelector(
        'sky-character-counter-indicator'
      ) as HTMLElement | null;

      const inputGroupEl = formGroupEl?.querySelector(
        '.sky-input-group'
      ) as HTMLElement | null;

      const inputGroupInnerEl = inputGroupEl?.querySelector(
        '.sky-input-box-input-group-inner'
      ) as HTMLElement | null;

      const inputEl = inputGroupInnerEl?.querySelector(
        '.sky-form-control'
      ) as HTMLElement | null;

      const insetBtnEl = inputGroupInnerEl?.querySelector(
        '.sky-input-box-btn-inset'
      ) as HTMLElement | null;

      const inputGroupBtnEls = inputGroupEl?.children
        ? (Array.from(inputGroupEl.children).slice(1) as HTMLElement[])
        : [];

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
      expect(els.inputEl).toExist();
      expect(els.inputGroupEl).toExist();

      expect(els.labelEl?.htmlFor).toBe(els.inputEl?.id);

      expect(els.inputEl?.tagName).toBe('INPUT');
    });

    it('should render the inline help in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-inline-help');

      expect(els.inlineHelpEl).toExist();
      expect(els.inlineHelpEl?.innerText.trim()).toBe('CUSTOM HELP WIDGET');
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-multiple-buttons');

      expect(els.inputEl).toExist();
      expect(els.inputEl?.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0]?.children.item(0)).toHaveCssClass(
        'test-button-1'
      );
      expect(els.inputGroupBtnEls[1]?.children.item(0)).toHaveCssClass(
        'test-button-2'
      );
    });

    it('should render the character count element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-character-count');

      expect(els.characterCountEl).toExist();
      expect(els.characterCountEl?.tagName).toBe(
        'SKY-CHARACTER-COUNTER-INDICATOR'
      );
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl?.children.item(0)).toHaveCssClass(
        'test-button-inset'
      );
    });

    it('should render the error label in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-error');

      const errorEl = inputBoxEl?.querySelector('.sky-error-label');

      expect(errorEl).toBeVisible();
    });

    it('should render the error status indicator in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-error-status-indicator'
      );

      const errorEl = inputBoxEl?.querySelector('.sky-error-indicator');

      expect(errorEl).toBeVisible();
    });

    it('should allow a child to place template items inside the input box programmatically', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.inputEl).toExist();
      expect(els.inputEl?.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0]?.children.item(0)).toHaveCssClass(
        'host-service-button-1'
      );
      expect(els.inputGroupBtnEls[1]?.children.item(0)).toHaveCssClass(
        'host-service-button-2'
      );
    });

    it('should add a disabled CSS class when disabled', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxWrapperEl = inputBoxEl?.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.basicDisabled = true;
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    describe('a11y', () => {
      a11yTests();
    });
  });

  describe('in modern theme', () => {
    function getModernEls(
      fixture: ComponentFixture<any>,
      parentCls: string
    ): {
      characterCountEl: HTMLElement | null;
      inputBoxEl: HTMLElement | null;
      inputEl: HTMLElement | null;
      inputGroupBtnEls: HTMLElement[];
      insetBtnEl: HTMLElement | null;
      insetIconEl: HTMLElement | null;
      insetIconWrapperEl: HTMLElement | null;
      leftInsetIconEl: HTMLElement | null;
      labelEl: HTMLLabelElement | null;
      inlineHelpEl: HTMLElement | null;
    } {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const inputGroupEl = inputBoxEl?.querySelector(
        '.sky-input-box-group'
      ) as HTMLElement | null;

      const formGroupEl = inputGroupEl?.querySelector(
        '.sky-input-box-group-form-control > .sky-form-group'
      );

      const formGroupInnerEl = formGroupEl?.querySelector(
        '.sky-input-box-form-group-inner'
      ) as HTMLElement | null;

      const labelEl = formGroupInnerEl?.querySelector(
        '.sky-input-box-label-wrapper > .sky-control-label'
      ) as HTMLLabelElement | null;

      const inlineHelpEl = formGroupEl?.querySelector(
        '.sky-control-help'
      ) as HTMLElement | null;

      const characterCountEl = formGroupInnerEl?.children
        ?.item(0)
        ?.children.item(1) as HTMLLabelElement | null;

      const inputEl = formGroupInnerEl?.querySelector(
        '.sky-form-control'
      ) as HTMLElement | null;

      const insetBtnEl = formGroupEl?.querySelector(
        '.sky-input-box-btn-inset'
      ) as HTMLElement | null;

      const insetIconEl = formGroupEl?.querySelector(
        '.sky-input-box-icon-inset'
      ) as HTMLElement | null;

      const insetIconWrapperEl = formGroupEl?.querySelector(
        '.sky-input-box-icon-inset-wrapper'
      ) as HTMLElement | null;

      const leftInsetIconEl = formGroupEl?.querySelector(
        '.sky-input-box-icon-inset-left'
      ) as HTMLElement | null;

      const inputGroupBtnEls = inputGroupEl?.children
        ? (Array.from(inputGroupEl.children).slice(1) as HTMLElement[])
        : [];

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
      expect(els.inputEl).toExist();
      expect(els.labelEl?.htmlFor).toBe(els.inputEl?.id);

      expect(els.inputEl?.tagName).toBe('INPUT');
    });

    it('should render the inline help in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-inline-help');

      expect(els.inlineHelpEl).toExist();
      expect(els.inlineHelpEl?.innerText.trim()).toBe('CUSTOM HELP WIDGET');
    });

    it('should render the character count element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const modernEls = getModernEls(fixture, 'input-character-count');

      expect(modernEls.characterCountEl).toExist();
      expect(modernEls.characterCountEl?.tagName).toBe(
        'SKY-CHARACTER-COUNTER-INDICATOR'
      );
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-multiple-buttons');

      expect(els.inputGroupBtnEls[0]?.children.item(0)).toHaveCssClass(
        'test-button-1'
      );
      expect(els.inputGroupBtnEls[1]?.children.item(0)).toHaveCssClass(
        'test-button-2'
      );
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl?.children.item(0)).toHaveCssClass(
        'test-button-inset'
      );
    });

    it('should render the inset icon element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset');

      expect(els.insetIconEl?.children.item(0)).toHaveCssClass(
        'test-icon-inset'
      );
    });

    it('should render the left inset icon element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset-left');

      expect(els.leftInsetIconEl?.children.item(0)).toHaveCssClass(
        'test-icon-inset'
      );
    });

    it('should render the error label in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-error');

      const errorEl = inputBoxEl?.querySelector('.sky-error-label');

      expect(errorEl).toBeVisible();
    });

    it('should render the error status indicator in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-error-status-indicator'
      );

      const errorEl = inputBoxEl?.querySelector('.sky-error-indicator');

      expect(errorEl).toBeVisible();
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
      const el = getControlEl(fixture, 'input-icon-inset') as Element | null;
      insetIconWrapperEl?.click();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(el).toEqual(document?.activeElement);
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
      insetIconWrapperEl?.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should render the left input group button element in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-single-button-left');

      const inputBoxGroupEl = inputBoxEl?.querySelector('.sky-input-box-group');
      const inputGroupBtnEl1 = inputBoxGroupEl?.children.item(0);
      const inputEl = inputBoxGroupEl?.children.item(1);

      expect(inputEl).toHaveCssClass('sky-input-box-group-form-control');
      expect(inputGroupBtnEl1?.children.item(0)).toHaveCssClass(
        'test-button-left'
      );
    });

    it('should add a CSS class to the form control wrapper on focus in', fakeAsync(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxFormControlEl = inputBoxEl?.querySelector(
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
      const inputBoxFormControlEl = inputBoxEl?.querySelector(
        '.sky-input-box-group-form-control'
      );

      const helpBtn = inputBoxEl?.querySelector('button');

      const focusCls = 'sky-input-box-group-form-control-focus';

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);

      helpBtn?.focus();
      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusin');

      tick();
      fixture.detectChanges();

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);
    }));

    it('should add a disabled CSS class when disabled', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxWrapperEl = inputBoxEl?.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.basicDisabled = true;
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    it('should add an invalid CSS class when marked invalid with hasErrors property', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-has-errors');

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

    describe('a11y', () => {
      a11yTests();
    });
  });
});
