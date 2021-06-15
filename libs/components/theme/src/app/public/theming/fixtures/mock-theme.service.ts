import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyThemeSettings
} from '../theme-settings';

import {
  SkyThemeSettingsChange
} from '../theme-settings-change';

export class MockThemeService {
  public settingsChange: BehaviorSubject<SkyThemeSettingsChange>;

  public destroy(): void {}

  public init(): void {}

  public setTheme(settings: SkyThemeSettings): void {
    this.settingsChange.next({
      currentSettings: settings,
      previousSettings: this.settingsChange.getValue().currentSettings
    });
  }
}
