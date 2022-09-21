// #region imports
import { Provider } from '@angular/core';
import { expect } from '@skyux-sdk/testing';

import { SkyToast } from './toast';
import { SkyToastInstance } from './toast-instance';
import { SkyToastConfig } from './types/toast-config';

// #endregion

class ToastTestComponent {}

describe('Toast class', () => {
  it('should set defaults', () => {
    const providers: Provider[] = [];
    const config: SkyToastConfig = {};
    const instance = new SkyToastInstance();
    const toast = new SkyToast(ToastTestComponent, providers, instance, config);

    expect(toast.bodyComponent).toEqual(ToastTestComponent);
    expect(toast.bodyComponentProviders).toEqual(providers);
    expect(toast.config).toEqual(config);
    expect(toast.instance).toBe(instance);
  });
});
