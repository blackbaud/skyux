/**
 * Allows the consumer to decide whether the button's action should be completed successfully.
 * The handler is provided with all nav button types.
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
