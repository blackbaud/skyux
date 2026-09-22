import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../context';
import { injectSkyInstrumentationEventEmitter } from '../event-emitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-button',
  template: ` <button type="button" (click)="doSomething()">Click me</button> `,
})
export class TestButton {
  readonly #instr = injectSkyInstrumentationEventEmitter();

  protected doSomething(): void {
    this.#instr.emitUserEvent('foo.bar');
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestButton],
  template: `
    <div [skyInstrumentationContext]="context">
      <test-button />
    </div>
  `,
})
export class TestButtonHost {
  public readonly context = { productId: 'foo123' };
}
