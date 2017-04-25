export class TestUtility {
  public static triggerDomEvent(element: any, eventName: string) {
    let event = new Event(eventName);
    element.dispatchEvent(event);
  }
}
