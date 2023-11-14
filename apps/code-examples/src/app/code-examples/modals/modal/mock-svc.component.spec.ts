import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';
import { SkyModalTestingModule } from '@skyux/modals/testing';

import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  template: `<button
    data-sky-id="my-modal-open-button"
    type="button"
    (click)="edit()"
  >
    Edit...
  </button>`,
})
class TestComponent {
  public modalOpen = false;

  readonly #modalSvc = inject(SkyModalService);

  protected edit(): void {
    const instance = this.#modalSvc.open(ModalComponent);

    // Used to test state changes caused by a modal closing.
    this.modalOpen = true;
    instance.closed.subscribe(() => {
      this.modalOpen = false;
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

    expect(fixture.componentInstance.modalOpen).toEqual(false);

    const modalInstance = new SkyModalInstance();
    const openSpy = spyOn(modalSvc, 'open').and.returnValue(modalInstance);

    // Open the modal.
    fixture.debugElement
      .query(By.css('[data-sky-id="my-modal-open-button"]'))
      .triggerEventHandler('click');
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledOnceWith(ModalComponent);
    expect(fixture.componentInstance.modalOpen).toEqual(true);

    // Close the modal.
    modalInstance.close();
    fixture.detectChanges();

    expect(fixture.componentInstance.modalOpen).toEqual(false);
  });
});
