import { Component, OnDestroy, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyConfirmInstance, SkyConfirmService } from '@skyux/modals';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
} from '@skyux/modals/testing';

@Component({
  imports: [],
  standalone: true,
  template: ``,
})
class TestComponent implements OnDestroy {
  readonly #confirmSvc = inject(SkyConfirmService);

  #confirmInstance: SkyConfirmInstance | undefined;

  public launchConfirm(): void {
    this.#confirmInstance = this.#confirmSvc.open({
      message: 'Are you sure?',
    });
  }

  public ngOnDestroy(): void {
    if (this.#confirmInstance) {
      this.#confirmInstance.close({
        action: 'cancel',
      });

      this.#confirmInstance = undefined;
    }
  }
}

describe('Confirm demo using testing controller', () => {
  async function setupTest(): Promise<{
    confirmController: SkyConfirmTestingController;
    fixture: ComponentFixture<TestComponent>;
  }> {
    const confirmController = TestBed.inject(SkyConfirmTestingController);
    const fixture = TestBed.createComponent(TestComponent);

    return { confirmController, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyConfirmTestingModule, TestComponent],
    });
  });

  it('should show the correct text when OK is clicked on an OK confirm', async () => {
    const { confirmController, fixture } = await setupTest();

    fixture.componentInstance.launchConfirm();
    fixture.detectChanges();

    confirmController.expectOpen({
      message: 'Are you sure?',
    });

    confirmController.ok();
    confirmController.expectNone();
  });
});
