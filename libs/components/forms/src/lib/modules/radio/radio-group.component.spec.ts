import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService, SkyLogService } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { SkyRadioFixturesModule } from './fixtures/radio-fixtures.module';
import { SkyRadioGroupBooleanTestComponent } from './fixtures/radio-group-boolean.component.fixture';
import { SkyRadioGroupReactiveFixtureComponent } from './fixtures/radio-group-reactive.component.fixture';
import { SkyRadioGroupFixtureComponent } from './fixtures/radio-group.component.fixture';
import { SkyRadioGroupHeadingLevel } from './types/radio-group-heading-level';
import { SkyRadioGroupHeadingStyle } from './types/radio-group-heading-style';

//#region helpers
function getRadios(
  radioFixture: ComponentFixture<any>,
): NodeListOf<HTMLInputElement> {
  return radioFixture.nativeElement.querySelectorAll('.sky-radio-input');
}

function getRadioGroup(
  radioFixture: ComponentFixture<any>,
): HTMLElement | null {
  return radioFixture.nativeElement.querySelector('.sky-radio-group');
}

function getRadioGroupLabel(
  radioFixture: ComponentFixture<any>,
): HTMLElement | null {
  return radioFixture.nativeElement.querySelector('.sky-radio-group-legend');
}

function getRadioLabels(
  fixture: ComponentFixture<any>,
): NodeListOf<HTMLElement> {
  return fixture.nativeElement.querySelectorAll('.sky-radio-wrapper');
}

function clickCheckbox(radioFixture: ComponentFixture<any>, index: number) {
  const radios = getRadios(radioFixture);
  radios.item(index).click();
  radioFixture.detectChanges();
  tick();
}
//#endregion

