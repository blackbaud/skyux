import {
  SkyAppTestUtility
} from '@skyux-sdk/testing/test-utility/test-utility';

export class TestUtility {
  public static triggerDomEvent(element: any, eventName: string) {
    return SkyAppTestUtility.fireDomEvent(element, eventName);
  }
}
