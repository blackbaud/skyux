import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../instrumentation-context';
import { createSkyInstrumentationUserEventEmitter } from '../user-event-emitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-button',
  template: ` <button type="button" (click)="doSomething()">Click me</button> `,
})
class TestButton {
  readonly #userEvt = createSkyInstrumentationUserEventEmitter();

  protected doSomething(): void {
    this.#userEvt.emit('foo.bar');
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestButton],
  template: `
    <div [skyInstrumentationContext]="{ productId: 'foo123' }">
      <test-button />
    </div>
  `,
})
export class TestButtonHost {}
