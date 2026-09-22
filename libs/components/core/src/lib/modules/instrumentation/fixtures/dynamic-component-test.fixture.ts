import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  inject,
  Injector,
  input,
} from '@angular/core';
import { SkyDynamicComponentService } from '../../dynamic-component/dynamic-component.service';
import { SkyInstrumentationContext } from '../context';
import { provideSkyInstrumentationContextFrom } from '../context-provider';
import { injectSkyInstrumentationEventEmitter } from '../event-emitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-dynamic-form',
  template: `
    <div data-sky-id="test-dynamic-form">
      <button type="button" (click)="save()">Save</button>
    </div>
  `,
})
class TestDynamicForm {
  readonly #instr = injectSkyInstrumentationEventEmitter();

  protected save(): void {
    this.#instr.emitUserEvent('form.saved', { user: 'foo' });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-dynamic-launcher',
  template: ` <button type="button" (click)="launchForm()">Open form</button> `,
})
class TestDynamicLauncher {
  readonly #destroyRef = inject(DestroyRef);
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #injector = inject(Injector);

  #formRef: ComponentRef<TestDynamicForm> | undefined;

  public readonly forwardContext = input(true);

  constructor() {
    this.#destroyRef.onDestroy(() => {
      if (this.#formRef) {
        this.#dynamicComponentSvc.removeComponent(this.#formRef);
        this.#formRef = undefined;
      }
    });
  }

  protected launchForm(): void {
    this.#formRef = this.#dynamicComponentSvc.createComponent(TestDynamicForm, {
      providers: this.forwardContext()
        ? provideSkyInstrumentationContextFrom(this.#injector)
        : [],
    });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestDynamicLauncher],
  selector: 'test-dynamic-launcher-host',
  template: `
    <div [skyInstrumentationContext]="{ productId: 'foo123' }">
      <test-dynamic-launcher [forwardContext]="forwardContext()" />
    </div>
  `,
})
export class TestDynamicLauncherHost {
  public readonly forwardContext = input(true);
}
