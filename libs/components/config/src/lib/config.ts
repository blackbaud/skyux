import { Injectable } from '@angular/core';

import { SkyuxConfigParams } from './config-params';
import { SkyuxConfigRemoteModules } from './config-remote-modules';
import { SkyAppRuntimeConfigParams } from './params';

export interface RuntimeConfigApp {
  base: string;
  inject: boolean;
  name?: string;
  template: string;
}

/**
 * @experimental
 */
export interface SkyuxRuntimeConfigLocalDev {
  assetsBaseUrl?: string;
  hasRemoteModules?: boolean;
}

export class SkyuxPactConfig {
  public providers?: Record<
    string,
    {
      host?: string;
      port?: string;
      fullUrl?: string;
    }
  >;
  public pactProxyServer?: string;
}

export interface SkyuxConfigE2ETestSettings {
  browserSet?: 'speedy';
}

export interface SkyuxConfigUnitTestSettings {
  browserSet?: 'speedy' | 'quirky' | 'paranoid';
}

export interface SkyuxConfigTestSettings {
  e2e?: SkyuxConfigE2ETestSettings;
  unit?: SkyuxConfigUnitTestSettings;
}

export interface SkyuxConfigLibrarySettings {
  whitelistedNonPeerDependencies?: string[];
}

export interface RuntimeConfig {
  app: RuntimeConfigApp;
  command?: string; // Dynamically added in "higher up" webpacks
  componentsPattern: string;
  componentsIgnorePattern: string;
  handle404?: boolean; // Dynamically added in sky-pages-module-generator.js
  includeRouteModule: boolean;
  pactConfig?: SkyuxPactConfig;
  params: SkyAppRuntimeConfigParams;
  routes?: object[]; // Dynamically added in sky-pages-module-generator.js
  routesPattern: string;
  runtimeAlias: string;
  spaPathAlias: string;
  skyPagesOutAlias: string;
  skyuxPathAlias: string;
  srcPath: string;
  useTemplateUrl: boolean;
  localDev?: SkyuxRuntimeConfigLocalDev;
}

export interface SkyuxConfigA11y {
  rules?: any;
}

export type SkyuxConfigAppSupportedTheme = 'default' | 'modern';

export interface SkyuxConfigAppBrand {
  name: string;
  version: string;
}

export interface SkyuxConfigAppTheming {
  supportedThemes: SkyuxConfigAppSupportedTheme[];
  theme: SkyuxConfigAppSupportedTheme;
  brand?: SkyuxConfigAppBrand;
}

export interface SkyuxConfigApp {
  base?: string;
  externals?: object;
  port?: string;
  styles?: string[];
  theming?: SkyuxConfigAppTheming;
  title?: string;
}

export interface SkyuxConfigAuthSettings {
  blackbaudEmployee?: boolean;
}

export interface SkyuxConfigHostBBCheckout {
  version: '2';
}

export interface SkyuxConfigHostFrameOptionsNone {
  blackbaud?: false;
  none: true;
  self?: false;
  urls?: string[];
}

export interface SkyuxConfigHostFrameOptionsOthers {
  blackbaud?: boolean;
  none?: false;
  self?: boolean;
  urls?: string[];
}

export type SkyuxConfigHostCspDirectives = Record<string, string[]>;

export interface SkyuxConfigHostCsp {
  enabled: boolean;
  directives?: SkyuxConfigHostCspDirectives;
}

/**
 * Blackbaud Only - Specifies configuration options for communication with SKY UX Host.
 */
export interface SkyuxConfigHost {
  bbCheckout?: SkyuxConfigHostBBCheckout;
  csp?: SkyuxConfigHostCsp;
  frameOptions?:
    | SkyuxConfigHostFrameOptionsNone
    | SkyuxConfigHostFrameOptionsOthers;
  url?: string;
}

export interface SkyuxConfigAnyAllSet {
  any?: string[];
  all?: string[];
}

export interface SkyuxConfig {
  $schema?: string;
  a11y?: SkyuxConfigA11y | boolean;
  angularSettings?: {
    defaultProject: string;
  };
  app?: SkyuxConfigApp;
  appSettings?: any;
  auth?: boolean;
  authSettings?: SkyuxConfigAuthSettings;
  codeCoverageThreshold?: 'none' | 'standard' | 'strict';
  command?: string;
  compileMode?: string;
  cssPath?: string;
  dependenciesForTranspilation?: string[];
  enableIvy?: boolean;
  help?: any;
  host?: SkyuxConfigHost;
  importPath?: string;
  librarySettings?: SkyuxConfigLibrarySettings;
  mode?: string;
  moduleAliases?: Record<string, string>;
  name?: string;
  pacts?: any[];
  params?: SkyuxConfigParams; // List of allowed params
  pipelineSettings?: any;
  plugins?: string[];
  redirects?: Record<string, string>;
  remoteModules?: SkyuxConfigRemoteModules;
  routes?: {
    public?: {
      title?: string;
      description?: string;
      global?: boolean;
      route: string;
      claims?: SkyuxConfigAnyAllSet;
      entitlementType?: string;
      entitlements?: SkyuxConfigAnyAllSet;
      permissionId?: string;
      permissions?: {
        admin?: boolean;
        legalEntityAdmin?: boolean;
        permissionIds?: SkyuxConfigAnyAllSet;
      };
    }[];
    referenced?: {
      app: string;
      route: string;
    }[];
  };
  testSettings?: SkyuxConfigTestSettings;
  omnibar?: any;
  useHashRouting?: boolean;
  skyuxModules?: string[];
}

@Injectable()
export class SkyAppConfig {
  // Any properties dynamically added via code
  public runtime!: RuntimeConfig;

  // Any properties defined in or inherited from skyuxconfig.json / skyuxconfig.command.json
  public skyux!: SkyuxConfig;
}
