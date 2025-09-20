import { Injectable } from '@angular/core';

@Injectable()
export class ModalContext {
  public data:
    | {
        value1: string;
      }
    | undefined;
}
