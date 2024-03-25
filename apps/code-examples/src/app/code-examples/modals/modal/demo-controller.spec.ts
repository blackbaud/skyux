import { Component, Injectable, OnDestroy, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyModalError,
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

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
    <sky-modal>
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
}

@Component({
  imports: [],
  standalone: true,
  template: ``,
})
class TestComponent implements OnDestroy {
  public hasErrors = false;

  protected errors: SkyModalError[] = [];

  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

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

describe('Modal demo using testing controller', () => {
  function setupTest(): {
    fixture: ComponentFixture<TestComponent>;
    modalController: SkyModalTestingController;
  } {
    const fixture = TestBed.createComponent(TestComponent);
    const modalController = TestBed.inject(SkyModalTestingController);

    return { fixture, modalController };
  }

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
});
