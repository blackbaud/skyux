import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyModalService } from '@skyux/modals';
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
  readonly #modalSvc = inject(SkyModalService);

  protected edit(): void {
    this.#modalSvc.open(ModalComponent);
  }
}

fdescribe('modal service', () => {
  let fixture: ComponentFixture<TestComponent>;
  let modalSvc: SkyModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalTestingModule, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    modalSvc = TestBed.inject(SkyModalService);
  });

  it('should open a modal', () => {
    const openSpy = spyOn(modalSvc, 'open');

    const btn = fixture.debugElement.query(
      By.css('[data-sky-id="my-modal-open-button"]')
    );

    btn.triggerEventHandler('click');
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledOnceWith(ModalComponent);
  });
});
