import { SkyConfirmCloseEventArgs, SkyConfirmConfig } from '@skyux/modals';

/**
 * A controller to be injected into tests, which mocks the confirm service
 * and handles interactions with confirm dialogs.
 */
export abstract class SkyConfirmTestingController {
  /**
   * Closes the confirm dialog with the "cancel" action.
   */
  public abstract cancel(): void;
  /**
   * Throws if a confirm dialog is open.
   */
  public abstract expectNone(): void;
  /**
   * Throws if the open confirm dialog does not match the provided configuration.
   * @param config
   */
  public abstract expectOpen(config: SkyConfirmConfig): void;
  /**
   * Closes the confirm dialog with the provided action.
   */
  public abstract close(args: SkyConfirmCloseEventArgs): void;
  /**
   * Closes the confirm dialog with the "ok" action.
   */
  public abstract ok(): void;
}
