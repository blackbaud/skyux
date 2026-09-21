import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../instrumentation-context';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext],
  template: `
    <div
      #instrumentation="skyInstrumentationContext"
      [skyInstrumentationContext]="{ productId: 'foo123' }"
    >
      <button
        type="button"
        (click)="instrumentation.emitUserEvent('foo.bar', { user: 'foo' })"
      >
        Click me
      </button>
    </div>
  `,
})
export class SameTemplateTest {}
