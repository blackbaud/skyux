import { DOCUMENT } from '@angular/common';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  RendererFactory2,
  makeEnvironmentProviders,
} from '@angular/core';

import { SkyTheme } from '../theming/theme';
import { SkyThemeMode } from '../theming/theme-mode';
import { SkyThemeSettings } from '../theming/theme-settings';
import { SkyThemeSpacing } from '../theming/theme-spacing';
import { SkyThemeService } from '../theming/theme.service';

export function provideModernTheme(options?: {
  mode?: keyof typeof SkyThemeMode.presets;
  spacing?: keyof typeof SkyThemeSpacing.presets;
}): EnvironmentProviders {
  return makeEnvironmentProviders([
    SkyThemeService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (
        themeService: SkyThemeService,
        doc: Document,
        rendererFactory: RendererFactory2,
      ) => {
        return () => {
          themeService.init(
            doc.body,
            rendererFactory.createRenderer(null, null),
            new SkyThemeSettings(
              SkyTheme.presets.modern,
              SkyThemeMode.presets[options?.mode ?? 'light'],
              SkyThemeSpacing.presets[options?.spacing ?? 'standard'],
            ),
          );
        };
      },
      deps: [SkyThemeService, DOCUMENT, RendererFactory2],
    },
  ]);
}
