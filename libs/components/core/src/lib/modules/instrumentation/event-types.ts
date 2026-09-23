/**
 * Describes the region of the page that an instrumentation event came from.
 */
export interface SkyInstrumentationContextValue {
  /**
   * Identifies the context. Listeners filter on this value.
   */
  name: string;
  /**
   * Values describing the context, such as record identifiers.
   */
  detail?: Record<string, unknown>;
  /**
   * The context that encloses this one, when contexts are nested. Walk this
   * chain to read the name and detail of each enclosing context.
   */
  parent?: SkyInstrumentationContextValue;
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
