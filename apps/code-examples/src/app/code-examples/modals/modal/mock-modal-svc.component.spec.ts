/**
 * Note: This spec demonstrates how to mock out the `SkyModalService`
 * and spy on calls to its methods.
 */
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';
import { SkyModalTestingModule } from '@skyux/modals/testing';

import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  template: `<button
    class="sky-btn"
    data-sky-id="my-modal-open-button"
    type="button"
    (click)="edit()"
  >
    Edit...
  </button>`,
})
class TestComponent {
  public modalClosedReason: string | undefined;

  readonly #modalSvc = inject(SkyModalService);

  protected edit(): void {
    const instance = this.#modalSvc.open(ModalComponent);

    instance.closed.subscribe((args) => {
      this.modalClosedReason = args.reason;
    });
  }
}

describe('Modal service', () => {
  function setupTest(): {
    fixture: ComponentFixture<TestComponent>;
    modalSvc: SkyModalService;
  } {
    const fixture = TestBed.createComponent(TestComponent);
    const modalSvc = TestBed.inject(SkyModalService);

    return { fixture, modalSvc };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalTestingModule, TestComponent],
    });
  });

  it('should open and close a modal', () => {
    const { fixture, modalSvc } = setupTest();

    const modalInstance = new SkyModalInstance();
    const openSpy = spyOn(modalSvc, 'open').and.returnValue(modalInstance);

    // Open the modal.
    fixture.debugElement
      .query(By.css('[data-sky-id="my-modal-open-button"]'))
      .triggerEventHandler('click');
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledOnceWith(ModalComponent);

    // Close the modal.
    modalInstance.close(undefined, 'save');
    fixture.detectChanges();

    expect(fixture.componentInstance.modalClosedReason).toEqual('save');
  });
});
