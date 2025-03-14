import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import {
  SkyTheme,
  SkyThemeBrand,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSpacing,
} from '@skyux/theme';

import { ThemeSelectorModeValue } from './theme-selector-mode-value';
import { ThemeSelectorSpacingValue } from './theme-selector-spacing-value';
import { ThemeSelectorValue } from './theme-selector-value';

interface LocalStorageSettings {
  themeName: ThemeSelectorValue;
  themeMode: ThemeSelectorModeValue;
  themeSpacing: ThemeSelectorSpacingValue;
  modernV2Enabled: boolean | undefined;
}

const PREVIOUS_SETTINGS_KEY =
  'skyux-playground-theme-mode-spacing-selector-settings';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sky-theme-selector',
  imports: [FormsModule, SkyCheckboxModule, SkyIdModule, SkyInputBoxModule],
  templateUrl: './theme-selector.component.html',
})
export class SkyThemeSelectorComponent implements OnInit {
  #themeSvc = inject(SkyThemeService);

  #currentTheme = computed(
    () => SkyTheme.presets[this.themeName() as ThemeSelectorValue],
  );

  protected readonly themeName = signal<ThemeSelectorValue>('default');
  protected readonly themeMode = signal<ThemeSelectorModeValue>('light');
  protected readonly themeSpacing =
    signal<ThemeSelectorSpacingValue>('standard');
  protected readonly modernV2Enabled = signal(false);

  protected readonly spacingValues = computed(() =>
    this.#currentTheme().supportedSpacing.map((spacing) => spacing.name),
  );

  protected readonly modeValues = computed(() =>
    this.#currentTheme().supportedModes.map((mode) => mode.name),
  );

  constructor() {
    effect(() => {
      this.#updateThemeSettings(
        this.themeName(),
        this.themeMode(),
        this.themeSpacing(),
        this.modernV2Enabled(),
      );
    });
  }

  public ngOnInit(): void {
    const previousSettings = this.#getLastSettings();

    if (previousSettings) {
      try {
        this.themeName.set(previousSettings.themeName);
        this.themeMode.set(previousSettings.themeMode);
        this.themeSpacing.set(previousSettings.themeSpacing);
        this.modernV2Enabled.set(!!previousSettings.modernV2Enabled);
      } catch {
        // Bad settings.
      }
    }
  }

  #updateThemeSettings(
    themeName: ThemeSelectorValue,
    themeModeName: ThemeSelectorModeValue,
    themeSpacingName: ThemeSelectorSpacingValue,
    modernV2Enabled: boolean,
  ): void {
    const themeSpacing = SkyThemeSpacing.presets[themeSpacingName];
    const themeMode = SkyThemeMode.presets[themeModeName];
    const themeBrand = modernV2Enabled
      ? new SkyThemeBrand('blackbaud')
      : undefined;

    let theme: SkyTheme;

    if (themeName === 'modern') {
      theme = SkyTheme.presets.modern;
    } else {
      theme = SkyTheme.presets.default;
    }

    this.#themeSvc.setTheme(
      new SkyThemeSettings(theme, themeMode, themeSpacing, themeBrand),
    );

    this.#saveSettings({
      themeName: themeName,
      themeMode: themeModeName,
      themeSpacing: themeSpacingName,
      modernV2Enabled: modernV2Enabled,
    });
  }

  #getLastSettings(): LocalStorageSettings | undefined {
    try {
      return JSON.parse(localStorage.getItem(PREVIOUS_SETTINGS_KEY) ?? '');
    } catch {
      // Local storage is disabled or settings are invalid.
      return undefined;
    }
  }

  #saveSettings(settings: LocalStorageSettings): void {
    try {
      localStorage.setItem(PREVIOUS_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Local storage is disabled.
    }
  }
}
