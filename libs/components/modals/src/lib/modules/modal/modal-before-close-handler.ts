import { SkyModalCloseArgs } from './modal-close-args';

/**
 * Closes the modal instance using the `closeModal` method.
 */
export class SkyModalBeforeCloseHandler {
  constructor(
    public readonly closeModal: Function,
    public readonly closeArgs: SkyModalCloseArgs
  ) {}
}
