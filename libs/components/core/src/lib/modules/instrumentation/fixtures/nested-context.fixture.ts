import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../context';
import { TestButton } from './user-event-test.fixture';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestButton],
  template: `
    <div
      [skyInstrumentationContext]="{
        name: 'products',
        detail: { productId: 'foo123' },
      }"
    >
      <div
        [skyInstrumentationContext]="{
          name: 'product-details',
          detail: { recordId: 'bar456' },
        }"
      >
        <test-button />
      </div>
    </div>
  `,
})
export class NestedContextTest {}
