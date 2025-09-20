import { SkyModalCloseArgs } from './modal-close-args';

/**
 * Properties about the modal close action and a method to close the modal.
 */
export class SkyModalBeforeCloseHandler {
  /**
   * The object that would be emitted by a modal's `closed` event. This object
   * can be used to determine whether to prompt the user for confirmation, such
   * as when the user closes a modal form after entering data.
   */
  public readonly closeArgs: SkyModalCloseArgs;

  /**
   * Function to call to close the modal. Neglecting to call this function
   * effectively cancels the close modal action.
   */
  public readonly closeModal: () => void;

  constructor(closeModal: () => void, closeArgs: SkyModalCloseArgs) {
    this.closeArgs = closeArgs;
    this.closeModal = closeModal;
  }
}
