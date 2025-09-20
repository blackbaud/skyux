import {
  DOCUMENT,
  EnvironmentProviders,
  RendererFactory2,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

import { SkyTheme } from '../theming/theme';
import { SkyThemeMode } from '../theming/theme-mode';
import { SkyThemeSettings } from '../theming/theme-settings';
import { SkyThemeSpacing } from '../theming/theme-spacing';
import { SkyThemeService } from '../theming/theme.service';

export function provideInitialTheme(
  name: keyof typeof SkyTheme.presets = 'default',
  options?: {
    mode?: keyof typeof SkyThemeMode.presets;
    spacing?: keyof typeof SkyThemeSpacing.presets;
  },
): EnvironmentProviders {
  return makeEnvironmentProviders([
    SkyThemeService,
    provideAppInitializer(() => {
      const initializerFn = ((
        themeService: SkyThemeService,
        doc: Document,
        rendererFactory: RendererFactory2,
      ) => {
        return (): void => {
          themeService.init(
            doc.body,
            rendererFactory.createRenderer(null, null),
            new SkyThemeSettings(
              SkyTheme.presets[name],
              SkyThemeMode.presets[options?.mode ?? 'light'],
              SkyThemeSpacing.presets[options?.spacing ?? 'standard'],
            ),
          );
        };
      })(inject(SkyThemeService), inject(DOCUMENT), inject(RendererFactory2));
      return initializerFn();
    }),
  ]);
}
