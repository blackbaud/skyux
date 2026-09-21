import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../instrumentation-context';
import { TestButton } from './user-event-test.fixture';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestButton],
  template: `
    <div [skyInstrumentationContext]="{ productId: 'foo123' }">
      <div [skyInstrumentationContext]="{ recordId: 'bar456' }">
        <test-button />
      </div>
    </div>
  `,
})
export class NestedContextTest {}
