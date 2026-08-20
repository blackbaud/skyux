/**
 * Options for `SkyAppTestUtility.fireDomEvent()`.
 * @internal
 */
export interface SkyAppTestUtilityDomEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  keyboardEventInit?: KeyboardEventInit;
  customEventInit?: object;
}
