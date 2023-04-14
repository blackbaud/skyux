import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { ModalWaitComponent } from './modal-wait.component';
import { ModalWaitModule } from './modal-wait.module';

describe('Modals with wait', () => {
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
    fixture.detectChanges;
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

  it('should not place aria-owns on the modal if the live announcer has not been used via a wait', () => {
    openModal();
    const modalDialogElement = getModalDialog();

    expect(modalDialogElement?.getAttribute('aria-owns')).toBeNull();
  });

  it('should aria-owns on the modal if the live announcer has been used via an external wait', () => {
    triggerPageWait();
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();

    openModal();

    const modalDialogElement = getModalDialog();

    if (!SkyLiveAnnouncerService.announcerElement?.id) {
      fail('The page wait should have set an announcer element');
      return;
    }

    expect(modalDialogElement?.getAttribute('aria-owns')).toBe(
      SkyLiveAnnouncerService.announcerElement.id
    );
  });

  it('should aria-owns on the modal if the live announcer has been used via an external wait', () => {
    openModal();

    let modalDialogElement = getModalDialog();

    expect(modalDialogElement?.getAttribute('aria-owns')).toBeNull();

    triggerModalWait();
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();

    modalDialogElement = getModalDialog();

    if (!SkyLiveAnnouncerService.announcerElement?.id) {
      fail('The page wait should have set an announcer element');
      return;
    }

    expect(modalDialogElement?.getAttribute('aria-owns')).toBe(
      SkyLiveAnnouncerService.announcerElement.id
    );
  });
});
