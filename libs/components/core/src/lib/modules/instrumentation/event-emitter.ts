import { inject } from '@angular/core';

import { SKY_INSTRUMENTATION_CONTEXT } from './context-resolver';
import { SKY_INSTRUMENTATION_LISTENERS } from './event-listener';
import type { SkyInstrumentationUserEvent } from './event-types';

export interface SkyInstrumentationEmitter {
  emitUserEvent(eventName: string, eventDetail?: Record<string, unknown>): void;
}

export function injectSkyInstrumentationEmitter(): SkyInstrumentationEmitter {
  const context = inject(SKY_INSTRUMENTATION_CONTEXT, { optional: true });
  const listeners = inject(SKY_INSTRUMENTATION_LISTENERS, {
    optional: true,
  });

  return {
    emitUserEvent(
      eventName: string,
      eventDetail?: Record<string, unknown>,
    ): void {
      for (const listener of listeners ?? []) {
        listener.onEvent({
          context: context?.resolve(),
          eventName,
          eventDetail,
          eventType: 'user',
        } satisfies SkyInstrumentationUserEvent);
      }
    },
  };
}
