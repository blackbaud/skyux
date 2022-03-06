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

  beforeEach(() => {
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

  afterEach(() => {
    // NOTE: This is important as it ensures that the modal host component is fully disposed of
    // between tests. This is important as the modal host might need a different set of component
    // injectors than the previous test.
    modalService.dispose();
  });

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
    openModal(ModalTestComponent, { wrapperClass });
    applicationRef.tick();

    expect(document.body.querySelector(`sky-modal.${wrapperClass}`)).toExist();
  }));
});
