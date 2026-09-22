import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyInstrumentationContext } from '../context';
import { _injectSkyInstrumentationEmitter } from '../event-emitter';
import { SkyInstrumentationContextValue } from '../event-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-button',
  template: ` <button type="button" (click)="doSomething()">Click me</button> `,
})
export class TestButton {
  readonly #instr = _injectSkyInstrumentationEmitter();

  protected doSomething(): void {
    this.#instr.emit('foo.bar');
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
  public context: SkyInstrumentationContextValue = {
    name: 'products',
    detail: { productId: 'foo123' },
  };
}
