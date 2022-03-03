export interface SkyAppTestUtilityDomEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  keyboardEventInit?: KeyboardEventInit;
  customEventInit?: Record<string, unknown>;
}
