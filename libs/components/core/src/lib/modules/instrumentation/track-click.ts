import { Directive, inject, input } from '@angular/core';
import { SKY_INSTRUMENTATION_CONTEXT } from './context-resolver';
import { SKY_INSTRUMENTATION_LISTENERS } from './event-listener';

@Directive({
  host: {
    '(click)': 'emit()',
  },
  selector: '[skyInstrumentationTrackClick]',
})
export class SkyInstrumentationTrackClick {
  readonly #context = inject(SKY_INSTRUMENTATION_CONTEXT, { optional: true });
  readonly #listeners = inject(SKY_INSTRUMENTATION_LISTENERS, {
    optional: true,
  });

  public readonly skyInstrumentationEventName = input.required<string>();
  public readonly skyInstrumentationEventDetail =
    input<Record<string, unknown>>();

  protected emit(): void {
    for (const listener of this.#listeners ?? []) {
      listener.onEvent({
        context: this.#context?.resolve(),
        eventName: this.skyInstrumentationEventName(),
        eventDetail: this.skyInstrumentationEventDetail(),
        eventType: 'user',
      });
    }
  }
}
