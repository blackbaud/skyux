import { HelpWindowRef } from './window-ref';

describe('HelpWindowRef', () => {
  it('should provide a way to access the native window object', () => {
    const windowRef = new HelpWindowRef();
    expect(windowRef.nativeWindow).toBe(window);
  });
});
