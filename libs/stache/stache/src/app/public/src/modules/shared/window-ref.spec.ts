import { EventManager } from '@angular/platform-browser';
import { StacheWindowRef } from './window-ref';

describe('StacheWindowRef', () => {
  class MockEventManager {
    public addGlobalEventListener(target: string, eventName: string, handler: Function): Function {
      handler(new UIEvent('resize'));
      return () => {};
    }
  }

  it('should provide a way to access the native window object', () => {
    const eventManager = new MockEventManager();
    const windowRef = new StacheWindowRef(eventManager as EventManager);
    expect(windowRef.nativeWindow).toBe(window);
  });

  it('should create an observable stream to detect window resize', () => {
    const eventManager = new MockEventManager();
    spyOn(eventManager, 'addGlobalEventListener');
    const windowRef = new StacheWindowRef(eventManager as EventManager);
    expect(windowRef).toBeDefined();
    expect(eventManager.addGlobalEventListener).toHaveBeenCalled();
  });

  it('should trigger the onResize observable next method on window resize', () => {
    let resized = false;
    const eventManager = new MockEventManager();
    const windowRef = new StacheWindowRef(eventManager as EventManager);
    windowRef.onResize$.subscribe((event) => {
      resized = true;
    });

    windowRef.nativeWindow.dispatchEvent(new Event('resize'));
    expect(resized).toEqual(true);
  });
});
