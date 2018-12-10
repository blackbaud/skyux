import {
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  SkyAppTestUtility
} from './test-utility';

describe('Test utility', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should use keyboard event values', fakeAsync(() => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('keydown', (event: any) => {
      listenerCalled = true;
      expect(event.key).toBe('tab');
      expect(event.altKey).toBeTruthy();
      expect(event.ctrlKey).toBeTruthy();
      expect(event.metaKey).toBeTruthy();
      expect(event.shiftKey).toBeTruthy();
    });

    SkyAppTestUtility.fireDomEvent(elem, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true
      }
    });

    tick();
    expect(listenerCalled).toBeTruthy();
  }));

  it('should use custom event values', fakeAsync(() => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('focusin', (event: any) => {
      listenerCalled = true;
      expect(event.relatedTarget).toBe(elem);
    });

    SkyAppTestUtility.fireDomEvent(elem, 'focusin', {
      customEventInit: {
        relatedTarget: elem
      }
    });

    tick();
    expect(listenerCalled).toBeTruthy();
  }));
});
