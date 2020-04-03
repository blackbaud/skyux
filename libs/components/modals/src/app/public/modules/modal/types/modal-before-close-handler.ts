import {
  SkyModalCloseArgs
} from '../modal-close-args';

export class SkyModalBeforeCloseHandler {
  constructor(
    public readonly closeModal: Function,
    public readonly closeArgs: SkyModalCloseArgs
  ) { }
}
