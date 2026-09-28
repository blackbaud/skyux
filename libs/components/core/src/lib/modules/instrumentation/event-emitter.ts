import { ErrorHandler, inject } from '@angular/core';

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
  const errorHandler = inject(ErrorHandler);
  const listeners = inject(SKY_INSTRUMENTATION_LISTENERS, {
    optional: true,
  });

  return {
    emit(eventName: string, eventDetail?: Record<string, unknown>): void {
      for (const listener of listeners ?? []) {
        // Listeners are application code, and measuring an interaction must
        // never break the component that reports it.
        try {
          listener.handleEvent({
            context: context?.resolve(),
            eventName,
            eventDetail,
          });
        } catch (err) {
          errorHandler.handleError(err);
        }
      }
    },
  };
}
