import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export const GREETING_CONFIG = new InjectionToken<GreetingConfig>(
  'GreetingConfig'
);

export interface GreetingConfig {
  greeting: string;
}

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
