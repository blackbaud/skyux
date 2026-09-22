import { Directive, inject, input } from '@angular/core';
import {
  SKY_INSTRUMENTATION_CONTEXT,
  SkyUserEventContextResolver,
} from './context-resolver';
import { SkyInstrumentationContextValue } from './event-types';

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
  public readonly skyInstrumentationContext =
    input.required<SkyInstrumentationContextValue>();
}
