/**
 * Options for `SkyAppTestUtility.fireDomEvent()`.
 *
 * @internal
 * @deprecated Construct and dispatch a native DOM event instead (e.g.
 * `new KeyboardEvent()`, `new CustomEvent()`).
 */
export interface _SkyAppTestUtilityDomEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  keyboardEventInit?: KeyboardEventInit;
  customEventInit?: object;
}
