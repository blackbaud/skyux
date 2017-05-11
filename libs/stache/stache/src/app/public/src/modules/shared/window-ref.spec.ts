import { StacheWindowRef } from './window-ref';

describe('StacheWindowRef', () => {
  it('should provide a way to access the native window object', () => {
    const windowRef = new StacheWindowRef();
    expect(windowRef.nativeWindow).toBe(window);
  });
});
