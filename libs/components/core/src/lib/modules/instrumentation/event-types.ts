/**
 * Describes the region of the page that an instrumentation event came from.
 */
export interface SkyInstrumentationContextValue {
  /**
   * Identifies the context. Listeners filter on this value.
   */
  name: string;
  /**
   * Values describing the context, such as record identifiers. Merges with the
   * detail of ancestor contexts, and the nearest context wins when keys
   * conflict.
   */
  detail?: Record<string, unknown>;
}

/**
 * An interaction reported by a SKY UX component, delivered to every registered
 * `SkyInstrumentationListener`.
 */
export interface SkyInstrumentationEvent {
  /**
   * The context resolved from the nearest `skyInstrumentationContext`, or
   * `undefined` when the component is not within one.
   */
  context?: SkyInstrumentationContextValue;
  /**
   * The name of the event, such as `sky.help-inline.help-requested`.
   */
  eventName: string;
  /**
   * Values describing the interaction, such as the help key that was requested.
   */
  eventDetail?: Record<string, unknown>;
}
