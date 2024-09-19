import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { ModalWaitComponent } from './modal-wait.component';
import { ModalWaitModule } from './modal-wait.module';

describe('Modals with wait', () => {
  function checkAriaOwns(): void {
    const modalDialogElement = getModalDialog();

    const liveAnnouncerElement = document.querySelector(
      '.sky-live-announcer-element',
    );

    expect(liveAnnouncerElement)
      .withContext(
        'Announcer element should have been set when live announcer was injected',
      )
      .toBeTruthy();
    expect(modalDialogElement?.getAttribute('aria-owns')).toBe(
      liveAnnouncerElement?.id,
    );
  }

  function closeModal(): void {
    getModalCloseButton()?.click();
    fixture.detectChanges();
  }

  function getModalCloseButton(): HTMLElement | null {
    return document.querySelector('#modal-wait-modal-close');
  }

  function getModalDialog(): HTMLElement | null {
    return document.querySelector('.sky-modal-dialog');
  }

  function getModalTrigger(): HTMLElement | null {
    return document.querySelector('#modal-wait-modal-trigger');
  }

  function getModalWaitTrigger(): HTMLElement | null {
    return document.querySelector('#modal-wait-modal-wait-trigger');
  }

  function getPageWaitTrigger(): HTMLElement | null {
    return document.querySelector('#modal-wait-wait-trigger');
  }

  function triggerModalWait(): void {
    getModalWaitTrigger()?.click();
  }

  function triggerPageWait(): void {
    getPageWaitTrigger()?.click();
  }

  function openModal(): void {
    getModalTrigger()?.click();
  }

  let fixture: ComponentFixture<ModalWaitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalWaitModule],
    });

    fixture = TestBed.createComponent(ModalWaitComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    closeModal();
    TestBed.inject(SkyLiveAnnouncerService).ngOnDestroy();
  });

  // The `aria-owns` is placed on the modal due to the live announcer being injected into the modal service.
  it('should place aria-owns on the modal if the live announcer has not been used via a wait', () => {
    openModal();
    checkAriaOwns();
  });

  it('should add aria-owns to the modal if the live announcer has been used via an external wait', () => {
    triggerPageWait();
    fixture.detectChanges();

    openModal();

    checkAriaOwns();
  });

  it('should add aria-owns to the modal if the live announcer has been used via an internal wait', () => {
    openModal();

    triggerModalWait();
    fixture.detectChanges();

    checkAriaOwns();
  });
});
