import { SkyAppWindowRef } from './window-ref';

describe('Window ref', () => {

  it('should provide a way to access the native window object', () => {
    const ref = new SkyAppWindowRef();

    expect(ref.nativeWindow).toBe(window);
  });

});
