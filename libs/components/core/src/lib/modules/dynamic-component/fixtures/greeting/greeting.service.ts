import { Injectable, inject } from '@angular/core';

import { GREETING_CONFIG } from './greeting-token';

@Injectable()
export class GreetingService {
  readonly #config = inject(GREETING_CONFIG, { optional: true });

  public sayHello(): string {
    return this.#config?.greeting ?? 'Hello World!';
  }
}
