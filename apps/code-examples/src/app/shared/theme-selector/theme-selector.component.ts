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
  themeBrand?: SkyThemeBrand;
}

const AVAILABLE_BRANDS = [
  { readableName: 'Rainbow', brand: new SkyThemeBrand('rainbow', '1.0.1') },
  { readableName: 'JustGiving', brand: new SkyThemeBrand('jg', '4') },
];
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

  protected readonly themeBrand = signal<SkyThemeBrand | undefined>(undefined);
  protected readonly themeName = signal<ThemeSelectorValue>('default');
  protected readonly themeMode = signal<ThemeSelectorModeValue>('light');
  protected readonly themeSpacing =
    signal<ThemeSelectorSpacingValue>('standard');

  protected readonly brandingValues = computed(() =>
    this.#currentTheme().name === 'default' ? [] : AVAILABLE_BRANDS,
  );

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
        this.themeBrand(),
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
        this.themeBrand.set(
          this.brandingValues().find(
            (brandInfo) =>
              brandInfo.brand.name === previousSettings.themeBrand?.name,
          )?.brand ?? undefined,
        );
      } catch {
        // Bad settings.
      }
    }
  }

  #updateThemeSettings(
    themeName: ThemeSelectorValue,
    themeModeName: ThemeSelectorModeValue,
    themeSpacingName: ThemeSelectorSpacingValue,
    themeBrand?: SkyThemeBrand,
  ): void {
    const themeSpacing = SkyThemeSpacing.presets[themeSpacingName];
    const themeMode = SkyThemeMode.presets[themeModeName];

    let theme: SkyTheme;

    if (themeName === 'modern') {
      theme = SkyTheme.presets.modern;
    } else {
      theme = SkyTheme.presets.default;
    }

    this.#themeSvc.setTheme(
      new SkyThemeSettings(
        theme,
        themeMode,
        themeSpacing,
        themeName !== 'default' ? themeBrand : undefined,
      ),
    );

    this.#saveSettings({
      themeName: themeName,
      themeMode: themeModeName,
      themeSpacing: themeSpacingName,
      themeBrand: themeBrand,
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
