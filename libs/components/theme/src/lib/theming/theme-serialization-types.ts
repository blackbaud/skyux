/**
 * Type definitions for theme serialization and deserialization.
 */

/**
 * Serialized representation of a SkyThemeMode.
 */
export interface SkyThemeModeData {
  name: string;
  hostClass?: string;
  isPreset?: boolean;
}

/**
 * Serialized representation of a SkyThemeSpacing.
 */
export interface SkyThemeSpacingData {
  name: string;
  hostClass?: string;
  isPreset?: boolean;
}

/**
 * Serialized representation of a SkyThemeBrand.
 */
export interface SkyThemeBrandData {
  name: string;
  version: string;
  hostClass?: string;
  styleUrl?: string;
  sriHash?: string;
}

/**
 * Serialized representation of a SkyTheme.
 */
export interface SkyThemeData {
  name: string;
  hostClass?: string;
  supportedModes: SkyThemeModeData[];
  supportedSpacing?: SkyThemeSpacingData[];
  supportsBranding?: boolean;
  isPreset?: boolean;
}

/**
 * Serialized representation of SkyThemeSettings (internal structure before JSON stringification).
 */
export interface SkyThemeSettingsData {
  theme: SkyThemeData;
  mode: SkyThemeModeData;
  spacing?: SkyThemeSpacingData;
  brand?: SkyThemeBrandData;
}
