import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

/**
 * @internal
 */
export class ModalMockThemeService {
  public settingsChange = new BehaviorSubject<SkyThemeSettingsChange>({
    currentSettings: new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light,
    ),
    previousSettings: undefined,
  });
}
