import { Injectable, Renderer2 } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { SkyTheme } from './theme';
import { SkyThemeBrand } from './theme-brand';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSettingsChange } from './theme-settings-change';
import { SkyThemeSpacing } from './theme-spacing';

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
   */
  public init(hostEl: any, renderer: Renderer2, theme: SkyThemeSettings): void {
    this.#hostEl = hostEl;
    this.#renderer = renderer;

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
   * Updates the current theme settings.
   * @param settings The new theme settings to apply.
   */
  public setTheme(settings: SkyThemeSettings): void {
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
      const cssPath = `https://sky.blackbaudcdn.net/static/skyux-brand-${brand.name}/${brand.version}/assets/scss/${brand.name}.css`;

      // Create a link element via Angular's renderer to avoid SSR troubles
      this.#brandLinkElement = this.#getRenderer().createElement(
        'link',
      ) as HTMLLinkElement;

      // Add the style to the head section
      this.#getRenderer().appendChild(this.#hostEl, this.#brandLinkElement);

      // Set type of the link item and path to the css file
      this.#getRenderer().setProperty(
        this.#brandLinkElement,
        'rel',
        'stylesheet',
      );
      this.#getRenderer().setProperty(this.#brandLinkElement, 'href', cssPath);
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
