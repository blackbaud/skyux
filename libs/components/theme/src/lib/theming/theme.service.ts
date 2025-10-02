import { Injectable, Renderer2, inject } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeBrandService } from './theme-brand.service';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSettingsChange } from './theme-settings-change';
import { SkyThemeSpacing } from './theme-spacing';

function assertCurrentSettings(
  currentSettings: SkyThemeSettings | undefined,
): asserts currentSettings is SkyThemeSettings {
  if (!currentSettings) {
    throw new Error('Theme service is not initialized. Call init() first.');
  }
}

/**
 * Provides methods for updating and handling changes to the current theme.
 */
@Injectable()
export class SkyThemeService {
  #brandSvc = inject(SkyThemeBrandService);

  /**
   * Notifies consumers when the current theme settings have changed.
   */
  public get settingsChange(): Observable<SkyThemeSettingsChange> {
    return this.#_settingsObs;
  }

  #current: SkyThemeSettings | undefined;

  #hostEl: any | undefined;

  #renderer: Renderer2 | undefined;

  #settings: ReplaySubject<SkyThemeSettingsChange>;

  #_settingsObs: Observable<SkyThemeSettingsChange>;

  constructor() {
    this.#settings = new ReplaySubject<SkyThemeSettingsChange>(1);
    this.#_settingsObs = this.#settings.asObservable();
  }

  /**
   * Initializes the theme service with the specified parameters. This should only be called
   * from a host component that provides its own theme to child components.
   * @param hostEl The host element under which themed components are rendered.
   * @param renderer A Renderer2 instance for updating the host element with theme changes.
   * @param theme The initial theme.
   * @param registeredBrands An initial set of brands to register. Additional brands can
   * be registered later via the registerBrand() method.
   */
  public init(
    hostEl: any,
    renderer: Renderer2,
    theme: SkyThemeSettings,
    registeredBrands?: SkyThemeBrand[],
  ): void {
    this.#hostEl = hostEl;
    this.#renderer = renderer;

    if (registeredBrands) {
      for (const brand of registeredBrands) {
        this.#brandSvc.registerBrand(brand);
      }
    }

    this.setTheme(theme);
  }

  /**
   * Destroys the current theme service. This should only be called from a host component that
   * provides its own theme to child components.
   */
  public destroy(): void {
    this.#settings.complete();
    this.#brandSvc.destroy();

    this.#hostEl = this.#renderer = undefined;
  }

  /**
   * Updates the current theme mode.
   * @param mode The new theme mode to apply.
   */
  public setThemeMode(mode: SkyThemeMode): void {
    this.#updateThemeProperty('mode', mode);
  }

  /**
   * Updates the current theme spacing.
   * @param spacing The new theme spacing to apply.
   */
  public setThemeSpacing(spacing: SkyThemeSpacing): void {
    this.#updateThemeProperty('spacing', spacing);
  }

  /**
   * Updates the current theme brand.
   * @param brand The new theme brand to apply, or undefined to clear the current brand.
   */
  public setThemeBrand(brand: SkyThemeBrand | undefined): void {
    this.#updateThemeProperty('brand', brand);
  }

  /**
   * Updates the current theme settings.
   * @param settings The new theme settings to apply.
   */
  public setTheme(settings: SkyThemeSettings): void;

  /**
   * Updates the current theme.
   * @param theme The new theme to apply.
   */
  public setTheme(theme: SkyTheme): void;

