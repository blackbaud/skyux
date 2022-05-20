import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { ThemeSelectorValue } from './theme-selector-value';
import { SkyE2eThemeSelectorComponent } from './theme-selector.component';
import { SkyE2eThemeSelectorModule } from './theme-selector.module';

describe('ThemeSelectorComponent', () => {
  let component: SkyE2eThemeSelectorComponent;
  let fixture: ComponentFixture<SkyE2eThemeSelectorComponent>;
  let mockThemeSvc: jasmine.SpyObj<SkyThemeService>;

  function selectAndValidate(
    theme: 'default' | 'modern',
    mode: 'light' | 'dark' | undefined,
    expectedThemeSettings: SkyThemeSettings | undefined
  ): void {
    mockThemeSvc.setTheme.calls.reset();

    const el = fixture.nativeElement as HTMLElement;

    const selectEl = el.querySelector(
      '.sky-e2e-theme-selector'
    ) as HTMLSelectElement;

    selectEl.value = theme + (mode ? `-${mode}` : '');
    selectEl.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    if (expectedThemeSettings) {
      expect(mockThemeSvc.setTheme).toHaveBeenCalledWith(expectedThemeSettings);
    } else {
      expect(mockThemeSvc.setTheme).not.toHaveBeenCalled();
    }
  }

  function setThemeAndValidate(
    themeSettings: SkyThemeSettings,
    expectedThemeName: ThemeSelectorValue
  ): void {
    (
      mockThemeSvc.settingsChange as BehaviorSubject<SkyThemeSettingsChange>
    ).next({
      currentSettings: themeSettings,
      previousSettings: undefined,
    });

    fixture.detectChanges();

    expect(component.themeName).toBe(expectedThemeName);
  }

  beforeEach(async () => {
    mockThemeSvc = jasmine.createSpyObj(
      'mockThemeSvc',
      ['destroy', 'init', 'setTheme'],
      {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
          ),
          previousSettings: undefined,
        }),
      }
    );

    await TestBed.configureTestingModule({
      imports: [SkyE2eThemeSelectorModule],
      providers: [
        {
          provide: SkyThemeService,
          useFactory: () => mockThemeSvc,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyE2eThemeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the theme service when a theme is selected', () => {
    // Default is already selected, so setting the value shouldn't update the theme service.
    selectAndValidate('default', undefined, undefined);

    selectAndValidate(
      'modern',
      'light',
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.light)
    );
    selectAndValidate(
      'modern',
      'dark',
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.dark)
    );

    // Modern dark was selected in the last update, so it shouldn't update the theme service again.
    selectAndValidate('modern', 'dark', undefined);

    selectAndValidate(
      'default',
      undefined,
      new SkyThemeSettings(SkyTheme.presets.default, SkyThemeMode.presets.light)
    );
  });

  it('should update select element when the theme service is updated', () => {
    setThemeAndValidate(
      new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light
      ),
      'default'
    );

    setThemeAndValidate(
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.light),
      'modern-light'
    );

    setThemeAndValidate(
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.dark),
      'modern-dark'
    );
  });
});
