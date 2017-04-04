function createEvent(eventName: string) {
  let evt = document.createEvent('CustomEvent');
  evt.initEvent(eventName, false, false);
  return evt;
}

export class TestUtility {
  public static fireDomEvent(el: any, name: string) {
    el.dispatchEvent(createEvent(name));
  }
}
