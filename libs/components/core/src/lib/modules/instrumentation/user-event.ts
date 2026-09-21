/**
 * A user interaction with a SKY UX component, delivered to every registered
 * `SkyInstrumentationUserEventListener`.
 */
export interface SkyInstrumentationUserEvent {
  /**
   * The name of the event, such as `sky.help-inline.button-clicked`.
   */
  eventName: string;
  /**
   * Properties describing the interaction, provided by the component that
   * emitted the event.
   */
  eventProperties?: Record<string, unknown>;
  /**
   * The context resolved from the nearest `skyInstrumentationContext`, or
   * `undefined` when no context applies to the emitting component.
   */
  context?: Record<string, unknown>;
}
