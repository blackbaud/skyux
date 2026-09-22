import { SkyInstrumentationEvent } from '@skyux/core';

/**
 * Validates the instrumentation events emitted during a unit test.
 */
export abstract class SkyInstrumentationTestingController {
  /**
   * Throws an error if the expected event was not emitted.
   * @param evt The expected event. All properties must match an emitted event.
   */
  public abstract expectEvent(evt: SkyInstrumentationEvent): void;

  /**
   * Throws an error if the expected event was not emitted a specific number of
   * times.
   * @param evt The expected event. All properties must match an emitted event.
   * @param count The expected number of times the event was emitted.
   */
  public abstract expectEventCount(
    evt: SkyInstrumentationEvent,
    count: number,
  ): void;
}
