import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService } from '@skyux/core';

import { SkyRadioFixturesModule } from './fixtures/radio-fixtures.module';
import { SkyRadioGroupBooleanTestComponent } from './fixtures/radio-group-boolean.component.fixture';
import { SkyRadioGroupReactiveFixtureComponent } from './fixtures/radio-group-reactive.component.fixture';
import { SkyRadioGroupFixtureComponent } from './fixtures/radio-group.component.fixture';

//#region helpers
function getRadios(
  radioFixture: ComponentFixture<any>
): NodeListOf<HTMLInputElement> {
  return radioFixture.nativeElement.querySelectorAll('.sky-radio-input');
}

function getRadioGroup(radioFixture: ComponentFixture<any>): HTMLElement {
  return radioFixture.nativeElement.querySelector('.sky-radio-group');
}

function getRadioLabels(
  fixture: ComponentFixture<any>
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
      imports: [SkyRadioFixturesModule],
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
      /* spell-checker:disable-next-line */
      radioGroup: { name: 'Lillith Corharvest', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(true);
    expect(componentInstance.radioForm?.pristine).toEqual(false);
    expect(componentInstance.radioForm?.dirty).toEqual(true);
  }));

  it('should update the form properly when form is initialized with values', fakeAsync(function () {
    componentInstance.initialValue = componentInstance.options[0];

    fixture.detectChanges();

    expect(componentInstance.radioForm?.value).toEqual({
      /* spell-checker:disable-next-line */
      radioGroup: { name: 'Lillith Corharvest', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);

    clickCheckbox(fixture, 1);

    expect(componentInstance.radioForm?.value).toEqual({
      /* spell-checker:disable-next-line */
      radioGroup: { name: 'Harima Kenji', disabled: false },
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
      /* spell-checker:disable-next-line */
      radioGroup: { name: 'Lillith Corharvest', disabled: false },
    });
    expect(componentInstance.radioForm?.touched).toEqual(false);
    expect(componentInstance.radioForm?.pristine).toEqual(true);
    expect(componentInstance.radioForm?.dirty).toEqual(false);

    clickCheckbox(fixture, 1);

    expect(componentInstance.radioForm?.value).toEqual({
      /* spell-checker:disable-next-line */
      radioGroup: { name: 'Harima Kenji', disabled: false },
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
      By.css('input[type="radio"]')
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
    /* spell-checker:disable-next-line */
    expect(value.name).toEqual('Harima Kenji');
    expect(componentInstance.radioControl?.value).toEqual(value);
  }));

  it('should update the radio buttons properly when the form is changed', fakeAsync(function () {
    fixture.detectChanges();
    clickCheckbox(fixture, 0);
    expect(componentInstance.radioControl?.value.name).toEqual(
      /* spell-checker:disable-next-line */
      'Lillith Corharvest'
    );

    componentInstance.radioForm?.patchValue({
      radioGroup: componentInstance.options[1],
    });
    fixture.detectChanges();
    tick();

    /* spell-checker:disable-next-line */
    expect(componentInstance.radioControl?.value.name).toEqual('Harima Kenji');
  }));

  it('should not show a required state when not required', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    expect(radioGroupDiv.getAttribute('required')).toBeNull();
    expect(radioGroupDiv.getAttribute('aria-required')).toBeNull();
  }));

  it('should show a required state when required input is set to true', fakeAsync(() => {
    componentInstance.required = true;

    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    expect(radioGroupDiv.getAttribute('required')).not.toBeNull();
    expect(radioGroupDiv.getAttribute('aria-required')).toBe('true');
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
    expect(componentInstance.radioControl?.value.name).toEqual(
      /* spell-checker:disable-next-line */
      'Lillith Corharvest'
    );

    componentInstance.changeOptions();

    fixture.detectChanges();
    clickCheckbox(fixture, 1);
    /* spell-checker:disable-next-line */
    expect(componentInstance.radioControl?.value.name).toEqual('Hank Salizar');
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
        jasmine.stringMatching(/sky-radio-group-[0-9]+/)
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
      /* spell-checker:disable-next-line */
      name: 'Sarah Jellyman',
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
    expect(radioGroupDiv.getAttribute('aria-labelledby')).toBe(
      'radio-group-label'
    );
  }));

  it('should set the aria-label property correctly', fakeAsync(() => {
    componentInstance.ariaLabel = 'radio-group-label-manual';
    componentInstance.ariaLabelledBy = undefined;

    fixture.detectChanges();
    tick();

    const radioGroupDiv = getRadioGroup(fixture);
    expect(radioGroupDiv.getAttribute('aria-label')).toBe(
      'radio-group-label-manual'
    );
  }));

  it('should support boolean values', fakeAsync(function () {
    const booleanFixture = TestBed.createComponent(
      SkyRadioGroupBooleanTestComponent
    );
    const booleanComponent = booleanFixture.componentInstance;

    booleanFixture.detectChanges();
    tick();
    booleanFixture.detectChanges();

    const radios = getRadios(booleanFixture);

    expect(booleanComponent.radioForm.get('booleanValue')?.value).toEqual(
      false
    );
    expect(radios.item(0).checked).toEqual(true);
    expect(radios.item(1).checked).toEqual(false);

    clickCheckbox(booleanFixture, 1);

    expect(booleanComponent.radioForm.get('booleanValue')?.value).toEqual(true);
    expect(radios.item(0).checked).toEqual(false);
    expect(radios.item(1).checked).toEqual(true);

    clickCheckbox(booleanFixture, 0);

    expect(booleanComponent.radioForm.get('booleanValue')?.value).toEqual(
      false
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
      /* spell-checker:disable-next-line */
      radioGroup: { name: 'Lillith Corharvest', disabled: false },
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

    const radioGroupEl: HTMLDivElement =
      fixture.nativeElement.querySelector('.sky-radio-group');

    expect(radioGroupEl.getAttribute('aria-owns')).toEqual(
      'sky-radio-MOCK_ID_1-input sky-radio-MOCK_ID_2-input sky-radio-MOCK_ID_3-input'
    );
  });

  it('should update aria-owns if a child radio modifies its ID', () => {
    fixture.detectChanges();

    const radioGroupEl: HTMLDivElement =
      fixture.nativeElement.querySelector('.sky-radio-group');

    const originalAriaOwns = radioGroupEl.getAttribute('aria-owns');
    expect(originalAriaOwns).toEqual(
      'sky-radio-MOCK_ID_1-input sky-radio-MOCK_ID_2-input sky-radio-MOCK_ID_3-input'
    );

    // Change an existing ID to something else.
    fixture.componentInstance.options[0].id = 'foobar';
    fixture.detectChanges();

    const newAriaOwns = radioGroupEl.getAttribute('aria-owns');
    expect(newAriaOwns).toEqual(
      'sky-radio-foobar-input sky-radio-MOCK_ID_2-input sky-radio-MOCK_ID_3-input'
    );
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
