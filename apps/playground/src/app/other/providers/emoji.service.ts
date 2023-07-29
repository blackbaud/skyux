import { Inject, Injectable } from '@angular/core';

import { EMOJI } from './emoji-token';

@Injectable()
export class EmojiService {
  readonly #emoji: string;

  constructor(@Inject(EMOJI) emoji = '🚀') {
    this.#emoji = emoji;
  }

  public get emoji(): string {
    return this.#emoji;
  }
}
