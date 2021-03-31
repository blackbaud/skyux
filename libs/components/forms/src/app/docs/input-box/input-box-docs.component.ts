import {
  Component
} from '@angular/core';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'app-input-box-docs',
  templateUrl: './input-box-docs.component.html'
})
export class InputBoxDocsComponent {

  public modernLightTheme = new SkyThemeSettings(
    SkyTheme.presets.modern,
    SkyThemeMode.presets.light
  );

}
