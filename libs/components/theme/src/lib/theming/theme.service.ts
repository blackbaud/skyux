import { Injectable, Renderer2 } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
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
  /**
   * Notifies consumers when the current theme settings have changed.
   */
  public get settingsChange(): Observable<SkyThemeSettingsChange> {
    return this.#_settingsObs;
  }

  #current: SkyThemeSettings | undefined;

  #brandLinkElement: HTMLLinkElement | undefined;

  #hostEl: any | undefined;

  #renderer: Renderer2 | undefined;

  #settings: ReplaySubject<SkyThemeSettingsChange>;

  #registeredBrands = new Map<string, SkyThemeBrand>();

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
        this.#registeredBrands.set(brand.name, brand);
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
   * @param brand The new theme brand to apply.
   */
  public setThemeBrand(brand: SkyThemeBrand): void {
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
      settings = this.#applyRegisteredBrand(settingsOrTheme);
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
    this.#applyThemeClass(previous, settings, 'brand');

    this.#settings.next({
      currentSettings: settings,
      previousSettings: previous,
    });

    this.#current = settings;
  }

  public registerBrand(brand: SkyThemeBrand): void {
    this.#registeredBrands.set(brand.name, brand);
  }

  public unregisterBrand(name: string): void {
    this.#registeredBrands.delete(name);
  }

  #applyRegisteredBrand(settings: SkyThemeSettings): SkyThemeSettings {
    const brandName = settings.brand?.name;

    if (brandName) {
      const registeredBrand = this.#registeredBrands.get(brandName);

      if (registeredBrand) {
        settings = new SkyThemeSettings(
          settings.theme,
          settings.mode,
          settings.spacing,
          registeredBrand,
        );
      }
    }

    return settings;
  }

  #updateThemeProperty(
    property: 'mode' | 'spacing' | 'brand',
    value: SkyThemeMode | SkyThemeSpacing | SkyThemeBrand,
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

    if (supportedValues && !supportedValues.includes(value)) {
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
    prop: 'theme' | 'mode' | 'spacing' | 'brand',
    supportedProp?: 'supportedModes' | 'supportedSpacing',
  ): void {
    const currentSetting = current[prop];
    const previousClass = previous?.[prop]?.hostClass;
    const currentClass = currentSetting?.hostClass;

    if (!previousClass || previousClass !== currentClass) {
      this.#updateHostClass(
        prop,
        previousClass,
        currentClass,
        currentSetting,
        current,
        supportedProp,
      );

      if (prop === 'brand') {
        if (!current.theme.supportsBranding && currentSetting) {
          throw new Error('Branding is not supported for the given theme.');
        }

        this.#updateBrandStylesheet(current.brand, previous?.brand);
      }
    }
  }

  #updateBrandStylesheet(
    currentBrand: SkyThemeBrand | undefined,
    previousBrand: SkyThemeBrand | undefined,
  ): void {
    if (
      currentBrand &&
      currentBrand.name !== 'blackbaud' &&
      previousBrand !== currentBrand
    ) {
      this.#addBrandStylesheet(currentBrand);
    } else {
      this.#removeBrandStylesheet();
    }
  }

  #updateHostClass(
    prop: 'theme' | 'mode' | 'spacing' | 'brand',
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

    if (prop === 'brand') {
      if (currentClass && !previousClass) {
        this.#addHostClass('sky-theme-brand-base');
      } else if (!currentClass && previousClass) {
        this.#removeHostClass('sky-theme-brand-base');
      }
    }

    if (
      currentClass &&
      this.#isSupportedProperty(currentSetting, current, supportedProp)
    ) {
      this.#addHostClass(currentClass);
    }
  }

  #addBrandStylesheet(brand: SkyThemeBrand): void {
    if (brand.name !== 'blackbaud') {
      // Use styleUrl if provided, otherwise build the default URL
      const styleUrl =
        brand.styleUrl ||
        `https://sky.blackbaudcdn.net/static/skyux-brand-${brand.name}/${brand.version}/assets/scss/${brand.name}.css`;

      const renderer = this.#getRenderer();

      this.#brandLinkElement = renderer.createElement(
        'link',
      ) as HTMLLinkElement;

      renderer.appendChild(this.#hostEl, this.#brandLinkElement);

      renderer.setAttribute(this.#brandLinkElement, 'rel', 'stylesheet');
      renderer.setAttribute(this.#brandLinkElement, 'href', styleUrl);

      if (brand.sriHash) {
        renderer.setAttribute(
          this.#brandLinkElement,
          'integrity',
          brand.sriHash,
        );

        renderer.setAttribute(
          this.#brandLinkElement,
          'crossorigin',
          'anonymous',
        );
      }
    }
  }

  #removeBrandStylesheet(): void {
    if (this.#brandLinkElement) {
      this.#getRenderer().removeChild(this.#hostEl, this.#brandLinkElement);
      this.#brandLinkElement = undefined;
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
