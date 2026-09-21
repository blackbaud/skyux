import { Directive, inject, input } from '@angular/core';
import { SkyInstrumentationContextType } from './instrumentation-context-type';

@Directive({
  host: {
    '[attr.data-sky-instrumentation-context]': 'skyInstrumentationContext()',
  },
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

// export const SKY_INSTRUMENTATION_CONTEXT =
//   new InjectionToken<SkyInstrumentationContextType>(
//     'SKY_INSTRUMENTATION_CONTEXT',
//   );

// export function provideSkyInstrumentationContext(
//   context: SkyInstrumentationContextType,
// ): Provider {
//   return {
//     provide: SKY_INSTRUMENTATION_CONTEXT,
//     useFactory: () => ({
//       ...inject(SKY_INSTRUMENTATION_CONTEXT, {
//         optional: true,
//         skipSelf: true,
//       }),
//       ...context,
//     }),
//   };
// }
