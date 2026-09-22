import { inject } from '@angular/core';

import { SKY_INSTRUMENTATION_CONTEXT } from './context-resolver';
import { SKY_INSTRUMENTATION_LISTENERS } from './event-listener';

/**
 * @internal
 */
export interface _SkyInstrumentationEmitter {
  emit(eventName: string, eventDetail?: Record<string, unknown>): void;
}

/**
 * @internal
 */
export function _injectSkyInstrumentationEmitter(): _SkyInstrumentationEmitter {
  const context = inject(SKY_INSTRUMENTATION_CONTEXT, { optional: true });
  const listeners = inject(SKY_INSTRUMENTATION_LISTENERS, {
    optional: true,
  });

  return {
    emit(eventName: string, eventDetail?: Record<string, unknown>): void {
      for (const listener of listeners ?? []) {
        listener.onEvent({
          context: context?.resolve(),
          eventName,
          eventDetail,
        });
      }
    },
  };
}
