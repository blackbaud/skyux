import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  StacheWindowRef
} from './window-ref';

describe('StacheWindowRef', () => {
  it('should provide a way to access the native window object', () => {
    const windowRef = new StacheWindowRef();
    expect(windowRef.nativeWindow).toBe(window);
  });

  it('should create an observable stream to detect window resize', () => {
    const spy = spyOn(window, 'addEventListener').and.callThrough();
    const windowRef = new StacheWindowRef();

    expect(windowRef).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should trigger the onResize observable next method on window resize', () => {
    let resized = false;

    const windowRef = new StacheWindowRef();

    windowRef.onResizeStream.subscribe((event) => {
      resized = true;
    });

    SkyAppTestUtility.fireDomEvent(windowRef.nativeWindow, 'resize');

    expect(resized).toEqual(true);
  });
});
