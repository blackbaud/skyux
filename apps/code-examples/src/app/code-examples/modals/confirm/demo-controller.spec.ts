/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyConfirmInstance, SkyConfirmService } from '@skyux/modals';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
} from '@skyux/modals/testing';

/**
 * Launches a confirm on init.
 */
@Component({
  imports: [],
  standalone: true,
  template: ``,
})
class LaunchConfirmComponent implements OnInit, OnDestroy {
  readonly #confirmSvc = inject(SkyConfirmService);

  #confirmInstance: SkyConfirmInstance | undefined;

  public ngOnInit(): void {
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
    fixture: ComponentFixture<LaunchConfirmComponent>;
  }> {
    const confirmController = TestBed.inject(SkyConfirmTestingController);
    const fixture = TestBed.createComponent(LaunchConfirmComponent);

    return { confirmController, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LaunchConfirmComponent, SkyConfirmTestingModule],
    });
  });

  it('should show the correct text when OK is clicked on an OK confirm', async () => {
    const { confirmController, fixture } = await setupTest();

    fixture.detectChanges();

    confirmController.expectOpen({
      message: 'Are you sure?',
    });

    confirmController.ok();
    confirmController.expectNone();
  });
});