  public setTheme(settingsOrTheme: SkyThemeSettings | SkyTheme): void {
    let settings: SkyThemeSettings;

    if (settingsOrTheme instanceof SkyThemeSettings) {
      settings = settingsOrTheme;
    } else {
      const current = this.#current;

      assertCurrentSettings(current);

      settings = new SkyThemeSettings(
        settingsOrTheme,
        current.mode,
        current.spacing,
        settingsOrTheme.supportsBranding ? current.brand : undefined,
      );
    }

    const previous = this.#current;

    this.#applyThemeClass(previous, settings, 'theme');
    this.#applyThemeClass(previous, settings, 'mode', 'supportedModes');
    this.#applyThemeClass(previous, settings, 'spacing', 'supportedSpacing');

    if (this.#hostEl) {
      this.#updateBrand(settings, previous);
    }

    this.#settings.next({
      currentSettings: settings,
      previousSettings: previous,
    });

    this.#current = settings;
  }

  public registerBrand(brand: SkyThemeBrand): void {
    this.#brandSvc.registerBrand(brand);
  }

  public unregisterBrand(name: string): void {
    this.#brandSvc.unregisterBrand(name);
  }

  #updateBrand(
    settings: SkyThemeSettings,
    previous: SkyThemeSettings | undefined,
  ): void {
    // Validate branding support
    if (settings.brand && !settings.theme.supportsBranding) {
      throw new Error('Branding is not supported for the given theme.');
    }

    // Determine the current brand to apply
    const currentBrand = this.#getEffectiveBrand(settings);

    // Determine the previous brand
    const previousBrand = previous
      ? this.#getEffectiveBrand(previous)
      : undefined;

    this.#brandSvc.updateBrand(
      this.#hostEl,
      this.#getRenderer(),
      currentBrand,
      previousBrand,
    );
  }

  #getEffectiveBrand(settings: SkyThemeSettings): SkyThemeBrand | undefined {
    return (
      settings.brand ??
      (settings.theme === SkyTheme.presets.modern
        ? new SkyThemeBrand('blackbaud', '1.0.0')
        : undefined)
    );
  }

  #updateThemeProperty(
    property: 'mode' | 'spacing' | 'brand',
    value: SkyThemeMode | SkyThemeSpacing | SkyThemeBrand | undefined,
  ): void {
    const current = this.#current;

    assertCurrentSettings(current);

    const currentTheme = current.theme;

    let supportedValues: SkyThemeMode[] | SkyThemeSpacing[] | undefined =
      undefined;

    switch (property) {
      case 'mode':
        supportedValues = currentTheme.supportedModes;
        break;
      case 'spacing':
        supportedValues = currentTheme.supportedSpacing;
        break;
      default:
    }

    if (supportedValues && value && !supportedValues.includes(value)) {
      throw new Error(
        `The current theme does not support the specified ${property}.`,
      );
    }

    const updatedSettings = {
      theme: current.theme,
      mode: current.mode,
      spacing: current.spacing,
      brand: current.brand,
      [property]: value,
    };

    this.setTheme(
      new SkyThemeSettings(
        updatedSettings.theme,
        updatedSettings.mode,
        updatedSettings.spacing,
        updatedSettings.brand,
      ),
    );
  }

  #applyThemeClass(
    previous: SkyThemeSettings | undefined,
    current: SkyThemeSettings,
    prop: 'theme' | 'mode' | 'spacing',
    supportedProp?: 'supportedModes' | 'supportedSpacing',
  ): void {
    const currentSetting = current[prop];
    const previousClass = previous?.[prop]?.hostClass;
    const currentClass = currentSetting?.hostClass;

    if (!previousClass || previousClass !== currentClass) {
      this.#updateHostClass(
        previousClass,
        currentClass,
        currentSetting,
        current,
        supportedProp,
      );
    }
  }

  #updateHostClass(
    previousClass: string | undefined,
    currentClass: string | undefined,
    currentSetting:
      | SkyTheme
      | SkyThemeMode
      | SkyThemeSpacing
      | SkyThemeBrand
      | undefined,
    current: SkyThemeSettings,
    supportedProp?: 'supportedModes' | 'supportedSpacing',
  ): void {
    if (previousClass) {
      this.#removeHostClass(previousClass);
    }

    if (
      currentClass &&
      this.#isSupportedProperty(currentSetting, current, supportedProp)
    ) {
      this.#addHostClass(currentClass);
    }
  }

  #addHostClass(className: string): void {
    this.#getRenderer().addClass(this.#hostEl, className);
  }

  #removeHostClass(className: string): void {
    this.#getRenderer().removeClass(this.#hostEl, className);
  }

  #getRenderer(): Renderer2 {
    if (!this.#renderer) {
      throw new Error(
        'Renderer is not initialized. Have you called the theme service `init` method?',
      );
    }
    return this.#renderer;
  }

  #isSupportedProperty(
    currentSetting:
      | SkyTheme
      | SkyThemeMode
      | SkyThemeSpacing
      | SkyThemeBrand
      | undefined,
    current: SkyThemeSettings,
    supportedProp?: 'supportedModes' | 'supportedSpacing',
  ): boolean {
    return (
      !supportedProp ||
      ((currentSetting instanceof SkyThemeMode ||
        currentSetting instanceof SkyThemeSpacing) &&
        current.theme[supportedProp].includes(currentSetting))
    );
  }
}
