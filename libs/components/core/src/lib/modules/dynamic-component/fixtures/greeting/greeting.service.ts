import { Inject, Injectable, Optional } from '@angular/core';

import { GreetingConfig } from './greeting-config';
import { GREETING_CONFIG } from './greeting-token';

@Injectable()
export class GreetingService {
  #config: GreetingConfig;

  constructor(@Optional() @Inject(GREETING_CONFIG) config: GreetingConfig) {
    this.#config = config;
  }

  public sayHello(): string {
    return this.#config?.greeting ?? 'Hello World!';
  }
}
