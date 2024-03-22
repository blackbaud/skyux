/* eslint-disable @nx/enforce-module-boundaries */
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
  standalone: true,
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
    this.#instance.save({});
  }

  public sayHello(): void {
    console.log('Hello, world.');
  }
}

@Component({
  imports: [],
  standalone: true,
  template: ``,
})
class TestComponent implements OnDestroy {
  public hasErrors = false;
  protected errors: SkyModalError[] = [];
  readonly #modalSvc = inject(SkyModalService);
  readonly #instances: SkyModalInstance[] = [];

  // public ngOnInit(): void {
  //   const instance = this.#modalSvc.open(ModalTestComponent, {
  //     providers: [
  //       {
  //         provide: ModalTestContext,
  //         useValue: { value1: 'Hello!' },
  //       },
  //     ],
  //   });

  //   instance.componentInstance.sayHello();

  //   instance.closed.subscribe((x) => {
  //     console.log('closed:', x);
  //   });
  // }

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => i.close());
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
            message:
              "Sample error that's really long so it takes up two lines. More text just to ensure text wrap.",
          },
          { message: 'Sample error 2' },
        ];
      } else {
        handler.closeModal();
      }
    });

    this.#instances.push(instance);
  }
}

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

    expect(modalController.count()).toEqual(1);

    modalController.expectTopmostOpen(ModalTestComponent);
    modalController.closeTopmost();
    modalController.expectNone();
  });

  it('should throw if closing a non-existent modal', () => {
    const { fixture, modalController } = setupTest();

    fixture.detectChanges();

    expect(() => modalController.closeTopmost()).toThrowError(
      'Expected to close the topmost modal, but no modals are open.',
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

    modalController.closeTopmost();
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

    modalController.closeTopmost({ data: {}, reason: 'save' });

    expect(() => modalController.expectNone()).toThrowError(
      'Expected no modals to be open, but there is 1 open.',
    );
  });
});
