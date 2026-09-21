import {
  Directive,
  inject,
  InjectionToken,
  Injector,
  input,
  StaticProvider,
} from '@angular/core';

export interface SkyUserEventContextResolver {
  resolve(): Record<string, unknown>;
}

export const SKY_USER_EVENT_CONTEXT =
  new InjectionToken<SkyUserEventContextResolver>('SKY_USER_EVENT_CONTEXT');

/**
 * Attaches application-specific context, such as record or page identifiers, to
 * the user events emitted by SKY UX components rendered inside this element.
 * Nested contexts merge, with keys declared nearest the emitting component
 * taking precedence.
 */
@Directive({
  selector: '[skyInstrumentationContext]',
  providers: [
    {
      provide: SKY_USER_EVENT_CONTEXT,
      useFactory(): SkyUserEventContextResolver {
        const parent = inject(SKY_USER_EVENT_CONTEXT, {
          optional: true,
          skipSelf: true,
        });

        const self = inject(SkyInstrumentationContext);

        return {
          resolve: () => ({
            ...parent?.resolve(),
            ...self.skyInstrumentationContext(),
          }),
        };
      },
    },
  ],
})
export class SkyInstrumentationContext {
  /**
   * The context to attach to user events emitted inside this element.
   */
  public readonly skyInstrumentationContext =
    input.required<Record<string, unknown>>();
}

/**
 * Forwards the nearest instrumentation context to a component created outside of
 * the current view, such as a modal or flyout, whose injector cannot reach it.
 * Without this, the component's user events are still delivered to listeners,
 * but with no context attached.
 * @param injector An injector that can reach the context, typically the one
 * belonging to the component opening the modal or flyout.
 * @returns Providers to pass to `SkyModalConfigurationInterface.providers`,
 * `SkyFlyoutConfig.providers`, or `SkyDynamicComponentOptions.providers`. Empty
 * when the injector cannot reach a context.
 */
export function provideSkyInstrumentationContextFrom(
  injector: Injector,
): StaticProvider[] {
  const context = injector.get(SKY_USER_EVENT_CONTEXT, null);

  return context
    ? [{ provide: SKY_USER_EVENT_CONTEXT, useValue: context }]
    : [];
}
