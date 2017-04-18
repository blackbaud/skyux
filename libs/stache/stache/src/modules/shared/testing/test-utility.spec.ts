import { TestUtility } from './test-utility';

describe('TestUtility', () => {
  it('should trigger events on a given element', () => {
    const event = new Event('customEventName');
    const element = window.document.createElement('div');
    spyOn(element, 'dispatchEvent');
    TestUtility.triggerDomEvent(element, event.type);
    expect(element.dispatchEvent).toHaveBeenCalledWith(event);
  });
});
