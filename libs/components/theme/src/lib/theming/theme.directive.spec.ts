import { DebugElement, Renderer2, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import { SkyThemeModule } from '../theme.module';

import { SkyThemeTestComponent } from './fixtures/theme-test.component';
import { SkyTheme } from './theme';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeDirective } from './theme.directive';
import { SkyThemeService } from './theme.service';

describe('Theme directive', () => {
  function getSkyThemeDebugEl(
    fixture: ComponentFixture<SkyThemeTestComponent>
  ): DebugElement {
    return fixture.debugElement.query(By.directive(SkyThemeDirective));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyThemeTestComponent],
      imports: [SkyThemeModule],
      providers: [SkyThemeService],
    });
  });

  it('should initialize the theme service with default settings', () => {
    const fixture = TestBed.createComponent(SkyThemeTestComponent);

    const skyThemeDebugEl = getSkyThemeDebugEl(fixture);

    const renderer = skyThemeDebugEl.injector.get<Renderer2>(
      Renderer2 as Type<Renderer2>
    );
    const themeSvc = skyThemeDebugEl.injector.get(SkyThemeService);

    const initSpy = spyOn(themeSvc, 'init');

    fixture.detectChanges();

    expect(initSpy).toHaveBeenCalledWith(
      skyThemeDebugEl.nativeElement,
      renderer,
      new SkyThemeSettings(SkyTheme.presets.default, SkyThemeMode.presets.light)
    );
  });

  it('should not set the theme from the input before the component has been initialized', () => {
    const fixture = TestBed.createComponent(SkyThemeTestComponent);

    const skyThemeDebugEl = getSkyThemeDebugEl(fixture);

    const renderer = skyThemeDebugEl.injector.get<Renderer2>(
      Renderer2 as Type<Renderer2>
    );
    const themeSvc = skyThemeDebugEl.injector.get(SkyThemeService);

    const initSpy = spyOn(themeSvc, 'init');
    const setThemeSpy = spyOn(themeSvc, 'setTheme');

    const settings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.dark
    );

    fixture.componentInstance.themeSettings = settings;

    expect(initSpy).not.toHaveBeenCalled();
    expect(setThemeSpy).not.toHaveBeenCalled();

    fixture.detectChanges();

    expect(initSpy).toHaveBeenCalledWith(
      skyThemeDebugEl.nativeElement,
      renderer,
      settings
    );
  });

  it('should update the theme service when the settings input changes', () => {
    const fixture = TestBed.createComponent(SkyThemeTestComponent);

    const skyThemeDebugEl = getSkyThemeDebugEl(fixture);

    const themeSvc = skyThemeDebugEl.injector.get(SkyThemeService);

    const setThemeSpy = spyOn(themeSvc, 'setTheme');

    fixture.detectChanges();

    const newSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.dark
    );

    fixture.componentInstance.themeSettings = newSettings;

    fixture.detectChanges();

    expect(setThemeSpy).toHaveBeenCalledWith(newSettings);
  });

  it('should destroy the theme service when the directive is destroyed', () => {
    const fixture = TestBed.createComponent(SkyThemeTestComponent);

    const skyThemeDebugEl = getSkyThemeDebugEl(fixture);

    const themeSvc = skyThemeDebugEl.injector.get(SkyThemeService);

    const destroySpy = spyOn(themeSvc, 'destroy').and.callThrough();

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });
});
