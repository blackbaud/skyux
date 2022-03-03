import { SkyModalCloseArgs } from './modal-close-args';

export class SkyModalBeforeCloseHandler {
  constructor(
    public readonly closeModal: () => void,
    public readonly closeArgs: SkyModalCloseArgs
  ) {}
}
