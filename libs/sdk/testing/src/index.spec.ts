import {
  SkyAppTestUtility,
  SkyAppTestUtilityDomEventOptions,
} from './index';

describe('Public API compatibility', () => {
  it('should export a working SkyAppTestUtility from the public entry point', () => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('click', () => {
      listenerCalled = true;
    });

    const options: SkyAppTestUtilityDomEventOptions = {
      bubbles: true,
      cancelable: true,
    };

    SkyAppTestUtility.fireDomEvent(elem, 'click', options);

    expect(listenerCalled).toBeTrue();

    elem.remove();
  });
});
