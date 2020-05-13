// #region imports
import {
  Provider
} from '@angular/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyToastConfig
} from './types/toast-config';

import {
  SkyToast
} from './toast';

import {
  SkyToastInstance
} from './toast-instance';
// #endregion

describe('Toast class', () => {
  it('should set defaults', () => {
    const component = function () {};
    const providers: Provider[] = [];
    const config: SkyToastConfig = {};
    const toast = new SkyToast(component, providers, config);
    expect(toast.bodyComponent).toEqual(component);
    expect(toast.bodyComponentProviders).toEqual(providers);
    expect(toast.config).toEqual(config);
    expect(toast.instance).toBeUndefined();
  });

  it('should only allow setting the instance once', () => {
    const component = function () {};
    const providers: Provider[] = [];
    const config: SkyToastConfig = {};
    const toast = new SkyToast(component, providers, config);
    const firstInstance = new SkyToastInstance();
    (firstInstance as any).fooName = 'first';
    const secondInstance = new SkyToastInstance();
    (secondInstance as any).fooName = 'second';
    toast.instance = firstInstance;
    toast.instance = secondInstance;
    expect((toast.instance as any).fooName).toEqual('first');
  });
});
