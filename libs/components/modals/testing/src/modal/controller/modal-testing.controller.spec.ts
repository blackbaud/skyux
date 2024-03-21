/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
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

  public sayHello(): void {
    console.log('Hello, world.');
  }
}

@Component({
  imports: [],
  standalone: true,
  template: ``,
})
class TestComponent implements OnInit {
  readonly #modalSvc = inject(SkyModalService);

  public ngOnInit(): void {
    const instance = this.#modalSvc.open(ModalTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: { value1: 'Hello!' },
        },
      ],
    });

    instance.componentInstance.sayHello();

    instance.closed.subscribe((x) => {
      console.log('closed:', x);
    });
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

fdescribe('modal-testing.controller', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalTestingModule, TestComponent],
    });
  });

  it('should expect a modal to be open, close it, and expect none', () => {
    const { fixture, modalController } = setupTest();

    fixture.detectChanges();

    expect(modalController.count()).toEqual(1);

    modalController.expectTopmostOpen(ModalTestComponent);
    modalController.closeTopmost();
    modalController.expectNone();
  });
});
