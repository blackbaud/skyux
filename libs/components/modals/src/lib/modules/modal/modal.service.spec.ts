import { ApplicationRef } from '@angular/core';
import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyModalFixturesModule } from './fixtures/modal-fixtures.module';
import { ModalTestValues } from './fixtures/modal-values.fixture';
import { ModalWithValuesTestComponent } from './fixtures/modal-with-values.component.fixture';
import { ModalTestComponent } from './fixtures/modal.component.fixture';
import { SkyModalInstance } from './modal-instance';
import { SkyModalModule } from './modal.module';
import { SkyModalService } from './modal.service';

describe('Modal service', () => {
  let modalService: SkyModalService;
  let applicationRef: ApplicationRef;

  function openModal<T>(modalType: T, config?: Record<string, any>) {
    const modalInstance = modalService.open(modalType, config);

    tick();

    return modalInstance;
  }

  function closeModal(modalInstance: SkyModalInstance) {
    modalInstance.close();
    tick();
    applicationRef.tick();
  }

  function getModalEls() {
    return document.querySelectorAll('sky-test-cmp');
  }

  beforeEach(() => {
    // Confirm that each test starts without a modal host component.
    const modalHosts = document.querySelectorAll('sky-modal-host');
    expect(modalHosts.length).toEqual(0);

    TestBed.configureTestingModule({
      imports: [SkyModalModule, SkyModalFixturesModule],
    });
  });

  beforeEach(inject(
    [SkyModalService, ApplicationRef],
    (_modalService: SkyModalService, _applicationRef: ApplicationRef) => {
      modalService = _modalService;
      applicationRef = _applicationRef;
    }
  ));

  it('should show a modal and return an instance that can then be closed', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);
    applicationRef.tick();

    expect(document.body.querySelector('.sky-modal')).toExist();
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    closeModal(modalInstance);
    tick();
    applicationRef.tick();

    expect(document.body.querySelector('.sky-modal')).not.toExist();
    expect(document.body).not.toHaveCssClass('sky-modal-body-open');
  }));

  it('should show multiple modals and return an instances.', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);
    const modalInstance2 = openModal(ModalTestComponent);
    applicationRef.tick();

    expect(document.body.querySelector('.sky-modal')).toExist();
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    closeModal(modalInstance);
    tick();
    applicationRef.tick();

    expect(document.body.querySelector('.sky-modal')).toExist();
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    closeModal(modalInstance2);
    tick();
    applicationRef.tick();

    expect(document.body.querySelector('.sky-modal')).not.toExist();
    expect(document.body).not.toHaveCssClass('sky-modal-body-open');
  }));

  it('should add the sky-modal-body-full-page class to the body', fakeAsync(() => {
    let modalInstance = openModal(ModalTestComponent, { fullPage: false });
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).not.toHaveCssClass('sky-modal-body-full-page');

    closeModal(modalInstance);

    modalInstance = openModal(ModalTestComponent, { fullPage: true });
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).toHaveCssClass('sky-modal-body-full-page');

    closeModal(modalInstance);
  }));

  it('should remove the sky-modal-body-full-page only when all fullPage modals are closed.', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: false });
    const modalInstance1 = openModal(ModalTestComponent, { fullPage: false });
    const fullPageModal = openModal(ModalTestComponent, { fullPage: true });
    const fullPageModal2 = openModal(ModalTestComponent, { fullPage: true });

    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).toHaveCssClass('sky-modal-body-full-page');

    closeModal(modalInstance);
    closeModal(fullPageModal);

    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).toHaveCssClass('sky-modal-body-full-page');

    closeModal(modalInstance1);

    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).toHaveCssClass('sky-modal-body-full-page');

    closeModal(fullPageModal2);

    expect(document.body).not.toHaveCssClass('sky-modal-body-open');
    expect(document.body).not.toHaveCssClass('sky-modal-body-full-page');
  }));

  it('should pass a "close" reason to the closed subscription when modal close button clicked', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);
    modalInstance.closed.subscribe((result: any) => {
      expect(result.reason).toEqual('close');
      expect(result.data).toBeUndefined();
    });

    applicationRef.tick();
    (
      document.body.querySelector('.sky-modal-btn-close') as HTMLElement
    ).click();
    tick();
    applicationRef.tick();
  }));

  it('should reuse the same modal host container for all modals', fakeAsync(() => {
    function validateModalCount(modalCount: number) {
      expect(document.body.querySelectorAll('sky-modal-host').length).toBe(1);

      expect(
        document.body.querySelectorAll('sky-modal-host sky-test-cmp').length
      ).toBe(modalCount);
    }

    const modalInstance1 = openModal(ModalTestComponent);

    validateModalCount(1);

    const modalInstance2 = openModal(ModalTestComponent);

    validateModalCount(2);

    closeModal(modalInstance1);
    closeModal(modalInstance2);

    validateModalCount(0);
  }));

  it('should allow data to be passed to the modal component when opened', fakeAsync(() => {
    const modalInstance = openModal(ModalWithValuesTestComponent, [
      {
        provide: ModalTestValues,
        useValue: {
          valueA: 'A',
        },
      },
    ]);

    expect(modalInstance.componentInstance.values.valueA).toBe('A');

    closeModal(modalInstance);
  }));

  it('should show a modal with a wrapper class', fakeAsync(() => {
    const wrapperClass = 'custom-wrapper-class';
    const modal = openModal(ModalTestComponent, { wrapperClass });
    applicationRef.tick();

    expect(document.body.querySelector(`sky-modal.${wrapperClass}`)).toExist();
    closeModal(modal);
  }));

  describe('accessibility', () => {
    it('should not hide modal host from screen readers when opening a modal', fakeAsync(() => {
      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(
        document.querySelector('sky-modal-host')?.getAttribute('aria-hidden')
      ).toBe(null);
      closeModal(modal);
    }));

    it('should hide and unhide elements at the host level from screen readers', fakeAsync(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(div.getAttribute('aria-hidden')).toBe('true');

      closeModal(modal);

      expect(div.getAttribute('aria-hidden')).toBe(null);
      div.remove();
    }));

    it('should keep hidden status elements at the host level consistent', fakeAsync(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.setAttribute('aria-hidden', 'true');

      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(div.getAttribute('aria-hidden')).toBe('true');

      closeModal(modal);

      expect(div.getAttribute('aria-hidden')).toBe('true');
      div.remove();
    }));

    it('should not hide host siblings that are live', fakeAsync(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.setAttribute('aria-live', 'true');

      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(div.getAttribute('aria-hidden')).toBe(null);
      div.remove();
      closeModal(modal);
    }));

    it('should not modify siblings if they have been removed from the DOM before the modal closes', fakeAsync(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const previousAriaHidden = 'bingBong';

      div.setAttribute('aria-hidden', previousAriaHidden);

      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(div.getAttribute('aria-hidden')).toBeTruthy();

      div.remove();

      closeModal(modal);
      expect(div.getAttribute('aria-hidden')).not.toBe(previousAriaHidden);
    }));

    it('should keep sibling modals hidden when non top modal closes', fakeAsync(() => {
      const firstModal = openModal(ModalTestComponent, { fullPage: false });
      const secondModal = openModal(ModalTestComponent, { fullPage: false });
      const modalsList = getModalEls();
      modalsList.item(0).id = 'firstModal';
      modalsList.item(1).id = 'secondModal';

      const topModal = openModal(ModalTestComponent, { fullPage: false });

      expect(
        document.getElementById('firstModal')?.getAttribute('aria-hidden')
      ).toBe('true');

      closeModal(secondModal);

      expect(
        document.getElementById('firstModal')?.getAttribute('aria-hidden')
      ).toBe('true');

      closeModal(firstModal);
      closeModal(topModal);
    }));

    it('should unhide the correct modal when the top modal closes', fakeAsync(() => {
      const lowerModal = openModal(ModalTestComponent, { fullPage: false });
      const middleModal = openModal(ModalTestComponent, { fullPage: false });
      const topModal = openModal(ModalTestComponent, { fullPage: false });
      const modalsList = getModalEls();
      modalsList.item(0).id = 'lowerModal';

      closeModal(middleModal);
      closeModal(topModal);

      expect(
        document.getElementById('lowerModal')?.getAttribute('aria-hidden')
      ).toBe(null);

      closeModal(lowerModal);
    }));

    it('should hide and unhide modal siblings from screen readers', fakeAsync(() => {
      const siblingModal = openModal(ModalTestComponent, { fullPage: false });
      const modal = openModal(ModalTestComponent, { fullPage: false });
      const modalsList = getModalEls();
      modalsList.item(0).id = 'sibling';

      expect(
        document.getElementById('sibling')?.getAttribute('aria-hidden')
      ).toBe('true');

      closeModal(modal);
      expect(
        document.getElementById('sibling')?.getAttribute('aria-hidden')
      ).toBe(null);
      closeModal(siblingModal);
    }));

    it('should not hide live elements from screen readers', fakeAsync(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.setAttribute('aria-live', 'true');
      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(div.getAttribute('aria-hidden')).toBe(null);

      closeModal(modal);
      expect(div.getAttribute('aria-hidden')).toBe(null);
      div.remove();
    }));

    it('should not hide current modal from screen readers', fakeAsync(() => {
      const modal = openModal(ModalTestComponent, { fullPage: false });

      expect(
        document.querySelector('sky-test-cmp')?.getAttribute('aria-hidden')
      ).toBe(null);

      closeModal(modal);
    }));
  });
});
