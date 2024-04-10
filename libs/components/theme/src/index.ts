export { SkyThemeIconManifest } from './lib/icons/icon-manifest';
export { SkyThemeIconManifestGlyph } from './lib/icons/icon-manifest-glyph';
export { SkyThemeIconManifestService } from './lib/icons/icon-manifest.service';
export { SkyAppStyleLoader } from './lib/style-loader';
export { SkyThemeModule } from './lib/theme.module';
export { SkyTheme } from './lib/theming/theme';
export { SkyThemeMode } from './lib/theming/theme-mode';
export { SkyThemeSettings } from './lib/theming/theme-settings';
export { SkyThemeSettingsChange } from './lib/theming/theme-settings-change';
export { SkyThemeSpacing } from './lib/theming/theme-spacing';
export { SkyThemeService } from './lib/theming/theme.service';
export { SkyAppViewportReserveArgs } from './lib/viewport/viewport-reserve-args';
export { SkyAppViewportReservedPositionType } from './lib/viewport/viewport-reserve-position-type';
export { SkyAppViewportService } from './lib/viewport/viewport.service';

export { provideInitialTheme } from './lib/providers/provide-initial-theme';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyThemeClassDirective as λ2 } from './lib/theming/theme-class.directive';
export { SkyThemeIfDirective as λ3 } from './lib/theming/theme-if.directive';
export { SkyThemeDirective as λ1 } from './lib/theming/theme.directive';
