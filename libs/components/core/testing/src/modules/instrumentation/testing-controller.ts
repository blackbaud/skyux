import { SkyInstrumentationEvent } from '@skyux/core';

/**
 * Provides methods for validating instrumentation user events in unit tests.
 */
export abstract class SkyInstrumentationTestingController {
  /**
   * Throws an error if the expected user event was not emitted.
   * @param evt The expected event. All properties must match an emitted event.
   */
  public abstract expectEvent(evt: SkyInstrumentationEvent): void;

  /**
   * Throws an error if the expected user event was not emitted a specific
   * number of times.
   * @param evt The expected event. All properties must match an emitted event.
   * @param count The expected number of times the event was emitted.
   */
  public abstract expectEventCount(
    evt: SkyInstrumentationEvent,
    count: number,
  ): void;
}
