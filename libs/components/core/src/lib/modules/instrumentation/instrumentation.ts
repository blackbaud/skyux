import {
  Directive,
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  input,
  makeEnvironmentProviders,
  Provider,
  Type,
} from '@angular/core';

export type SkyInstrumentationContextType = Record<string, unknown>;

@Directive({
  // host: {
  //   '[attr.data-sky-instrumentation-context]': 'skyInstrumentationContext()',
  // },
  selector: '[skyInstrumentationContext]',
})
export class SkyInstrumentationContext {
  readonly #parentContext = inject(SkyInstrumentationContext, {
    optional: true,
    skipSelf: true,
  });

  public readonly skyInstrumentationContext =
    input.required<SkyInstrumentationContextType>();

  public resolve(): SkyInstrumentationContextType {
    if (this.#parentContext?.skyInstrumentationContext()) {
      return {
        ...this.#parentContext?.resolve(),
        ...this.skyInstrumentationContext(),
      };
    }

    return this.skyInstrumentationContext();
  }
}

export interface SkyUserEventEmitter {
  emit(eventName: string): void;
}

export function createSkyUserEventEmitter(): SkyUserEventEmitter {
  const context = inject(SKY_INSTRUMENTATION_CONTEXT, { optional: true });
  const svc = inject(SkyUserEventService, { optional: true });

  return {
    emit: (eventName: string): void => {
      svc?.broadcast(eventName, context ?? undefined);
    },
  } satisfies SkyUserEventEmitter;
}

export interface SkyUserEvent {
  eventName: string;
  context?: SkyInstrumentationContextType;
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

  public broadcast(
    eventName: string,
    context?: SkyInstrumentationContextType,
  ): void {
    for (const listener of this.#listeners ?? []) {
      listener.onUserEvent({ eventName, context });
    }
  }
}

export const SKY_INSTRUMENTATION_CONTEXT =
  new InjectionToken<SkyInstrumentationContextType>(
    'SKY_INSTRUMENTATION_CONTEXT',
  );

export function provideSkyInstrumentationContext(
  context: SkyInstrumentationContextType,
): Provider {
  return {
    provide: SKY_INSTRUMENTATION_CONTEXT,
    useFactory: () => ({
      ...inject(SKY_INSTRUMENTATION_CONTEXT, {
        optional: true,
        skipSelf: true,
      }),
      ...context,
    }),
  };
}
