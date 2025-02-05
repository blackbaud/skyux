import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

import { ModalsModalBasicWithControllerExampleComponent } from './example.component';
import { ModalComponent } from './modal.component';

describe('Modal example using testing controller', () => {
  function setupTest(): {
    fixture: ComponentFixture<ModalsModalBasicWithControllerExampleComponent>;
    modalController: SkyModalTestingController;
  } {
    const fixture = TestBed.createComponent(
      ModalsModalBasicWithControllerExampleComponent,
    );
    const modalController = TestBed.inject(SkyModalTestingController);

    return { fixture, modalController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyModalTestingModule,
        ModalsModalBasicWithControllerExampleComponent,
      ],
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
