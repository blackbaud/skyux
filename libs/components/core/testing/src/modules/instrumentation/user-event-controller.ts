import { SkyInstrumentationUserEvent } from '@skyux/core';

/**
 * Provides methods for validating instrumentation user events in unit tests.
 */
export abstract class SkyInstrumentationUserEventTestingController {
  /**
   * Throws an error if the expected user event was not emitted.
   * @param evt The expected event. All properties must match an emitted event.
   */
  public abstract expectUserEvent(
    evt: Omit<SkyInstrumentationUserEvent, 'eventType'>,
  ): void;

  /**
   * Throws an error if the expected user event was not emitted a specific
   * number of times.
   * @param evt The expected event. All properties must match an emitted event.
   * @param count The expected number of times the event was emitted.
   */
  public abstract expectUserEventCount(
    evt: Omit<SkyInstrumentationUserEvent, 'eventType'>,
    count: number,
  ): void;
}