describe('Radio group component (reactive)', function () {
  let fixture: ComponentFixture<SkyRadioGroupReactiveFixtureComponent>;
  let componentInstance: SkyRadioGroupReactiveFixtureComponent;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [SkyRadioFixturesModule, SkyHelpTestingModule],
    });

    // Mock the ID service.
    let uniqueId = 0;
    const idSvc = TestBed.inject(SkyIdService);
    spyOn(idSvc, 'generateId').and.callFake(() => `MOCK_ID_${++uniqueId}`);

    fixture = TestBed.createComponent(SkyRadioGroupReactiveFixtureComponent);
    componentInstance = fixture.componentInstance;
  });

  afterEach(function () {
    fixture.destroy();
  });

  it('should update the form properly when nothing is selected on init', fakeAsync(function () {
    fixture.detectChanges();

    expect(componentInstance.radioForm?.value).toEqual({ radioGroup: null });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);

    clickCheckbox(fixture, 0);

    expect(componentInstance.radioForm?.value).toEqual({
      radioGroup: { name: 'Lilly Corr', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(true);
    expect(componentInstance.radioForm?.pristine).toEqual(false);
    expect(componentInstance.radioForm?.dirty).toEqual(true);
  }));

  it('should update the form properly when form is initialized with values', fakeAsync(function () {
    componentInstance.initialValue = componentInstance.options[0];

    fixture.detectChanges();

    expect(componentInstance.radioForm?.value).toEqual({
      radioGroup: { name: 'Lilly Corr', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);

    clickCheckbox(fixture, 1);

    expect(componentInstance.radioForm?.value).toEqual({
      radioGroup: { name: 'Sherry Ken', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(true);
    expect(componentInstance.radioForm?.pristine).toEqual(false);
    expect(componentInstance.radioForm?.dirty).toEqual(true);
  }));

  it('should not update dirty state when form value is updated programmatically', fakeAsync(function () {
    fixture.detectChanges();

    componentInstance.radioForm?.patchValue({
      radioGroup: componentInstance.options[0],
    });

    fixture.detectChanges();

    expect(componentInstance.radioForm?.value).toEqual({
      radioGroup: { name: 'Lilly Corr', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);

    clickCheckbox(fixture, 1);

    expect(componentInstance.radioForm?.value).toEqual({
      radioGroup: { name: 'Sherry Ken', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(true);
    expect(componentInstance.radioForm?.pristine).toEqual(false);
    expect(componentInstance.radioForm?.dirty).toEqual(true);
  }));

  it('should mark the form as touched after losing focus', fakeAsync(function () {
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.touched).toEqual(false);

    const debugElement = fixture.debugElement.query(
      By.css('input[type="radio"]'),
    );
    expect(debugElement.nativeElement).toExist();
    debugElement.triggerEventHandler('focus', {});
    debugElement.triggerEventHandler('blur', {});

    expect(componentInstance.radioForm?.touched).toEqual(true);
  }));

  it('should update the the form properly when radio button is changed', fakeAsync(function () {
    fixture.detectChanges();

    const radios = getRadios(fixture);
    clickCheckbox(fixture, 1);

    const value = componentInstance.radioForm?.value.radioGroup;

    expect(radios.item(1).checked).toBe(true);
    expect(value.name).toEqual('Sherry Ken');
    expect(componentInstance.radioControl?.value).toEqual(value);
  }));

  it('should update the radio buttons properly when the form is changed', fakeAsync(function () {
    fixture.detectChanges();
    clickCheckbox(fixture, 0);
    expect(componentInstance.radioControl?.value.name).toEqual('Lilly Corr');

    componentInstance.radioForm?.patchValue({
      radioGroup: componentInstance.options[1],
    });
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioControl?.value.name).toEqual('Sherry Ken');
  }));

  it('should not show a required state when not required', fakeAsync(() => {
    componentInstance.headingText = 'Test';
    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    const radioGroupLabel = fixture.nativeElement.querySelector(
      '.sky-radio-group-legend span',
    );
    expect(radioGroupDiv?.getAttribute('required')).toBeNull();
    expect(radioGroupDiv?.getAttribute('aria-required')).toBeNull();
    expect(radioGroupLabel).not.toHaveCssClass('sky-control-label-required');
  }));

  it('should show a required state when required input is set to true', fakeAsync(() => {
    componentInstance.headingText = 'Test';
    componentInstance.required = true;

    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    const radioGroupLabel = fixture.nativeElement.querySelector(
      '.sky-radio-group-legend span',
    );
    expect(radioGroupDiv?.getAttribute('required')).not.toBeNull();
    expect(radioGroupDiv?.getAttribute('aria-required')).toBe('true');
    expect(radioGroupLabel).toHaveCssClass('sky-control-label-required');
  }));

  it('should update the form properly when radio button is required and changed', fakeAsync(() => {
    componentInstance.required = true;
    fixture.detectChanges();

    expect(componentInstance.radioForm?.valid).toBe(false);

    clickCheckbox(fixture, 1);

    expect(componentInstance.radioForm?.valid).toBe(true);
  }));

  it('should use tabIndex when specified', fakeAsync(function () {
    componentInstance.tabIndex = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const radioArray = Array.from(getRadios(fixture));
    for (const element of radioArray) {
      expect(element.getAttribute('tabindex')).toBe('2');
    }
  }));

  it('should maintain tabIndex when options change', fakeAsync(function () {
    componentInstance.tabIndex = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    componentInstance.changeOptions();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const radioArray = Array.from(getRadios(fixture));
    for (const element of radioArray) {
      expect(element.getAttribute('tabindex')).toBe('2');
    }
  }));

  it('should update selected value when options change', fakeAsync(function () {
    fixture.detectChanges();
    clickCheckbox(fixture, 0);
    expect(componentInstance.radioControl?.value.name).toEqual('Lilly Corr');

    componentInstance.changeOptions();

    fixture.detectChanges();
    clickCheckbox(fixture, 1);
    expect(componentInstance.radioControl?.value.name).toEqual('Hank Smith');
  }));

  it('should set the radio name properties correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const radioArray = Array.from(getRadios(fixture));
    for (const element of radioArray) {
      expect(element.getAttribute('name')).toBe('radioGroup');
    }

    componentInstance.groupName = undefined;
    fixture.detectChanges();

    for (const element of radioArray) {
      expect(element.getAttribute('name')).toEqual(
        jasmine.stringMatching(/sky-radio-group-[0-9]+/),
      );
    }
  }));

  it('should set the radio name properties correctly when options change', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    componentInstance.changeOptions();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const radioArray = Array.from(getRadios(fixture));
    for (const element of radioArray) {
      expect(element.getAttribute('name')).toBe('radioGroup');
    }
  }));

  it('should maintain checked state when value is changed', fakeAsync(function () {
    fixture.detectChanges();
    clickCheckbox(fixture, 0);

    let newValue = {
      name: 'Jerry Salmonella',
      disabled: false,
    };

    let radioDebugElement = fixture.debugElement.query(By.css('sky-radio'));
    radioDebugElement.componentInstance.value = newValue;
    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();

    newValue = {
      name: 'Sarah Jo',
      disabled: false,
    };

    radioDebugElement = fixture.debugElement.query(By.css('sky-radio'));
    radioDebugElement.componentInstance.value = newValue;
    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();
  }));

  it('should maintain checked state when options are changed', fakeAsync(function () {
    fixture.detectChanges();

    clickCheckbox(fixture, 0);

    const newValue = {
      name: 'Jerry Salmonella',
      disabled: false,
    };

    const radioDebugElement = fixture.debugElement.query(By.css('sky-radio'));
    radioDebugElement.componentInstance.value = newValue;
    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();

    componentInstance.changeOptions();

    fixture.detectChanges();
    tick();

    expect(radioDebugElement.componentInstance.checked).toBeTruthy();
  }));

  it('should set the aria-labelledby property correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    expect(radioGroupDiv?.getAttribute('aria-labelledby')).toBe(
      'radio-group-label',
    );
  }));

  it('should set the aria-label property correctly', fakeAsync(() => {
    componentInstance.ariaLabel = 'radio-group-label-manual';
    componentInstance.ariaLabelledBy = undefined;

    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    expect(radioGroupDiv?.getAttribute('aria-label')).toBe(
      'radio-group-label-manual',
    );
  }));

  it('should support boolean values', fakeAsync(function () {
    const booleanFixture = TestBed.createComponent(
      SkyRadioGroupBooleanTestComponent,
    );
    const booleanComponent = booleanFixture.componentInstance;

    booleanFixture.detectChanges();
    tick();
    booleanFixture.detectChanges();

    const radios = getRadios(booleanFixture);

    expect(booleanComponent.radioForm.get('booleanValue')?.value).toEqual(
      false,
    );
    expect(radios.item(0).checked).toEqual(true);
    expect(radios.item(1).checked).toEqual(false);

    clickCheckbox(booleanFixture, 1);

    expect(booleanComponent.radioForm.get('booleanValue')?.value).toEqual(true);
    expect(radios.item(0).checked).toEqual(false);
    expect(radios.item(1).checked).toEqual(true);

    clickCheckbox(booleanFixture, 0);

    expect(booleanComponent.radioForm.get('booleanValue')?.value).toEqual(
      false,
    );
    expect(radios.item(0).checked).toEqual(true);
    expect(radios.item(1).checked).toEqual(false);
  }));

  it('should support resetting form control when fields are added dynamically', fakeAsync(function () {
    fixture.detectChanges();

    componentInstance.radioForm?.patchValue({
      radioGroup: componentInstance.options[0],
    });

    fixture.detectChanges();

    const expectedValue = {
      radioGroup: { name: 'Lilly Corr', disabled: false },
    };

    expect(componentInstance.radioForm?.value).toEqual(expectedValue);

    // Toggle the field's generation on and off to make sure the form control's state
    // isn't directly tied to the template's change detection.
    componentInstance.showRadioGroup = false;
    fixture.detectChanges();
    tick();

    componentInstance.showRadioGroup = true;
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.value).toEqual(expectedValue);

    componentInstance.showRadioGroup = false;
    fixture.detectChanges();
    tick();

    componentInstance.radioControl?.reset();
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.value).toEqual({
      radioGroup: null,
    });
  }));

  it('should disable the radio buttons when the form is disabled on init', fakeAsync(function () {
    componentInstance.initialDisabled = true;
    fixture.detectChanges();
    tick();

    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.value).toEqual({ radioGroup: null });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);
    expect(componentInstance.radioForm?.disabled).toEqual(true);
    expect(componentInstance.radioGroupComponent?.disabled).toEqual(true);

    const inputArray = Array.from(getRadios(fixture));
    const labelArray = Array.from(getRadioLabels(fixture));

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).not.toBeNull();
    }
    for (const label of labelArray) {
      expect(label).toHaveCssClass('sky-switch-disabled');
    }

    // Call form control's enable method. Expect form to be enabled.
    componentInstance.radioForm?.get('radioGroup')?.enable();
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.disabled).toEqual(false);
    expect(componentInstance.radioGroupComponent?.disabled).toEqual(false);

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).toBeNull();
    }
    for (const label of labelArray) {
      expect(label).not.toHaveCssClass('sky-switch-disabled');
    }
  }));

  it('should note enable disabled radio buttons when the outer radio group is enabled', fakeAsync(function () {
    componentInstance.initialDisabled = true;
    componentInstance.options[2].disabled = true;
    fixture.detectChanges();
    tick();

    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.value).toEqual({ radioGroup: null });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);
    expect(componentInstance.radioForm?.disabled).toEqual(true);
    expect(componentInstance.radioGroupComponent?.disabled).toEqual(true);

    const inputArray = Array.from(getRadios(fixture));
    const labelArray = Array.from(getRadioLabels(fixture));

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).not.toBeNull();
    }
    for (const label of labelArray) {
      expect(label).toHaveCssClass('sky-switch-disabled');
    }

    // Call form control's enable method. Expect form to be enabled.
    componentInstance.radioForm?.get('radioGroup')?.enable();
    fixture.detectChanges();
    tick();

    expect(componentInstance.radioForm?.disabled).toEqual(false);
    expect(componentInstance.radioGroupComponent?.disabled).toEqual(false);

    for (const input of inputArray) {
      if (input === inputArray[2]) {
        expect(input.getAttribute('disabled')).not.toBeNull();
      } else {
        expect(input.getAttribute('disabled')).toBeNull();
      }
    }
    for (const label of labelArray) {
      if (label === labelArray[2]) {
        expect(label).toHaveCssClass('sky-switch-disabled');
      } else {
        expect(label).not.toHaveCssClass('sky-switch-disabled');
      }
    }
  }));

  it(`should update disabled attribute and disabled class when form control's disable method is called`, fakeAsync(() => {
    fixture.detectChanges();

    const inputArray = Array.from(getRadios(fixture));
    const labelArray = Array.from(getRadioLabels(fixture));

    // Initialize with default settings. Expect form to be enabled.
    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).toBeNull();
    }
    for (const label of labelArray) {
      expect(label).not.toHaveCssClass('sky-switch-disabled');
    }

    // Call form control's disable method. Expect form to be disabled.
    componentInstance.radioForm?.get('radioGroup')?.disable();
    fixture.detectChanges();
    tick();

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).not.toBeNull();
    }
    for (const label of labelArray) {
      expect(label).toHaveCssClass('sky-switch-disabled');
    }

    // Call form control's enable method. Expect form to be enabled.
    componentInstance.radioForm?.get('radioGroup')?.enable();
    fixture.detectChanges();
    tick();

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).toBeNull();
    }
    for (const label of labelArray) {
      expect(label).not.toHaveCssClass('sky-switch-disabled');
    }
  }));

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should set aria-owns as a space-separated list of radio ids', () => {
    fixture.detectChanges();

    const radioGroupEl = getRadioGroup(fixture);

    expect(radioGroupEl?.getAttribute('aria-owns')).toEqual(
      'sky-radio-MOCK_ID_3-input sky-radio-MOCK_ID_5-input sky-radio-MOCK_ID_7-input sky-radio-MOCK_ID_9-input',
    );
  });

  it('should update aria-owns if a child radio modifies its ID', () => {
    fixture.detectChanges();

    const radioGroupEl = getRadioGroup(fixture);

    const originalAriaOwns = radioGroupEl?.getAttribute('aria-owns');
    expect(originalAriaOwns).toEqual(
      'sky-radio-MOCK_ID_3-input sky-radio-MOCK_ID_5-input sky-radio-MOCK_ID_7-input sky-radio-MOCK_ID_9-input',
    );

    // Change an existing ID to something else.
    fixture.componentInstance.options[0].id = 'foobar';
    fixture.detectChanges();

    const newAriaOwns = radioGroupEl?.getAttribute('aria-owns');
    expect(newAriaOwns).toEqual(
      'sky-radio-foobar-input sky-radio-MOCK_ID_5-input sky-radio-MOCK_ID_7-input sky-radio-MOCK_ID_9-input',
    );
  });

  it('should display a heading if `headingText` is set', () => {
    const headingText = 'Heading Text';
    componentInstance.headingText = headingText;

    fixture.detectChanges();

    const headingEl = getRadioGroupLabel(fixture);

    expect(headingEl).toBeVisible();
    expect(headingEl?.textContent?.trim()).toBe(headingText);
  });

  it('should not display `headingText` if `headingHidden` is true', () => {
    const headingText = 'Heading Text';
    componentInstance.headingText = headingText;
    componentInstance.headingHidden = true;

    fixture.detectChanges();

    const labelEl = getRadioGroupLabel(fixture);

    expect(labelEl).not.toBeNull();
    expect(labelEl).toHaveCssClass('sky-screen-reader-only');
  });

  it('should render the correct heading level and styles', () => {
    const headingLevels: (SkyRadioGroupHeadingLevel | undefined)[] = [
      undefined,
      3,
      4,
      5,
    ];
    const headingStyles: (SkyRadioGroupHeadingStyle | undefined)[] = [
      undefined,
      3,
      4,
      5,
    ];
    headingLevels.forEach((headingLevel) => {
      headingStyles.forEach((headingStyle) => {
        componentInstance.headingText = 'Label text';
        componentInstance.headingLevel = headingLevel;
        componentInstance.headingStyle = headingStyle;
        fixture.detectChanges();

        const selector = headingLevel
          ? `h${headingLevel}.sky-font-heading-${headingStyle ?? 4}`
          : `span.sky-font-heading-${headingStyle ?? 4}`;
        const heading = fixture.nativeElement.querySelector(selector);

        expect(heading).toExist();
      });
    });
  });

  it('should use `headingText` as an accessible label over `ariaLabel` and `ariaLabelledBy`', () => {
    const headingText = 'Heading Text';
    componentInstance.headingText = headingText;
    componentInstance.ariaLabel = 'some other label text';

    fixture.detectChanges();

    const labelEl = getRadioGroupLabel(fixture);
    const radioGroup = getRadioGroup(fixture);

    expect(labelEl).not.toBeNull();
    expect(radioGroup?.getAttribute('aria-labelledBy')).toBeNull();
    expect(radioGroup?.getAttribute('aria-label')).toBeNull();
  });

  it('should display the hint text if `hintText` is set', () => {
    const hintText = 'Hint text for the group.';

    fixture.componentInstance.hintText = hintText;
    fixture.detectChanges();

    const hintEl = fixture.nativeElement.querySelector(
      '.sky-radio-group-hint-text',
    );

    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent.trim()).toBe(hintText);
  });

  it('should have the lg margin class if stacked is true and headingLevel is unset', () => {
    fixture.componentInstance.stacked = true;
    fixture.componentInstance.headingLevel = undefined;
    fixture.detectChanges();

    const radioGroup = fixture.nativeElement.querySelector('sky-radio-group');

    expect(radioGroup).toHaveClass('sky-form-field-stacked');
  });

  it('should have the xl margin class if stacked is true and headingLevel is set', () => {
    fixture.componentInstance.stacked = true;
    fixture.componentInstance.headingLevel = 3;
    fixture.detectChanges();

    const radioGroup = fixture.nativeElement.querySelector('sky-radio-group');

    expect(radioGroup).toHaveClass('sky-field-group-stacked');
  });

  it('should not have the lg or xl margin class if stacked is false', () => {
    fixture.detectChanges();
    const radioGroup = fixture.nativeElement.querySelector('sky-radio-group');

    expect(radioGroup).not.toHaveClass('sky-form-field-stacked');
    expect(radioGroup).not.toHaveClass('sky-field-group-stacked');
  });

  it('should log a deprecation warning when ariaLabel and ariaLabelledBy are set', () => {
    const logService = TestBed.inject(SkyLogService);
    const deprecatedLogSpy = spyOn(logService, 'deprecated').and.stub();

    fixture.componentInstance.ariaLabel = 'aria label';
    fixture.detectChanges();

    expect(deprecatedLogSpy).toHaveBeenCalledWith(
      'SkyRadioGroupComponent.ariaLabel',
      Object({
        deprecationMajorVersion: 9,
      }),
    );

    expect(deprecatedLogSpy).toHaveBeenCalledWith(
      'SkyRadioGroupComponent.ariaLabelledBy',
      Object({
        deprecationMajorVersion: 9,
      }),
    );
  });

  it('should render custom form errors', fakeAsync(() => {
    componentInstance.headingText = 'Label Text';

    fixture.detectChanges();

    clickCheckbox(fixture, 3);

    expect(
      fixture.nativeElement.querySelector('.sky-form-error'),
    ).toBeVisible();
    expect(
      fixture.nativeElement.querySelector('.sky-status-indicator-message')
        .textContent,
    ).toEqual('This option is incorrect.');
  }));

  it('should render help inline if label text and help popover content is provided', () => {
    componentInstance.headingText = 'Label Text';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should render help inline if heading text and help key is provided ', () => {
    componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(
        '.sky-help-inline:not(.sky-control-help)',
      ),
    ).toBeFalsy();

    componentInstance.headingText = 'Heading text';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(
        '.sky-help-inline:not(.sky-control-help)',
      ),
    ).toBeTruthy();
  });

  it('should set global help config with help key', async () => {
    const helpController = TestBed.inject(SkyHelpTestingController);
    componentInstance.headingText = 'Heading text';
    componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    const helpInlineButton = fixture.nativeElement.querySelector(
      '.sky-help-inline',
    ) as HTMLElement | undefined;
    await helpInlineButton?.click();

    fixture.detectChanges();
    await fixture.whenStable();

    helpController.expectCurrentHelpKey('helpKey.html');
  });
});

