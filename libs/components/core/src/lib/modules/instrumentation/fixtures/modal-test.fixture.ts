import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
} from '@angular/core';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';
import {
  provideSkyInstrumentationContextFrom,
  SkyInstrumentationContext,
} from '../instrumentation-context';
import { createSkyInstrumentationUserEventEmitter } from '../user-event-emitter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule],
  selector: 'test-modal',
  template: `
    <sky-modal headingText="My form" data-sky-id="test-modal">
      <sky-modal-content> Modal content here. </sky-modal-content>
      <sky-modal-footer>
        <button class="sky-btn sky-btn-primary" type="button" (click)="save()">
          Save
        </button>
        <button class="sky-btn sky-btn-link" type="button" (click)="cancel()">
          Cancel
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
class TestModal {
  readonly #userEvt = createSkyInstrumentationUserEventEmitter();
  readonly #modal = inject(SkyModalInstance);

  protected save(): void {
    this.#userEvt.emit('modal.saved', { user: 'foo' });
    this.#modal.save();
  }

  protected cancel(): void {
    this.#modal.cancel();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'test-modal-launcher',
  template: ` <button type="button" (click)="openModal()">Open modal</button> `,
})
class TestModalLauncher {
  readonly #destroyRef = inject(DestroyRef);
  readonly #modalSvc = inject(SkyModalService);
  readonly #injector = inject(Injector);

  #modal: SkyModalInstance | undefined;

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.#modal?.close();
      this.#modal = undefined;
    });
  }

  protected openModal(): void {
    this.#modal = this.#modalSvc.open(TestModal, {
      providers: provideSkyInstrumentationContextFrom(this.#injector),
    });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyInstrumentationContext, TestModalLauncher],
  selector: 'test-modal-launcher-host',
  template: `
    <div [skyInstrumentationContext]="{ productId: 'foo123' }">
      <test-modal-launcher />
    </div>
  `,
})
export class TestModalLauncherHost {}
