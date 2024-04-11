import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

import { DemoComponent } from './demo.component';
import { ModalComponent } from './modal.component';

describe('Modal demo using testing controller', () => {
  function setupTest(): {
    fixture: ComponentFixture<DemoComponent>;
    modalController: SkyModalTestingController;
  } {
    const fixture = TestBed.createComponent(DemoComponent);
    const modalController = TestBed.inject(SkyModalTestingController);

    return { fixture, modalController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalTestingModule, DemoComponent],
    });
  });

  it('should expect a modal to be open, close it, and expect none', () => {
    const { fixture, modalController } = setupTest();

    fixture.componentInstance.openModal();
    fixture.detectChanges();

    modalController.expectCount(1);
    modalController.expectOpen(ModalComponent);
    modalController.closeTopModal({
      data: {},
      reason: 'save',
    });
    modalController.expectNone();
  });
});
