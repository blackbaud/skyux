import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
} from '@skyux/modals/testing';

import { DemoComponent } from './demo.component';

describe('Testing with SkyConfirmTestingController', () => {
  async function setupTest(): Promise<{
    confirmController: SkyConfirmTestingController;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const confirmController = TestBed.inject(SkyConfirmTestingController);
    const fixture = TestBed.createComponent(DemoComponent);

    return { confirmController, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyConfirmTestingModule, DemoComponent],
    });
  });

  it('should click "OK" on a confirmation dialog', async () => {
    const { confirmController, fixture } = await setupTest();

    fixture.componentInstance.launchConfirm();
    fixture.detectChanges();

    confirmController.expectOpen({
      message: 'Are you sure?',
    });

    confirmController.ok();
    confirmController.expectNone();

    expect(fixture.componentInstance.selectedAction).toEqual('ok');
  });

  it('should cancel the confirmation dialog', async () => {
    const { confirmController, fixture } = await setupTest();

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
