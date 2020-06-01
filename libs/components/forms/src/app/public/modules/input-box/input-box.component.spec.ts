import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeSettingsChange,
  SkyThemeSettings,
  SkyThemeService
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

    expect(labelEl).toExist();
    expect(labelEl.htmlFor).toBe('input1');

    const inputGroupEl = formGroupEl.children.item(1);

    expect(inputGroupEl).toExist();

    const inputEl = inputGroupEl.children.item(0);

    expect(inputEl).toExist();
    expect(inputEl.id).toBe('input1');
  });

  it('should render the input group button elements in the expected locations', () => {
    const fixture = TestBed.createComponent(InputBoxFixtureComponent);

    fixture.detectChanges();

    const inputBoxEl = getInputBoxEl(fixture, 'input-multiple-buttons');

    const inputGroupEl = inputBoxEl.querySelector('.sky-form-group > .sky-input-group');
    const inputEl = inputGroupEl.children.item(0);

    expect(inputEl).toExist();
    expect(inputEl.id).toBe('input2');

    expect(inputGroupEl.children.item(1)).toHaveCssClass('test-button-1');
    expect(inputGroupEl.children.item(2)).toHaveCssClass('test-button-2');
  });

  it('should allow a child to place template items inside the input box programmatically', () => {
    const fixture = TestBed.createComponent(InputBoxFixtureComponent);

    fixture.detectChanges();

    const inputBoxEl = getInputBoxEl(fixture, 'input-host-service');

    const inputGroupEl = inputBoxEl.querySelector('.sky-form-group > .sky-input-group');
    const inputEl = inputGroupEl.children.item(0);

    expect(inputEl).toExist();
    expect(inputEl.id).toBe('input3');

    expect(inputGroupEl.children.item(1)).toHaveCssClass('host-service-button-1');
    expect(inputGroupEl.children.item(2)).toHaveCssClass('host-service-button-2');
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

      expect(labelEl).toExist();
      expect(labelEl.htmlFor).toBe('input1');

      const inputEl = formGroupEl.children.item(1);

      expect(inputEl).toExist();
      expect(inputEl.id).toBe('input1');
    });

    it('should render the input group button elements in the expected locations', () => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      const inputBoxEl = getInputBoxEl(fixture, 'input-multiple-buttons');

      const inputBoxGroupEl = inputBoxEl.querySelector('.sky-input-box-group');

      expect(inputBoxGroupEl.children.item(0)).toHaveCssClass('sky-input-box-group-form-control');
      expect(inputBoxGroupEl.children.item(1)).toHaveCssClass('test-button-1');
      expect(inputBoxGroupEl.children.item(2)).toHaveCssClass('test-button-2');
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

    it('should pass accessibility', async(() => {
      const fixture = TestBed.createComponent(InputBoxFixtureComponent);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

  });

});