describe('Radio group component (template-driven)', () => {
  let fixture: ComponentFixture<SkyRadioGroupFixtureComponent>;
  let componentInstance: SkyRadioGroupFixtureComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SkyRadioFixturesModule],
    });

    fixture = TestBed.createComponent(SkyRadioGroupFixtureComponent);
    fixture.detectChanges();
    tick();
    componentInstance = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it(`should update disabled attribute and disabled class when disabled input is changed`, fakeAsync(() => {
    const inputArray = Array.from(getRadios(fixture));
    const labelArray = Array.from(getRadioLabels(fixture));

    // Initialize with default settings. Expect form to be enabled.
    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).toBeNull();
    }
    for (const label of labelArray) {
      expect(label).not.toHaveCssClass('sky-switch-disabled');
    }

    // Call form control's disable method. Expect form to be disabled.
    componentInstance.disableRadioGroup = true;
    fixture.detectChanges();
    tick();

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).not.toBeNull();
    }
    for (const label of labelArray) {
      expect(label).toHaveCssClass('sky-switch-disabled');
    }

    // Call form control's enable method. Expect form to be enabled.
    componentInstance.disableRadioGroup = false;
    fixture.detectChanges();
    tick();

    for (const input of inputArray) {
      expect(input.getAttribute('disabled')).toBeNull();
    }
    for (const label of labelArray) {
      expect(label).not.toHaveCssClass('sky-switch-disabled');
    }
  }));
});
