/**
 * Application-specific information attached to the instrumentation events
 * emitted within a `skyInstrumentationContext` element.
 */
export interface SkyInstrumentationContextValue {
  /**
   * Identifies the context. Listeners filter on this value.
   */
  name: string;
  /**
   * Values describing the context, such as record identifiers. Merges with the
   * detail of any ancestor contexts.
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
   * `undefined` when no context applies to the emitting component.
   */
  context?: SkyInstrumentationContextValue;
  /**
   * The name of the event, such as `sky.help-inline.help-requested`.
   */
  eventName: string;
  /**
   * Values describing the interaction, provided by the component that emitted
   * the event.
   */
  eventDetail?: Record<string, unknown>;
}
