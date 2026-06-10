import { Injectable, InjectionToken, inject } from '@angular/core';

export const GREETING_CONFIG = new InjectionToken<GreetingConfig>(
  'GreetingConfig',
);

export interface GreetingConfig {
  greeting: string;
}

@Injectable()
export class GreetingService {
  #config = inject(GREETING_CONFIG, { optional: true });

  public sayHello(): string {
    return this.#config?.greeting ?? 'Hello World!';
  }
}
