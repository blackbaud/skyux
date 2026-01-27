import { Component, Injectable, OnDestroy, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyModalError,
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { SkyModalTestingController } from './modal-testing.controller';
import { SkyModalTestingModule } from './modal-testing.module';

@Injectable()
class ModalTestContext {
  public data:
    | {
        value1: string;
      }
    | undefined;
}

@Component({
  imports: [SkyModalModule],
  template: `<form [formGroup]="demoForm" (submit)="saveForm()">
    <sky-modal [formErrors]="errors" [isDirty]="demoForm.dirty">
      <sky-modal-header> Modal title </sky-modal-header>
      <sky-modal-content>
        <input formControlName="value1" type="text" />
      </sky-modal-content>
      <sky-modal-footer>
        <button class="sky-btn sky-btn-primary" type="submit">Save</button>
        <button
          class="sky-btn sky-btn-link"
          type="button"
          (click)="cancelForm()"
        >
          Cancel
        </button>
      </sky-modal-footer>
    </sky-modal>
  </form> `,
})
class ModalTestComponent {
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  readonly #context = inject(ModalTestContext);
  readonly #instance = inject(SkyModalInstance);

  constructor() {
    this.demoForm = inject(FormBuilder).group({
      value1: new FormControl(this.#context.data?.value1),
    });
  }

  protected cancelForm(): void {
    this.#instance.cancel();
  }

  protected saveForm(): void {
    this.#instance.save({ filterValue: undefined });
  }
}

@Component({
  template: '',
})
class TestComponent implements OnDestroy {
  public hasErrors = false;

  protected errors: SkyModalError[] = [];

  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => i.close());
  }

  public getInstanceAt(index: number): SkyModalInstance | undefined {
    return this.#instances.at(index);
  }

  public openModal(): void {
    const instance = this.#modalSvc.open(ModalTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: { value1: 'Hello!' },
        },
      ],
    });

    instance.beforeClose.subscribe((handler) => {
      if (this.hasErrors && handler.closeArgs.reason !== 'cancel') {
        this.errors = [
          {
            message: 'Something bad happened.',
          },
        ];
      } else {
        handler.closeModal();
      }
    });

    this.#instances.push(instance);
  }
}

@Component({
  template: '',
})
class AnotherComponent {}

function setupTest(): {
  fixture: ComponentFixture<TestComponent>;
  modalController: SkyModalTestingController;
} {
  const fixture = TestBed.createComponent(TestComponent);
  const modalController = TestBed.inject(SkyModalTestingController);

  return { fixture, modalController };
}

describe('modal-testing.controller', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalTestingModule, TestComponent],
    });
  });

  it('should expect a modal to be open, close it, and expect none', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.detectChanges();

    modalController.expectCount(1);
    modalController.expectOpen(ModalTestComponent);
    modalController.closeTopModal();
    modalController.expectNone();
  });

  it('should close a modal with args', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.detectChanges();

    const closeSpy = spyOn(
      fixture.componentInstance.getInstanceAt(0)!,
      'close',
    ).and.callThrough();

    modalController.closeTopModal({ reason: 'save', data: { foo: 'bar' } });

    fixture.detectChanges();

    expect(closeSpy).toHaveBeenCalledWith({ foo: 'bar' }, 'save');
  });

  it('should throw if topmost modal does not match criteria', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.detectChanges();

    expect(() => modalController.expectOpen(AnotherComponent)).toThrowError(
      'Expected the topmost modal to be of type AnotherComponent, but it is of type ModalTestComponent.',
    );
  });

  it('should throw if expecting a modal open but none are open', () => {
    const { fixture, modalController } = setupTest();

    fixture.detectChanges();

    expect(() => modalController.expectOpen(ModalTestComponent)).toThrowError(
      'A modal is expected to be open, but no modals are open.',
    );
  });

  it('should throw if closing a non-existent modal', () => {
    const { fixture, modalController } = setupTest();

    fixture.detectChanges();

    expect(() => modalController.closeTopModal()).toThrowError(
      'Expected to close the topmost modal, but no modals are open.',
    );
  });

  it('should throw if expecting the wrong number of open modals', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.detectChanges();

    expect(() => modalController.expectCount(5)).toThrowError(
      'Expected 5 open modals, but 1 is open.',
    );

    fixture.componentInstance.openModal();
    fixture.detectChanges();

    expect(() => modalController.expectCount(1)).toThrowError(
      'Expected 1 open modal, but 2 are open.',
    );
  });

  it('should throw if expecting no modals but some are opened', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.componentInstance.openModal();
    fixture.detectChanges();

    expect(() => modalController.expectNone()).toThrowError(
      'Expected no modals to be open, but there are 2 open.',
    );

    modalController.closeTopModal();
    fixture.detectChanges();

    expect(() => modalController.expectNone()).toThrowError(
      'Expected no modals to be open, but there is 1 open.',
    );
  });

  it('should respect beforeClose event', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.componentInstance.hasErrors = true;
    fixture.detectChanges();

    modalController.closeTopModal({ data: {}, reason: 'save' });

    expect(() => modalController.expectNone()).toThrowError(
      'Expected no modals to be open, but there is 1 open.',
    );
  });
});
