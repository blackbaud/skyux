import { SkyTheme, SkyThemeMode, SkyThemeSettingsChange } from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

export class ModalMockThemeService {
  public settingsChange = new BehaviorSubject<SkyThemeSettingsChange>({
    currentSettings: {
      mode: SkyThemeMode.presets.light,
      theme: SkyTheme.presets.default,
    },
    previousSettings: undefined,
  });
}
