import {
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ApplicationRef
} from '@angular/core';

import {
  SkyModalInstance
} from './modal-instance';

import {
  SkyModalService
} from './modal.service';

import {
  SkyModalModule
} from './modal.module';

import {
  SkyModalFixturesModule
} from './fixtures/modal-fixtures.module';

import {
  ModalTestValues
} from './fixtures/modal-values.fixture';

import {
  ModalTestComponent
} from './fixtures/modal.component.fixture';

import {
  ModalWithValuesTestComponent
} from './fixtures/modal-with-values.component.fixture';

describe('Modal service', () => {
  let modalService: SkyModalService;
  let applicationRef: ApplicationRef;

  function openModal(modalType: any, config?: Object) {
    let modalInstance = modalService.open(modalType, config);

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
      imports: [
        SkyModalModule,
        SkyModalFixturesModule
      ]
    });
  });

  beforeEach(
    inject(
      [
        SkyModalService,
        ApplicationRef
      ],
      (
        _modalService: SkyModalService,
        _applicationRef: ApplicationRef
      ) => {
        modalService = _modalService;
        applicationRef = _applicationRef;
      }
    )
  );

  afterEach(() => {
    // NOTE: This is important as it ensures that the modal host component is fully disposed of
    // between tests. This is important as the modal host might need a different set of component
    // injectors than the previous test.
    modalService.dispose();
  });

  it('should show a modal and return an instance that can then be closed', fakeAsync(() => {
    let modalInstance = openModal(ModalTestComponent);
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
    let modalInstance = openModal(ModalTestComponent);
    let modalInstance2 = openModal(ModalTestComponent);
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
    let modalInstance = openModal(ModalTestComponent, { 'fullPage': false });
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).not.toHaveCssClass('sky-modal-body-full-page');

    closeModal(modalInstance);

    modalInstance = openModal(ModalTestComponent, { 'fullPage': true });
    expect(document.body).toHaveCssClass('sky-modal-body-open');
    expect(document.body).toHaveCssClass('sky-modal-body-full-page');

    closeModal(modalInstance);
  }));

  it('should remove the sky-modal-body-full-page only when all fullPage modals are closed.',
    fakeAsync(() => {
      let modalInstance = openModal(ModalTestComponent, { 'fullPage': false });
      let modalInstance1 = openModal(ModalTestComponent, { 'fullPage': false });
      let fullPageModal = openModal(ModalTestComponent, { 'fullPage': true });
      let fullPageModal2 = openModal(ModalTestComponent, { 'fullPage': true });

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
    })
  );

  it('should pass a "close" reason to the closed subscription when modal close button clicked',
  fakeAsync(() => {
    let modalInstance = openModal(ModalTestComponent);
    modalInstance.closed.subscribe((result: any) => {
      expect(result.reason).toEqual('close');
      expect(result.data).toBeUndefined();
    });

    applicationRef.tick();
    (document.body.querySelector('.sky-modal-btn-close') as HTMLElement).click();
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

    let modalInstance1 = openModal(ModalTestComponent);

    validateModalCount(1);

    let modalInstance2 = openModal(ModalTestComponent);

    validateModalCount(2);

    closeModal(modalInstance1);
    closeModal(modalInstance2);

    validateModalCount(0);
  }));

  it('should allow data to be passed to the modal component when opened', fakeAsync(() => {
    let modalInstance = openModal(ModalWithValuesTestComponent, [
      {
        provide: ModalTestValues,
        useValue: {
          valueA: 'A'
        }
      }
    ]);

    expect(modalInstance.componentInstance.values.valueA).toBe('A');

    closeModal(modalInstance);
  }));
});
