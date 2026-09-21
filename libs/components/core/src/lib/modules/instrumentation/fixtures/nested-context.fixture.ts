import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../instrumentation-context';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext],
  template: `
    <div [skyInstrumentationContext]="{ productId: 'foo123' }">
      <div
        #instrumentation="skyInstrumentationContext"
        [skyInstrumentationContext]="{ recordId: 'bar456' }"
      >
        <button
          type="button"
          (click)="instrumentation.emitUserEvent('foo.bar')"
        >
          Click me
        </button>
      </div>
    </div>
  `,
})
export class NestedContextTest {}
