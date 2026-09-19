import {
  Directive,
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  input,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';

@Directive({
  selector: '[skyInstrumentationContext]',
})
export class SkyInstrumentationContext {
  public readonly skyInstrumentationContext = input.required<unknown>();
}

export interface SkyUserEventEmitter {
  emit(eventName: string): void;
}

export function createSkyUserEventEmitter(): SkyUserEventEmitter {
  const context = inject(SkyInstrumentationContext, { optional: true });
  const svc = inject(SkyUserEventService, { optional: true });

  return {
    emit: (eventName: string): void => {
      svc?.broadcast(eventName, context);
    },
  } satisfies SkyUserEventEmitter;
}

export interface SkyUserEvent {
  eventName: string;
  context: unknown;
}

export abstract class SkyUserEventListener {
  public abstract onUserEvent(evt: SkyUserEvent): void;
}

export const SKY_USER_EVENT_LISTENERS = new InjectionToken<
  SkyUserEventListener[]
>('SKY_USER_EVENT_LISTENERS');

export function provideSkyUserEventListener(
  svc: Type<SkyUserEventListener>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SKY_USER_EVENT_LISTENERS,
      useClass: svc,
      multi: true,
    },
  ]);
}

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyUserEventService {
  readonly #listeners = inject(SKY_USER_EVENT_LISTENERS, { optional: true });

  public broadcast(eventName: string, context: unknown): void {
    if (this.#listeners) {
      for (const listener of this.#listeners) {
        listener.onUserEvent({ eventName, context });
      }
    }
  }
}
