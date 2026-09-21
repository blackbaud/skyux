import { inject } from '@angular/core';

import { SKY_USER_EVENT_CONTEXT } from './instrumentation-context';
import { SKY_USER_EVENT_LISTENERS } from './user-event-listener';

/**
 * Emits user events on behalf of a SKY UX component, attaching the context from
 * the nearest `skyInstrumentationContext`.
 */
export class SkyInstrumentationUserEventEmitter {
  readonly #context = inject(SKY_USER_EVENT_CONTEXT, { optional: true });
  readonly #listeners = inject(SKY_USER_EVENT_LISTENERS, { optional: true });

  /**
   * Notifies every registered listener of a user interaction.
   * @param eventName The name of the event, such as `sky.help-inline.button-clicked`.
   * @param eventProperties Properties describing the interaction.
   */
  public emit(
    eventName: string,
    eventProperties?: Record<string, unknown>,
  ): void {
    for (const listener of this.#listeners ?? []) {
      listener.onUserEvent({
        eventName,
        eventProperties,
        context: this.#context?.resolve(),
      });
    }
  }
}

/**
 * Creates an emitter that a SKY UX component uses to report user interactions.
 * Call this in an injection context, such as a field initializer, so the
 * emitter resolves the context surrounding the component.
 */
export function createSkyInstrumentationUserEventEmitter(): SkyInstrumentationUserEventEmitter {
  return new SkyInstrumentationUserEventEmitter();
}
