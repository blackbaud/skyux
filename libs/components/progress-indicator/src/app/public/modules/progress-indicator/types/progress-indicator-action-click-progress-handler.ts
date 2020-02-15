/**
 * Allows the consumer to trigger step advancement manually.
 */
export class SkyProgressIndicatorActionClickProgressHandler {

  /**
   *
   * @param advance Advances the progress indicator to the next step.
   */
  constructor(
    public readonly advance: Function
  ) { }

}
