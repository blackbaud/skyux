import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyIdModule
} from '@skyux/core';

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
  SkyInputBoxModule
} from './input-box.module';

import {
  InputBoxHostServiceFixtureComponent
} from './fixtures/input-box-host-service.component.fixture';

import {
  InputBoxFixtureComponent
} from './fixtures/input-box.component.fixture';

describe('Input box component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>
  };

  function getInputBoxEl(
    fixture: ComponentFixture<SkyInputBoxModule>,
    parentCls: string
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector(`.${parentCls} sky-input-box`);
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
    fixture: ComponentFixture<InputBoxFixtureComponent>,
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
      declarations: [
        InputBoxHostServiceFixtureComponent,
        InputBoxFixtureComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyIdModule,
        SkyInputBoxModule
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

    const inputBoxEl = getInputBoxEl(fixture, 'input-basic');

    const formGroupEl = inputBoxEl.querySelector('.sky-form-group');

    const labelEl = formGroupEl.children.item(0) as HTMLLabelElement;
    const inputGroupEl = formGroupEl.children.item(1);
    const inputEl = inputGroupEl.children.item(0);

    expect(labelEl).toExist();
    expect(labelEl.htmlFor).toBe(inputEl.id);

    expect(inputGroupEl).toExist();

    expect(inputEl).toExist();
    expect(inputEl.tagName).toBe('INPUT');
  });

  it('should render the input group button elements in the expected locations', () => {
    const fixture = TestBed.createComponent(InputBoxFixtureComponent);

    fixture.detectChanges();

    const inputBoxEl = getInputBoxEl(fixture, 'input-multiple-buttons');

    const inputGroupEl = inputBoxEl.querySelector('.sky-form-group > .sky-input-group');
    const inputEl = inputGroupEl.children.item(0);
    const inputGroupBtnEl1 = inputGroupEl.children.item(1);
    const inputGroupBtnEl2 = inputGroupEl.children.item(2);

    expect(inputEl).toExist();
    expect(inputEl.tagName).toBe('INPUT');

    expect(inputGroupBtnEl1.children.item(0)).toHaveCssClass('test-button-1');
    expect(inputGroupBtnEl2.children.item(0)).toHaveCssClass('test-button-2');
  });

  it('should allow a child to place template items inside the input box programmatically', () => {
    const fixture = TestBed.createComponent(InputBoxFixtureComponent);

    fixture.detectChanges();

    const inputBoxEl = getInputBoxEl(fixture, 'input-host-service');

    const inputGroupEl = inputBoxEl.querySelector('.sky-form-group > .sky-input-group');
    const inputEl = inputGroupEl.children.item(0);
    const inputGroupBtnEl1 = inputGroupEl.children.item(1);
    const inputGroupBtnEl2 = inputGroupEl.children.item(2);

    expect(inputEl).toExist();
    expect(inputEl.tagName).toBe('INPUT');

    expect(inputGroupBtnEl1.children.item(0)).toHaveCssClass('host-service-button-1');
    expect(inputGroupBtnEl2.children.item(0)).toHaveCssClass('host-service-button-2');
  });

  it('should pass accessibility', async(() => {
    const fixture = TestBed.createComponent(InputBoxFixtureComponent);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('in modern theme', () => {

    beforeEach(() => {
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

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');

      const formGroupEl = inputBoxEl.querySelector(
        '.sky-input-box-group > .sky-input-box-group-form-control > .sky-form-group'
      );

      expect(formGroupEl).toExist();

      const labelEl = formGroupEl.children.item(0) as HTMLLabelElement;
      const inputEl = formGroupEl.children.item(1);

      expect(labelEl).toExist();
      expect(labelEl.htmlFor).toBe(inputEl.id);

      expect(inputEl).toExist();
      expect(inputEl.tagName).toBe('INPUT');
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-multiple-buttons');

      const inputBoxGroupEl = inputBoxEl.querySelector('.sky-input-box-group');
      const inputEl = inputBoxGroupEl.children.item(0);
      const inputGroupBtnEl1 = inputBoxGroupEl.children.item(1);
      const inputGroupBtnEl2 = inputBoxGroupEl.children.item(2);

      expect(inputEl).toHaveCssClass('sky-input-box-group-form-control');
      expect(inputGroupBtnEl1.children.item(0)).toHaveCssClass('test-button-1');
      expect(inputGroupBtnEl2.children.item(0)).toHaveCssClass('test-button-2');
    });

    it('should set add a CSS class to the form control wrapper on focus in', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-basic');
      const inputBoxFormControlEl = inputBoxEl.querySelector('.sky-input-box-group-form-control');

      const focusCls = 'sky-input-box-group-form-control-focus';

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);

      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusin');
      fixture.detectChanges();

      expect(inputBoxFormControlEl).toHaveCssClass(focusCls);

      SkyAppTestUtility.fireDomEvent(inputBoxFormControlEl, 'focusout');
      fixture.detectChanges();

      expect(inputBoxFormControlEl).not.toHaveCssClass(focusCls);
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
