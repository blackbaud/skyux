import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
} from '@skyux/modals/testing';

import { ModalsConfirmBasicWithControllerExampleComponent } from './example.component';

describe('Testing with SkyConfirmTestingController', () => {
  function setupTest(): {
    confirmController: SkyConfirmTestingController;
    fixture: ComponentFixture<ModalsConfirmBasicWithControllerExampleComponent>;
  } {
    const confirmController = TestBed.inject(SkyConfirmTestingController);
    const fixture = TestBed.createComponent(
      ModalsConfirmBasicWithControllerExampleComponent,
    );

    return { confirmController, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyConfirmTestingModule,
        ModalsConfirmBasicWithControllerExampleComponent,
      ],
    });
  });

  it('should click "OK" on a confirmation dialog', () => {
    const { confirmController, fixture } = setupTest();

    fixture.componentInstance.launchConfirm();
    fixture.detectChanges();

    confirmController.expectOpen({
      message: 'Are you sure?',
    });

    confirmController.ok();
    confirmController.expectNone();

    expect(fixture.componentInstance.selectedAction).toEqual('ok');
  });

  it('should cancel the confirmation dialog', () => {
    const { confirmController, fixture } = setupTest();

    fixture.componentInstance.launchConfirm();
    fixture.detectChanges();

    confirmController.expectOpen({
      message: 'Are you sure?',
    });

    confirmController.cancel();
    confirmController.expectNone();

    expect(fixture.componentInstance.selectedAction).toEqual('cancel');
  });
});
