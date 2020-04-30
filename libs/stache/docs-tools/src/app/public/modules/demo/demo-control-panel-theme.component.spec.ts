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
  SkyTheme,
  SkyThemeMode,
  SkyThemeSettings
} from '@skyux/theme';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDocsDemoModule
} from './demo.module';

import {
  SkyDocsDemoControlPanelThemeComponent
} from './demo-control-panel-theme.component';

describe('Demo control panel theme', () => {

  function getRadioEls(
    fixture: ComponentFixture<SkyDocsDemoControlPanelThemeComponent>,
    name: string
  ): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(`sky-radio-group[name="${name}"] sky-radio`));
  }

  function getRadioLabelEl(radioEl: DebugElement): DebugElement {
    return radioEl.query(By.css('.sky-switch-label'));
  }

  function getRadioInputEl(radioEl: DebugElement): DebugElement {
    return radioEl.query(By.css('input[type="radio"]'));
  }

  function validateRadioItem(
    radioEl: DebugElement,
    expectedLabel: string,
    expectedValue: string
  ): void {
    const labelEl = getRadioLabelEl(radioEl);
    const inputEl = getRadioInputEl(radioEl);

    expect(labelEl.nativeElement).toHaveText(expectedLabel);
    expect(inputEl.nativeElement.value).toBe(expectedValue);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyDocsDemoModule
      ]
    });
  });

  it('should render the expected radio buttons', () => {
    const fixture = TestBed.createComponent(SkyDocsDemoControlPanelThemeComponent);

    fixture.detectChanges();

    const themeRadioEls = getRadioEls(fixture, 'theme');

    validateRadioItem(
      themeRadioEls[0],
      'Default',
      'default'
    );

    validateRadioItem(
      themeRadioEls[1],
      'Modern',
      'modern'
    );

    const modeRadioEls = getRadioEls(fixture, 'mode');

    expect(modeRadioEls.length).toBe(1);

    validateRadioItem(
      modeRadioEls[0],
      'Light',
      'light'
    );
  });

  it('should update the mode options based on the selected theme\'s supported modes', () => {
    const fixture = TestBed.createComponent(SkyDocsDemoControlPanelThemeComponent);

    fixture.detectChanges();

    const themeRadioEls = getRadioEls(fixture, 'theme');

    getRadioInputEl(themeRadioEls[1]).nativeElement.click();

    fixture.detectChanges();

    const modeRadioEls = getRadioEls(fixture, 'mode');

    expect(modeRadioEls.length).toBe(2);

    validateRadioItem(
      modeRadioEls[0],
      'Light',
      'light'
    );

    validateRadioItem(
      modeRadioEls[1],
      'Dark',
      'dark'
    );
  });

  it('should fire the settings change event when a theme or mode is selected', () => {
    const fixture = TestBed.createComponent(SkyDocsDemoControlPanelThemeComponent);

    const themeSettingsChangeEmitSpy = spyOn(fixture.componentInstance.themeSettingsChange, 'emit').and.callThrough();

    fixture.detectChanges();

    const themeRadioEls = getRadioEls(fixture, 'theme');

    getRadioInputEl(themeRadioEls[1]).nativeElement.click();

    fixture.detectChanges();

    expect(themeSettingsChangeEmitSpy).toHaveBeenCalledWith(
      new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light
      )
    );

    const modeRadioEls = getRadioEls(fixture, 'mode');

    getRadioInputEl(modeRadioEls[1]).nativeElement.click();

    expect(themeSettingsChangeEmitSpy).toHaveBeenCalledWith(
      new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.dark
      )
    );
  });
});
