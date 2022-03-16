import {
  BBHelpClient
} from '@blackbaud/help-client';

import {
  SkyAppConfig,
  SkyAppRuntimeConfigParams
} from '@skyux/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  HelpInitializationService
} from './initialization.service';

import {
  HelpWidgetConfig
} from './widget-config';

import {
  InitializationConfigExtensionService
} from './initialization-config-extension.service';

import {
  of
} from 'rxjs';

import {
  fakeAsync,
  tick
} from '@angular/core/testing';

describe('HelpInitializationService', () => {

  beforeEach(() => {
    spyOn(BBHelpClient, 'load').and.returnValue(Promise.resolve());
  });

  it('should call BBHelpClient.load with the given config', fakeAsync(() => {
    const initializationService = new HelpInitializationService(buildWindow(), buildConfig());
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(givenConfig);
  }));

  it('should call BBHelpClient.load with svcid from SkyAppConfig', fakeAsync(() => {
    const svcid = 'svcid';
    const initializationService = new HelpInitializationService(buildWindow(), buildConfig({svcid: svcid}));
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{extends: svcid}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load with overwritten \'extends\' value from svcid', fakeAsync(() => {
    const svcid = 'svcid';
    const initializationService = new HelpInitializationService(buildWindow(), buildConfig({svcid: svcid}));
    const givenConfig: HelpWidgetConfig = {productId: 'test_id', extends: 'extends'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{extends: svcid}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load with envid from SkyAppConfig', fakeAsync(() => {
    const envid = 'envid';
    const initializationService = new HelpInitializationService(buildWindow(), buildConfig({envid: envid}));
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{environmentId: envid}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load with overwritten \'environmentId\' value from envid', fakeAsync(() => {
    const envid = 'envid';
    const initializationService = new HelpInitializationService(buildWindow(), buildConfig({envid: envid}));
    const givenConfig: HelpWidgetConfig = {productId: 'test_id', environmentId: 'environmentId'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{environmentId: envid}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load with single locale from SKYUX_HOST', fakeAsync(() => {
    const locale = 'en-US';
    const initializationService = new HelpInitializationService(buildWindow(locale), buildConfig());
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{locale: locale}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load with one locale when there are multiple in SKYUX_HOST', fakeAsync(() => {
    const locale = 'en-US,en-GB';
    const initializationService = new HelpInitializationService(buildWindow(locale), buildConfig());
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{locale: 'en-US'}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load without overwriting given locale', fakeAsync(() => {
    const windowLocale = 'en-US';
    const initializationService = new HelpInitializationService(buildWindow(windowLocale), buildConfig());
    const givenConfig: HelpWidgetConfig = {productId: 'test_id', locale: 'en-GB'};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(givenConfig);
  }));

  it('should call BBHelpClient.load with empty locale when undefined value in SKYUX_HOST', fakeAsync(() => {
    const window: SkyAppWindowRef = {nativeWindow: {SKYUX_HOST: {acceptLanguage: undefined}}} as SkyAppWindowRef;
    const initializationService = new HelpInitializationService(window, buildConfig());
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    const expectedConfig: HelpWidgetConfig = {...givenConfig, ...{locale: ''}};
    initializationService.load(givenConfig);
    tick();
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));

  it('should call BBHelpClient.load with config from given extension', fakeAsync(() => {
    const extensionSpy: jasmine.SpyObj<InitializationConfigExtensionService> =
      jasmine.createSpyObj('InitializationConfigExtensionService', ['extend']);
    const expectedConfig: HelpWidgetConfig = {caseCentralUrl: 'https://case.centr.al'};
    extensionSpy.extend.and.returnValue(of(expectedConfig));
    const initializationService = new HelpInitializationService(buildWindow(), buildConfig(), extensionSpy);
    const givenConfig: HelpWidgetConfig = {productId: 'test_id'};
    initializationService.load(givenConfig);
    tick();
    expect(extensionSpy.extend).toHaveBeenCalledWith(givenConfig);
    expect(BBHelpClient.load).toHaveBeenCalledWith(expectedConfig);
  }));
});

function buildWindow(acceptLanguage: string = undefined): SkyAppWindowRef {
  const host = acceptLanguage ? {acceptLanguage: acceptLanguage} : undefined;
  return {nativeWindow: {SKYUX_HOST: host}} as SkyAppWindowRef;
}

function buildConfig(params: { svcid?: string, envid?: string } = undefined): SkyAppConfig {
  const host = 'https://example.com';
  const url: string = params ? `${host}?${buildQueryParamString(params)}` : host;
  const runtimeParams: SkyAppRuntimeConfigParams = new SkyAppRuntimeConfigParams(url, { 'svcid': true, 'envid': true });
  return {runtime: {params: runtimeParams}} as SkyAppConfig;
}

function buildQueryParamString(params: { [k: string]: string }): string {
  return Object.keys(params)
    .filter((key: string) => !!params[key])
    .map((key: string) => `${key}=${params[key]}`)
    .join('&');
}
