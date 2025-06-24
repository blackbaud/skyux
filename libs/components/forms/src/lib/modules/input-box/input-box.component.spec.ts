import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { firstValueFrom } from 'rxjs';

import { InputBoxFixtureComponent } from './fixtures/input-box.component.fixture';
import { InputBoxFixturesModule } from './fixtures/input-box.module.fixture';
import { SkyInputBoxAdapterService } from './input-box-adapter.service';
import { SkyInputBoxHostService } from './input-box-host.service';

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

interface InputBoxElements {
  characterCountEl: HTMLElement | null;
  hintTextEl: HTMLElement | null;
  inputBoxEl: HTMLElement | null;
  inputEl: HTMLElement | null;
  inputGroupBtnEls: HTMLElement[];
  inputGroupEl: HTMLElement | null;
  insetBtnEl: HTMLElement | null;
  labelEl: HTMLLabelElement | null;
  inlineHelpEl: HTMLElement | null;
  insetIconEl: HTMLElement | null;
  insetIconWrapperEl: HTMLElement | null;
  leftInsetIconEl: HTMLElement | null;
}

describe('Input box component', () => {
  let fixture: ComponentFixture<InputBoxFixtureComponent>;

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
    fixture: ComponentFixture<InputBoxFixtureComponent>,
    parentCls: string,
  ): HTMLDivElement | null {
    return fixture.nativeElement.querySelector(`.${parentCls} sky-input-box`);
  }

  function getControlEl(
    fixture: ComponentFixture<InputBoxFixtureComponent>,
    parentCls: string,
  ): HTMLInputElement | null {
    return fixture.nativeElement.querySelector(
      `.${parentCls} .sky-form-control`,
    );
  }

  function getInsetIconWrapperEl(
    fixture: ComponentFixture<InputBoxFixtureComponent>,
    parentCls: string,
  ): HTMLInputElement | null {
    return fixture.nativeElement.querySelector(
      `.${parentCls} .sky-input-box-icon-inset-wrapper`,
    );
  }

  async function validateA11y(
    selector: string,
    options: InputBoxA11yTestingOptions = {},
  ): Promise<void> {
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
      fixture.nativeElement.querySelector(selector),
    ).toBeAccessible();
  }

  function validateInvalid(
    context: string,
    inputBoxEl: Element | null,
    invalid: boolean,
  ): void {
    const formControlEl = inputBoxEl?.querySelector(
      '.sky-input-box-group-form-control',
    );

    const invalidCls = 'sky-input-box-group-form-control-invalid';

    if (invalid) {
      (expect(formControlEl).withContext(context) as any).toHaveCssClass(
        invalidCls,
      );
    } else {
      (expect(formControlEl).withContext(context) as any).not.toHaveCssClass(
        invalidCls,
      );
    }
  }

  function validateControlValid(
    fixture: ComponentFixture<any>,
    inputBoxEl: Element | null,
    control: AbstractControl,
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

  function validateLabelAccessibilityLabel(
    els: Partial<InputBoxElements>,
    label: string | null,
  ): void {
    expect(els.labelEl?.getAttribute('aria-label')).toBe(label);
  }

  describe('default theme', () => {
    function getDefaultEls(
      fixture: ComponentFixture<any>,
      parentCls: string,
    ): Omit<
      InputBoxElements,
      'insetIconEl' | 'insetIconWrapperEl' | 'leftInsetIconEl'
    > {
      const parentEl = document.querySelector(`.${parentCls}`);
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      // Cases where we use `(inputBoxEl || parentEl)` are to handle tests that test an input without a wrapping input box
      const formGroupEl = (inputBoxEl || parentEl)?.querySelector(
        '.sky-form-group',
      ) as HTMLElement | null;

      const labelEl = formGroupEl?.querySelector(
        '.sky-control-label',
      ) as HTMLLabelElement | null;

      const inlineHelpEl = formGroupEl?.querySelector(
        '.sky-control-help',
      ) as HTMLElement | null;

      const characterCountEl = formGroupEl?.querySelector(
        'sky-character-counter-indicator',
      ) as HTMLElement | null;

      const inputGroupEl = formGroupEl?.querySelector(
        '.sky-input-group',
      ) as HTMLElement | null;

      const inputGroupInnerEl = inputGroupEl?.querySelector(
        '.sky-input-box-input-group-inner',
      ) as HTMLElement | null;

      const hintTextEl = formGroupEl?.querySelector(
        '.sky-input-box-hint-text',
      ) as HTMLElement | null;

      let inputEl = (inputGroupInnerEl || parentEl)?.querySelector(
        '.sky-form-control',
      ) as HTMLElement | null;

      // Handles tests where we test a standard input with the control directive
      if (!inputEl) {
        inputEl = (inputGroupInnerEl || parentEl)?.querySelector(
          'input',
        ) as HTMLElement | null;
      }

      const insetBtnEl = inputGroupInnerEl?.querySelector(
        '.sky-input-box-btn-inset',
      ) as HTMLElement | null;

      const inputGroupBtnEls = inputGroupEl?.children
        ? (Array.from(inputGroupEl.children).slice(1) as HTMLElement[])
        : [];

      return {
        characterCountEl,
        hintTextEl,
        inputBoxEl,
        inputEl,
        inputGroupBtnEls,
        inputGroupEl,
        insetBtnEl,
        labelEl,
        inlineHelpEl,
      };
    }

    async function validateHelpInline(
      fixture: ComponentFixture<InputBoxFixtureComponent>,
      expectedText: string,
    ): Promise<void> {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const helpInlineHarness = await loader.getHarness(
        SkyHelpInlineHarness.with({
          selector: '.input-easy-mode sky-help-inline',
        }),
      );

      expect(await helpInlineHarness.getAriaLabel()).toBe(
        'Show help content for Easy mode',
      );

      await helpInlineHarness.click();

      // Allow the popover open event to fire.
      fixture.detectChanges();
      await fixture.whenStable();

      // Allow the aria-expanded attribute to update.
      fixture.detectChanges();

      const popoverBodyEl = document.querySelector(
        'sky-overlay .sky-popover-body',
      );

      expect(popoverBodyEl).toHaveText(expectedText);
      expect(await helpInlineHarness.getAriaExpanded()).toBeTrue();

      document.body.click();

      fixture.detectChanges();
      await fixture.whenStable();

      // Allow the aria-expanded attribute to update.
      fixture.detectChanges();

      expect(await helpInlineHarness.getAriaExpanded()).toBeFalse();

      fixture.componentInstance.easyModeHelpPopoverContent = undefined;
      fixture.detectChanges();

      expect(
        getDefaultEls(fixture, 'input-easy-mode').inlineHelpEl,
      ).not.toExist();
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InputBoxFixturesModule, SkyHelpTestingModule],
      });

      fixture = TestBed.createComponent(InputBoxFixtureComponent);
    });

    it('should render the label and input elements in the expected locations', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-basic');

      expect(els.labelEl).toExist();
      expect(els.inputEl).toExist();
      expect(els.inputGroupEl).toExist();

      expect(els.labelEl?.htmlFor).toBe(els.inputEl?.id);
      validateLabelAccessibilityLabel(els, null);

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
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-multiple-buttons');

      expect(els.inputEl).toExist();
      expect(els.inputEl?.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0]?.children.item(0)).toHaveCssClass(
        'test-button-1',
      );
      expect(els.inputGroupBtnEls[1]?.children.item(0)).toHaveCssClass(
        'test-button-2',
      );
    });

    it('should render the character count element in the expected locations', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-character-count');

      expect(els.characterCountEl).toExist();
      expect(els.characterCountEl?.tagName).toBe(
        'SKY-CHARACTER-COUNTER-INDICATOR',
      );
    });

    it('should render the inset button element in the expected location', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl?.children.item(0)).toHaveCssClass(
        'test-button-inset',
      );
    });

    it('should render the error label in the expected location', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-error');

      const errorEl = inputBoxEl?.querySelector('.sky-error-label');

      expect(errorEl).toBeVisible();
    });

    it('should render the error status indicator in the expected location', () => {
      fixture.componentInstance.errorField.markAsTouched();
      fixture.componentInstance.errorField.updateValueAndValidity();

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-error-status-indicator',
      );

      const errorEl = inputBoxEl?.querySelector('.sky-error-indicator');

      expect(errorEl).toBeVisible();
    });

    it('should allow a child to place template items inside the input box programmatically', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.inputEl).toExist();
      expect(els.inputEl?.tagName).toBe('INPUT');

      expect(els.inputGroupBtnEls[0]?.children.item(0)).toHaveCssClass(
        'host-service-button-1',
      );
      expect(els.inputGroupBtnEls[1]?.children.item(0)).toHaveCssClass(
        'host-service-button-2',
      );

      const hostServiceInputBox = fixture.debugElement
        .query(By.css('.input-host-service sky-input-box'))
        .injector.get(SkyInputBoxHostService);

      expect(
        fixture.nativeElement.querySelector('.input-box-host-control-id'),
      ).toHaveText(hostServiceInputBox.controlId);
    });

    it('should add a disabled CSS class when disabled', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxWrapperEl = inputBoxEl?.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.basicDisabled = true;
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    it('should add a disabled CSS class when the form control is disabled', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-name-error',
      );
      const inputBoxWrapperEl = inputBoxEl?.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.errorForm.get('errorFormField')?.disable();
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    it('should display labelText as label', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.labelEl).toHaveText('Easy mode');
      expect(els.labelEl?.htmlFor).toBe(els.inputEl?.id);
      validateLabelAccessibilityLabel(els, 'Easy mode 0 characters out of 10');
    });

    it('should add stacked CSS class', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.inputBoxEl).toHaveCssClass('sky-form-field-stacked');

      fixture.componentInstance.easyModeStacked = false;
      fixture.detectChanges();

      expect(els.inputBoxEl).not.toHaveCssClass('sky-form-field-stacked');
    });

    it('should add help inline for text', async () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);
      fixture.detectChanges();

      await validateHelpInline(fixture, 'Help content from text');
    });

    it('should add help inline for template', async () => {
      fixture.detectChanges();

      fixture.componentInstance.easyModeHelpPopoverContent =
        fixture.componentInstance.easyModePopoverTemplate;
      fixture.detectChanges();

      await validateHelpInline(fixture, 'Help content from template');
    });

    it('should not render help inline button if labelText undefined', () => {
      fixture.detectChanges();

      fixture.componentRef.setInput('labelText', undefined);
      fixture.componentInstance.easyModeHelpPopoverContent = "What's this?";
      fixture.detectChanges();

      const easyModeInput = getDefaultEls(fixture, 'input-easy-mode');

      expect(
        easyModeInput.inlineHelpEl?.querySelector('.sky-help-inline'),
      ).toBeUndefined();
    });

    it('should render help inline with help key', () => {
      fixture.detectChanges();

      fixture.componentInstance.easyModeHelpPopoverContent = undefined;
      fixture.componentInstance.easyModeHelpKey = 'index.html';

      const easyModeInput = getDefaultEls(fixture, 'input-easy-mode');

      expect(
        easyModeInput.inlineHelpEl?.querySelector('.sky-help-inline'),
      ).toBeTruthy();
    });

    it('should set global help config with help key', async () => {
      const helpController = TestBed.inject(SkyHelpTestingController);

      fixture.detectChanges();

      fixture.componentInstance.easyModeHelpPopoverContent = undefined;
      fixture.componentInstance.easyModeHelpKey = 'index.html';

      fixture.detectChanges();

      const easyModeInput = getDefaultEls(fixture, 'input-easy-mode');
      const helpInlineButton = easyModeInput.inlineHelpEl?.querySelector(
        '.sky-help-inline',
      ) as HTMLElement | undefined;
      helpInlineButton?.click();

      await fixture.whenStable();
      fixture.detectChanges();

      helpController.expectCurrentHelpKey('index.html');
    });

    it('should add character count', async () => {
      // Render the the component and apply the field's ngModel value.
      fixture.detectChanges();
      await fixture.whenStable();

      // Update the character count.
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode');

      const characterCountLabelEl = els.characterCountEl?.querySelector(
        '.sky-character-count-label',
      );

      expect(characterCountLabelEl).toHaveText('0/10');

      validateLabelAccessibilityLabel(els, 'Easy mode 0 characters out of 10');

      fixture.componentInstance.easyModeValue = 'def';

      fixture.detectChanges();
      await fixture.whenStable();

      fixture.detectChanges();

      expect(characterCountLabelEl).toHaveText('3/10');

      // Aria-label updates when not focused
      validateLabelAccessibilityLabel(els, 'Easy mode 3 characters out of 10');

      fixture.componentInstance.easyModeCharacterLimit = 11;

      fixture.detectChanges();

      expect(characterCountLabelEl).toHaveText('3/11');

      // Aria-label updates when not focused
      validateLabelAccessibilityLabel(els, 'Easy mode 3 characters out of 11');

      SkyAppTestUtility.fireDomEvent(els.inputEl, 'focusin');

      fixture.componentInstance.easyModeValue = 'kitten';

      fixture.detectChanges();
      await fixture.whenStable();

      fixture.detectChanges();

      expect(characterCountLabelEl).toHaveText('6/11');

      // Aria-label does not update when focused
      validateLabelAccessibilityLabel(els, 'Easy mode 3 characters out of 11');

      SkyAppTestUtility.fireDomEvent(els.inputEl, 'focusout');

      fixture.detectChanges();
      await fixture.whenStable();

      // Aria-label updates when focus lis lost
      validateLabelAccessibilityLabel(els, 'Easy mode 6 characters out of 11');
    });

    it('should remove character count when character limit is set to undefined', () => {
      fixture.detectChanges();

      let els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.characterCountEl).toExist();

      fixture.componentInstance.easyModeCharacterLimit = undefined;
      fixture.detectChanges();

      els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.characterCountEl).not.toExist();
    });

    it('should set required if set by the child via host service', () => {
      const hostServiceInputBox = fixture.debugElement
        .query(By.css('.easy-input-host-service sky-input-box'))
        .injector.get(SkyInputBoxHostService);

      fixture.detectChanges();

      let requiredLabel = fixture.nativeElement.querySelector(
        '.easy-input-host-service .sky-control-label-required',
      );
      expect(requiredLabel).not.toExist();

      hostServiceInputBox.setRequired(true);
      fixture.detectChanges();

      requiredLabel = fixture.nativeElement.querySelector(
        '.easy-input-host-service .sky-control-label-required',
      );
      expect(requiredLabel).toExist();
    });

    it('should add hint text', () => {
      fixture.detectChanges();

      let els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.hintTextEl).not.toExist();

      fixture.componentInstance.easyModeHintText = 'Some hint text.';
      fixture.detectChanges();

      els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.hintTextEl).toHaveText('Some hint text.');

      const ariaDescribedBy = els.inputEl?.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBeTruthy();
      expect(ariaDescribedBy).toBe(els.hintTextEl?.id);

      fixture.componentInstance.easyModeHintText = undefined;
      fixture.detectChanges();

      els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.hintTextEl).not.toExist();

      expect(els.inputEl?.hasAttribute('aria-describedby')).toBeFalse();
    });

    it('should allow a child to add hint text programmatically', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.hintTextEl).toHaveText('Host component hint text.');
    });

    it('should allow both child and consumer specified hint text', () => {
      fixture.componentInstance.easyModeHintText = 'Consumer hint text.';
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.hintTextEl).toHaveText(
        'Consumer hint text. Host component hint text.',
      );
    });

    it('should hide hint text when `setHintTextHidden` is called with `true`', async () => {
      fixture.detectChanges();
      fixture.componentInstance.inputBoxHostServiceComponent?.setHintTextHidden(
        true,
      );
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.hintTextEl).not.toBeVisible({ checkCssVisibility: true });
      await expectAsync(els.inputBoxEl).toBeAccessible();
    });

    it('should show hint text when `setHintTextHidden` is called with `false`', async () => {
      fixture.detectChanges();
      fixture.componentInstance.inputBoxHostServiceComponent?.setHintTextHidden(
        false,
      );
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.hintTextEl).toBeVisible({ checkCssVisibility: true });
      await expectAsync(els.inputBoxEl).toBeAccessible();
    });

    it('should hide hint text when `setHintTextScreenReaderOnly` is called with `true`', async () => {
      fixture.detectChanges();
      fixture.componentInstance.inputBoxHostServiceComponent?.setHintTextScreenReaderOnly(
        true,
      );
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.hintTextEl).toHaveClass('sky-screen-reader-only');
      await expectAsync(els.inputBoxEl).toBeAccessible();
    });

    it('should show hint text when `setHintTextScreenReaderOnly` is called with `false`', async () => {
      fixture.detectChanges();
      fixture.componentInstance.inputBoxHostServiceComponent?.setHintTextScreenReaderOnly(
        false,
      );
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-host-service');

      expect(els.hintTextEl).not.toHaveClass('sky-screen-reader-only');
      await expectAsync(els.inputBoxEl).toBeAccessible();
    });

    it('should get whether the component contains an element', () => {
      fixture.detectChanges();

      const elementInside = fixture.nativeElement.querySelector(
        '.input-inside-host-service',
      );

      expect(
        fixture.componentInstance.inputBoxHostServiceComponent?.containsElement(
          elementInside,
        ),
      ).toBeTrue();

      const elementNotInside = fixture.nativeElement.querySelector(
        '.input-not-wrapped-no-autocomplete',
      );

      expect(
        fixture.componentInstance.inputBoxHostServiceComponent?.containsElement(
          elementNotInside,
        ),
      ).toBeFalse();
    });

    it('should query an element inside the input box component', () => {
      fixture.detectChanges();

      const elementInside = fixture.nativeElement.querySelector(
        '.input-inside-host-service',
      );
      const queriedElement =
        fixture.componentInstance.inputBoxHostServiceComponent?.queryInputBox(
          '.input-inside-host-service',
        );

      expect(elementInside === queriedElement).toBeTrue();
    });

    it('should preserve existing aria-describedby attributes when adding hint text', () => {
      fixture.componentInstance.easyModeHintText = 'Some hint text.';
      fixture.componentInstance.easyModeAriaDescribedBy =
        'existing-aria-describedby';
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.inputEl?.getAttribute('aria-describedby')).toBe(
        `existing-aria-describedby ${els.hintTextEl?.id}`,
      );

      fixture.componentInstance.easyModeHintText = undefined;
      fixture.detectChanges();

      expect(els.inputEl?.getAttribute('aria-describedby')).toBe(
        'existing-aria-describedby',
      );
    });

    it('should not set the input ID if it is already set', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-existing-id');

      expect(els.inputEl?.id).toBe('input-box-existing-id-123');
    });

    it('should set autocomplete to off if not specified', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode-no-autocomplete');

      expect(els.inputEl?.attributes?.getNamedItem('autocomplete')?.value).toBe(
        'off',
      );
    });

    it('should set autocomplete to off if specified as undefined', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.inputEl?.attributes?.getNamedItem('autocomplete')?.value).toBe(
        'off',
      );
    });

    it('should not overwrite autocomplete if specified', () => {
      fixture.componentInstance.autocomplete = 'fname';
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-easy-mode');

      expect(els.inputEl?.attributes?.getNamedItem('autocomplete')?.value).toBe(
        'fname',
      );
    });

    it('should not set autocomplete to off if not specified if not wrapped in an input box', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-not-wrapped-no-autocomplete');

      expect(els.inputEl?.attributes?.getNamedItem('autocomplete')?.value).toBe(
        'undefined',
      );
    });

    it('should not set autocomplete to off if specified as undefined if not wrapped in an input box', () => {
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-not-wrapped');

      expect(els.inputEl?.attributes?.getNamedItem('autocomplete')?.value).toBe(
        'undefined',
      );
    });

    it('should not overwrite autocomplete if specified if not wrapped in an input box', () => {
      fixture.componentInstance.autocomplete = 'fname';
      fixture.detectChanges();

      const els = getDefaultEls(fixture, 'input-not-wrapped');

      expect(els.inputEl?.attributes?.getNamedItem('autocomplete')?.value).toBe(
        'fname',
      );
    });

    describe('a11y', () => {
      a11yTests();
    });
  });

  describe('in modern theme', () => {
    function getModernEls(
      fixture: ComponentFixture<any>,
      parentCls: string,
    ): InputBoxElements {
      const inputBoxEl = getInputBoxEl(fixture, parentCls);

      const inputGroupEl = inputBoxEl?.querySelector(
        '.sky-input-box-group',
      ) as HTMLElement | null;

      const formGroupEl = inputGroupEl?.querySelector(
        '.sky-input-box-group-form-control > .sky-form-group',
      );

      const formGroupInnerEl = formGroupEl?.querySelector(
        '.sky-input-box-form-group-inner',
      ) as HTMLElement | null;

      const hintTextEl = formGroupEl?.querySelector(
        '.sky-input-box-hint-text',
      ) as HTMLElement | null;

      const labelEl = formGroupInnerEl?.querySelector(
        '.sky-input-box-label-wrapper > .sky-control-label',
      ) as HTMLLabelElement | null;

      const inlineHelpEl = formGroupEl?.querySelector(
        '.sky-control-help',
      ) as HTMLElement | null;

      const characterCountEl = formGroupInnerEl?.children
        ?.item(0)
        ?.children.item(1) as HTMLLabelElement | null;

      const inputEl = formGroupInnerEl?.querySelector(
        '.sky-form-control',
      ) as HTMLElement | null;

      const insetBtnEl = formGroupEl?.querySelector(
        '.sky-input-box-btn-inset',
      ) as HTMLElement | null;

      const insetIconEl = formGroupEl?.querySelector(
        '.sky-input-box-icon-inset',
      ) as HTMLElement | null;

      const insetIconWrapperEl = formGroupEl?.querySelector(
        '.sky-input-box-icon-inset-wrapper',
      ) as HTMLElement | null;

      const leftInsetIconEl = formGroupEl?.querySelector(
        '.sky-input-box-icon-inset-left',
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
        hintTextEl,
        inputGroupEl,
      };
    }

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [InputBoxFixturesModule],
      });

      fixture = TestBed.createComponent(InputBoxFixtureComponent);
      fixture.componentInstance.useModernTheme();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    afterAll(async () => {
      fixture.componentInstance.useDefaultTheme();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render the label and input elements in the expected locations', () => {
      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-basic');

      expect(els.labelEl).toExist();
      expect(els.inputEl).toExist();
      expect(els.labelEl?.htmlFor).toBe(els.inputEl?.id);
      validateLabelAccessibilityLabel(els, null);

      expect(els.inputEl?.tagName).toBe('INPUT');
    });

    it('should render the inline help in the expected location', () => {
      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-inline-help');

      expect(els.inlineHelpEl).toExist();
      expect(els.inlineHelpEl?.innerText.trim()).toBe('CUSTOM HELP WIDGET');
    });

    it('should render the character count element in the expected locations', () => {
      fixture.detectChanges();

      const modernEls = getModernEls(fixture, 'input-character-count');

      expect(modernEls.characterCountEl).toExist();
      expect(modernEls.characterCountEl?.tagName).toBe(
        'SKY-CHARACTER-COUNTER-INDICATOR',
      );
    });

    it('should render the input group button elements in the expected locations', () => {
      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-multiple-buttons');

      expect(els.inputGroupBtnEls[0]?.children.item(0)).toHaveCssClass(
        'test-button-1',
      );
      expect(els.inputGroupBtnEls[1]?.children.item(0)).toHaveCssClass(
        'test-button-2',
      );
    });

    it('should render the inset button element in the expected location', () => {
      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-button-inset');

      expect(els.insetBtnEl?.children.item(0)).toHaveCssClass(
        'test-button-inset',
      );
    });

    it('should render the inset icon element in the expected location', () => {
      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset');

      expect(els.insetIconEl?.children.item(0)).toHaveCssClass(
        'test-icon-inset',
      );
    });

    it('should render the left inset icon element in the expected location', () => {
      fixture.detectChanges();

      const els = getModernEls(fixture, 'input-icon-inset-left');

      expect(els.leftInsetIconEl?.children.item(0)).toHaveCssClass(
        'test-icon-inset',
      );
    });

    it('should render the error label in the expected location', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-error');

      const errorEl = inputBoxEl?.querySelector('.sky-error-label');

      expect(errorEl).toBeVisible();
    });

    it('should render the error status indicator in the expected location', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-error-status-indicator',
      );

      const errorEl = inputBoxEl?.querySelector('.sky-error-indicator');

      expect(errorEl).toBeVisible();
    });

    it('should focus on the control when clicking on an inset icon', () => {
      const spy = spyOn(
        SkyInputBoxAdapterService.prototype,
        'focusControl',
      ).and.callThrough();

      fixture.detectChanges();
      const insetIconWrapperEl = getInsetIconWrapperEl(
        fixture,
        'input-icon-inset',
      );
      const el = getControlEl(fixture, 'input-icon-inset') as Element | null;
      insetIconWrapperEl?.click();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(el).toEqual(document?.activeElement);
    });

    it('should not call adapter method when clicking on a disabled inset icon', () => {
      fixture.componentInstance.insetIconDisabled = true;
      const spy = spyOn(
        SkyInputBoxAdapterService.prototype,
        'focusControl',
      ).and.callThrough();

      fixture.detectChanges();
      const insetIconWrapperEl = getInsetIconWrapperEl(
        fixture,
        'input-icon-inset',
      );
      insetIconWrapperEl?.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should render the left input group button element in the expected locations', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-single-button-left');

      const inputBoxGroupEl = inputBoxEl?.querySelector('.sky-input-box-group');
      const inputGroupBtnEl1 = inputBoxGroupEl?.children.item(0);
      const inputEl = inputBoxGroupEl?.children.item(1);

      expect(inputEl).toHaveCssClass('sky-input-box-group-form-control');
      expect(inputGroupBtnEl1?.children.item(0)).toHaveCssClass(
        'test-button-left',
      );
    });

    it('should add a CSS class to the form control wrapper on focus in', fakeAsync(() => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxFormControlEl = inputBoxEl?.querySelector(
        '.sky-input-box-group-form-control',
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
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-inline-help');
      const inputBoxFormControlEl = inputBoxEl?.querySelector(
        '.sky-input-box-group-form-control',
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

    it('should add a CSS class to the form control wrapper when focusing on an inset button', fakeAsync(() => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-button-inset');
      const inputBoxFormControlEl = inputBoxEl?.querySelector(
        '.sky-input-box-group-form-control',
      );
      const els = getModernEls(fixture, 'input-button-inset');

      const focusCls = 'sky-input-box-group-form-control-focus';

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);

      els.insetBtnEl?.focus();
      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusin');

      tick();
      fixture.detectChanges();

      expect(inputBoxFormControlEl).toHaveCssClass(focusCls);

      // Focus out to verify class is removed
      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusout');

      tick();
      fixture.detectChanges();

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);
    }));

    it('should not add a CSS class to the form control wrapper when focusing on a non-inset button', fakeAsync(() => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-multiple-buttons');
      const inputBoxFormControlEl = inputBoxEl?.querySelector(
        '.sky-input-box-group-form-control',
      );
      const els = getModernEls(fixture, 'input-multiple-buttons');

      const focusCls = 'sky-input-box-group-form-control-focus';

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);

      // Focus the first non-inset button
      const firstButton = els.inputGroupBtnEls[0]?.children.item(
        0,
      ) as HTMLElement;
      firstButton?.focus();
      SkyAppTestUtility.fireDomEvent(firstButton, 'focusin');

      tick();
      fixture.detectChanges();

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);
    }));

    it('should add a disabled CSS class when disabled', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxWrapperEl = inputBoxEl?.querySelector('.sky-input-box');

      expect(inputBoxWrapperEl).not.toHaveCssClass('sky-input-box-disabled');

      fixture.componentInstance.basicDisabled = true;
      fixture.detectChanges();

      expect(inputBoxWrapperEl).toHaveCssClass('sky-input-box-disabled');
    });

    it('should add an invalid CSS class when marked invalid with hasErrors property', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-has-errors');

      validateInvalid('when hasErrors is undefined', inputBoxEl, false);

      fixture.componentInstance.hasErrors = true;
      fixture.detectChanges();

      validateInvalid('when hasErrors is true', inputBoxEl, true);
    });

    it('should add an invalid CSS class when ngModel is invalid', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-ngmodel-error');

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorNgModel.control,
      );
    });

    it('should add an invalid CSS class when form control is invalid', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-box-form-control-error');

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorField,
      );
    });

    it('should add an invalid CSS class when form control by name is invalid', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-box-form-control-name-error',
      );

      validateControlValid(
        fixture,
        inputBoxEl,
        fixture.componentInstance.errorForm.controls['errorFormField'],
      );
    });

    it('should display form control validation errors when labelText is specified', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-easy-mode',
      ) as HTMLDivElement;

      const inputEl = inputBoxEl.querySelector('input') as HTMLInputElement;
      inputEl.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errorEl = inputBoxEl.querySelector('sky-status-indicator');

      expect(errorEl).toHaveText('Error: Easy mode is required.');
    });

    it('should add required attributes to label and input when required', () => {
      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(
        fixture,
        'input-easy-mode-required',
      ) as HTMLDivElement;

      const inputEl = inputBoxEl.querySelector('input') as HTMLInputElement;

      expect(inputEl.ariaRequired).toBe('true');
      expect(inputBoxEl.querySelector('label')).toHaveCssClass(
        'sky-control-label-required',
      );

      fixture.componentInstance.removeErrorFormRequiredValidator();
      fixture.detectChanges();

      expect(inputEl.ariaRequired).toBeNull();
      expect(inputBoxEl.querySelector('label')).not.toHaveCssClass(
        'sky-control-label-required',
      );
    });

    describe('focus observables', () => {
      it('should emit inputFocusin observable when input box gains focus', async () => {
        fixture.detectChanges();

        const hostServiceInputBox = fixture.debugElement
          .query(By.css('.input-host-service sky-input-box'))
          .injector.get(SkyInputBoxHostService);

        const inputInsideHostServiceEl = fixture.nativeElement.querySelector(
          '.input-inside-host-service',
        );

        // Set up promise to listen for the observable
        const focusinPromise = firstValueFrom(hostServiceInputBox.inputFocusin);

        // Trigger focus in event
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusin');

        await fixture.whenStable();
        fixture.detectChanges();

        // Verify the observable emitted
        await expectAsync(focusinPromise).toBeResolved();
      });

      it('should emit inputFocusout observable when input box loses focus', async () => {
        fixture.detectChanges();

        const hostServiceInputBox = fixture.debugElement
          .query(By.css('.input-host-service sky-input-box'))
          .injector.get(SkyInputBoxHostService);

        const inputInsideHostServiceEl = fixture.nativeElement.querySelector(
          '.input-inside-host-service',
        );

        // First trigger focusin to establish focus state
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusin');
        await fixture.whenStable();
        fixture.detectChanges();

        // Set up promise to listen for the focusout observable
        const focusoutPromise = firstValueFrom(
          hostServiceInputBox.inputFocusout,
        );

        // Trigger focus out event
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusout');

        await fixture.whenStable();
        fixture.detectChanges();

        // Verify the observable emitted
        await expectAsync(focusoutPromise).toBeResolved();
      });

      it('should not emit inputFocusout observable when input box is focused and then an inset icon is clicked', async () => {
        fixture.detectChanges();

        const hostServiceInputBox = fixture.debugElement
          .query(By.css('.input-host-service sky-input-box'))
          .injector.get(SkyInputBoxHostService);

        const inputInsideHostServiceEl = fixture.nativeElement.querySelector(
          '.input-inside-host-service',
        );

        // First trigger focusin to establish focus state
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusin');
        await fixture.whenStable();
        fixture.detectChanges();

        let focusoutEmitted = false;
        hostServiceInputBox.inputFocusout.subscribe(() => {
          focusoutEmitted = true;
        });

        // Click an inset icon (this should not emit focusout since focus remains within the input box)
        const insetIconWrapperEl = fixture.nativeElement.querySelector(
          '.input-host-service .sky-input-box-icon-inset-wrapper',
        );
        insetIconWrapperEl?.click();
        SkyAppTestUtility.fireDomEvent(insetIconWrapperEl, 'focusin');
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusout', {
          customEventInit: { relatedTarget: insetIconWrapperEl },
        });

        await fixture.whenStable();
        fixture.detectChanges();

        // Verify the focusout observable was NOT emitted
        expect(focusoutEmitted).toBeFalse();
      });

      xit('should not emit inputFocusout observable when input box is focused and then an inset button is clicked', fakeAsync(() => {
        fixture.detectChanges();

        const hostServiceInputBox = fixture.debugElement
          .query(By.css('.input-host-service sky-input-box'))
          .injector.get(SkyInputBoxHostService);

        const inputInsideHostServiceEl = fixture.nativeElement.querySelector(
          '.input-inside-host-service',
        );

        // First trigger focusin to establish focus state
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusin');
        tick();
        fixture.detectChanges();

        let focusoutEmitted = false;
        hostServiceInputBox.inputFocusout.subscribe(() => {
          focusoutEmitted = true;
        });

        // Click an inset button (this should not emit focusout since focus remains within the input box)
        const els = getModernEls(fixture, 'input-button-inset');

        const insetButtonEl: HTMLElement | undefined =
          els.insetBtnEl?.children.item(0) as HTMLElement | undefined;
        insetButtonEl?.click();
        SkyAppTestUtility.fireDomEvent(insetButtonEl, 'focusin');
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusout', {
          customEventInit: { relatedTarget: insetButtonEl },
        });

        tick();
        fixture.detectChanges();

        // Verify the focusout observable was NOT emitted
        expect(focusoutEmitted).toBeFalse();
      }));

      xit('should not emit inputFocusout observable when input box is focused and then the label is clicked', fakeAsync(() => {
        fixture.detectChanges();

        const hostServiceInputBox = fixture.debugElement
          .query(By.css('.input-host-service sky-input-box'))
          .injector.get(SkyInputBoxHostService);

        const inputInsideHostServiceEl = fixture.nativeElement.querySelector(
          '.input-inside-host-service',
        );

        // First trigger focusin to establish focus state
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusin');
        tick();
        fixture.detectChanges();

        let focusoutEmitted = false;
        hostServiceInputBox.inputFocusout.subscribe(() => {
          focusoutEmitted = true;
        });

        // Click the label (this should not emit focusout since label clicks should maintain focus within the input box)
        const els = getModernEls(fixture, 'input-host-service');
        els.labelEl?.click();
        SkyAppTestUtility.fireDomEvent(els.labelEl, 'focusin');
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusout', {
          customEventInit: { relatedTarget: els.labelEl },
        });

        tick();
        fixture.detectChanges();

        // Verify the focusout observable was NOT emitted
        expect(focusoutEmitted).toBeFalse();
      }));

      it('should emit inputFocusout observable when input box is focused and then a non-inset button is clicked', async () => {
        fixture.detectChanges();

        const hostServiceInputBox = fixture.debugElement
          .query(By.css('.input-host-service sky-input-box'))
          .injector.get(SkyInputBoxHostService);

        const inputInsideHostServiceEl = fixture.nativeElement.querySelector(
          '.input-inside-host-service',
        );

        // First trigger focusin to establish focus state
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusin');
        await fixture.whenStable();
        fixture.detectChanges();

        // Set up promise to listen for the focusout observable
        const focusoutPromise = firstValueFrom(
          hostServiceInputBox.inputFocusout,
        );

        // Click a non-inset button (this should emit focusout since focus moves outside the input box)
        const els = getModernEls(fixture, 'input-host-service');
        const nonInsetButtonEl = els.inputGroupBtnEls[0]?.children.item(
          0,
        ) as HTMLElement;
        nonInsetButtonEl?.click();
        SkyAppTestUtility.fireDomEvent(nonInsetButtonEl, 'focusin');
        SkyAppTestUtility.fireDomEvent(inputInsideHostServiceEl, 'focusout', {
          customEventInit: { relatedTarget: nonInsetButtonEl },
        });

        await fixture.whenStable();
        fixture.detectChanges();

        // Verify the focusout observable was emitted
        await expectAsync(focusoutPromise).toBeResolved();
      });
    });

    describe('a11y', () => {
      a11yTests();
    });
  });
});
