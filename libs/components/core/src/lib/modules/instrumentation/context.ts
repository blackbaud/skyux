import { Directive, inject, input } from '@angular/core';
import {
  SKY_INSTRUMENTATION_CONTEXT,
  SkyInstrumentationContextResolver,
} from './context-resolver';
import { SkyInstrumentationContextValue } from './event-types';

/**
 * Describes the region of the page that the instrumentation events emitted
 * within this element came from. Nest contexts to add more specific
 * information.
 */
@Directive({
  selector: '[skyInstrumentationContext]',
  providers: [
    {
      provide: SKY_INSTRUMENTATION_CONTEXT,
      useFactory(): SkyInstrumentationContextResolver {
        const parent = inject(SKY_INSTRUMENTATION_CONTEXT, {
          optional: true,
          skipSelf: true,
        });

        const self = inject(SkyInstrumentationContext);

        return {
          resolve: (): SkyInstrumentationContextValue => {
            const parentDetail = parent?.resolve().detail;
            const { name, detail } = self.skyInstrumentationContext();

            if (!parentDetail && !detail) {
              return { name };
            }

            return { name, detail: { ...parentDetail, ...detail } };
          },
        };
      },
    },
  ],
})
export class SkyInstrumentationContext {
  /**
   * The context to attach to instrumentation events emitted within this
   * element.
   */
  public readonly skyInstrumentationContext =
    input.required<SkyInstrumentationContextValue>();
}
