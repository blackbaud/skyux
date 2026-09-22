import { Directive, inject, input } from '@angular/core';
import {
  SKY_INSTRUMENTATION_CONTEXT,
  SkyUserEventContextResolver,
} from './context-resolver';

@Directive({
  selector: '[skyInstrumentationContext]',
  providers: [
    {
      provide: SKY_INSTRUMENTATION_CONTEXT,
      useFactory(): SkyUserEventContextResolver {
        const parent = inject(SKY_INSTRUMENTATION_CONTEXT, {
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
  public readonly skyInstrumentationContext =
    input.required<Record<string, unknown>>();
}
