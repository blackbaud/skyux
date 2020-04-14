import {
  Injectable,
  Renderer2
} from '@angular/core';

import {
  Observable,
  ReplaySubject
} from 'rxjs';

import {
  SkyThemeSettings
} from './theme-settings';

import {
  SkyThemeSettingsChange
} from './theme-settings-change';

/**
 * Provides methods for updating and handling changes to the current theme.
 */
@Injectable()
export class SkyThemeService {

  /**
   * Notifies consumers when the current theme settings have changed.
   */
  public get settingsChange(): Observable<SkyThemeSettingsChange> {
    return this.settingsObs;
  }

  private current: SkyThemeSettings;

  private hostEl: any;

  private renderer: Renderer2;

  private settings: ReplaySubject<SkyThemeSettingsChange>;

  private settingsObs: Observable<SkyThemeSettingsChange>;

  constructor() {
    this.settings = new ReplaySubject<SkyThemeSettingsChange>(1);
    this.settingsObs = this.settings.asObservable();
  }

  /**
   * Initializes the theme service with the specified parameters. This should only be called
   * from a host component that provides its own theme to child components.
   * @param hostEl The host element under which themed components are rendered.
   * @param renderer A Renderer2 instance for updating the host element with theme changes.
   * @param theme The initial theme.
   */
  public init(
    hostEl: any,
    renderer: Renderer2,
    theme: SkyThemeSettings
  ): void {
    this.hostEl = hostEl;
    this.renderer = renderer;

    this.setTheme(theme);
  }

  /**
   * Destroys the current theme service. This should only be called from a host component that
   * provides its own theme to child components.
   */
  public destroy(): void {
    this.settings.complete();

    this.hostEl =
      this.renderer =
      undefined;
  }

  /**
   * Updates the current theme settings.
   * @param settings The new theme settings to apply.
   */
  public setTheme(settings: SkyThemeSettings): void {
    const previousSettings = this.current;

    this.applySettings(previousSettings, settings);
    this.applyThemeMode(previousSettings, settings);

    this.settings.next({
      currentSettings: settings,
      previousSettings
    });

    this.current = settings;
  }

  private applySettings(previous: SkyThemeSettings, current: SkyThemeSettings): void {
    const previousClass = previous && previous.theme.hostClass;
    const currentClass = current.theme.hostClass;

    const hostClassChanged = !previousClass || previousClass !== currentClass;

    if (hostClassChanged) {
      if (previousClass) {
        this.removeHostClass(previousClass);
      }

      this.addHostClass(currentClass);
    }
  }

  private applyThemeMode(previous: SkyThemeSettings, current: SkyThemeSettings): void {
    const previousClass = previous && previous.mode.hostClass;
    const currentClass = current.mode.hostClass;

    const hostModeClassChanged = !previous || previousClass !== currentClass;

    if (hostModeClassChanged) {
      if (previousClass) {
        this.removeHostClass(previousClass);
      }

      if (current.theme.supportedModes.indexOf(current.mode) >= 0) {
        this.addHostClass(currentClass);
      }
    }
  }

  private addHostClass(className: string): void {
    this.renderer.addClass(this.hostEl, className);
  }

  private removeHostClass(className: string): void {
    this.renderer.removeClass(this.hostEl, className);
  }
}
