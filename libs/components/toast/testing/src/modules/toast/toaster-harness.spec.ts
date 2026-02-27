import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyToastInstance,
  SkyToastModule,
  SkyToastService,
  SkyToastType,
} from '@skyux/toast';

import { SkyToasterHarness } from './toaster-harness';

@Component({
  imports: [SkyToastModule],
  template: '',
})
class TestComponent {
  public toastSvc = inject(SkyToastService);

  public openToast(
    message: string,
    type: SkyToastType,
    autoclose?: boolean,
  ): void {
    this.toastSvc.openMessage(message, { type: type, autoClose: autoclose });
  }
}

@Component({
  template: ` <div>This is a custom component</div> `,
})
class CustomComponent {
  readonly #instance = inject(SkyToastInstance);

  protected close(): void {
    this.#instance.close();
  }
}

describe('Toast harness', () => {
  async function setupTest(autoclose?: boolean): Promise<{
    harness: SkyToasterHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, CustomComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    fixture.componentInstance.openToast(
      'toast message',
      SkyToastType.Info,
      autoclose,
    );

    const harness: SkyToasterHarness =
      await loader.getHarness(SkyToasterHarness);

    return { harness, fixture };
  }

  it('should get toasts', async () => {
    const { harness } = await setupTest();

    const toasts = await harness.getToasts();

    expect(toasts.length).toBe(1);
  });

  it('should get the harness when toast is set to autoclose', async () => {
    const { harness } = await setupTest(true);
    await expectAsync(harness.getToasts()).toBeResolved();
  });

  it('should get toast by message', async () => {
    const { harness, fixture } = await setupTest();

    fixture.componentInstance.openToast('other message', SkyToastType.Danger);
    fixture.detectChanges();

    const toast = await harness.getToastByMessage('other message');

    await expectAsync(toast.getType()).toBeResolvedTo(SkyToastType.Danger);
  });

  describe('toast harness', () => {
    it('should close the toasts', async () => {
      const { harness, fixture } = await setupTest();

      fixture.componentInstance.openToast('other message', SkyToastType.Danger);
      fixture.detectChanges();

      await expectAsync(harness.getNumberOfToasts()).toBeResolvedTo(2);

      const toasts = await harness.getToasts();
      await toasts[0].close();

      await expectAsync(harness.getNumberOfToasts()).toBeResolvedTo(1);
    });

    it('should get the toast message', async () => {
      const { harness } = await setupTest();

      const toasts = await harness.getToasts();

      await expectAsync(toasts[0].getMessage()).toBeResolvedTo('toast message');
    });

    it('should get the toast type', async () => {
      const { harness, fixture } = await setupTest();

      fixture.componentInstance.openToast('danger toast', SkyToastType.Danger);
      fixture.detectChanges();
      fixture.componentInstance.openToast(
        'warning toast',
        SkyToastType.Warning,
      );
      fixture.detectChanges();
      fixture.componentInstance.openToast(
        'success toast',
        SkyToastType.Success,
      );
      fixture.detectChanges();

      const toasts = await harness.getToasts();

      await expectAsync(toasts[0].getType()).toBeResolvedTo(SkyToastType.Info);
      await expectAsync(toasts[1].getType()).toBeResolvedTo(
        SkyToastType.Danger,
      );
      await expectAsync(toasts[2].getType()).toBeResolvedTo(
        SkyToastType.Warning,
      );
      await expectAsync(toasts[3].getType()).toBeResolvedTo(
        SkyToastType.Success,
      );
    });

    describe('custom toast component', () => {
      it('should not get message for a custom component', async () => {
        const { harness, fixture } = await setupTest();
        fixture.componentInstance.toastSvc.openComponent(CustomComponent);
        fixture.detectChanges();

        await expectAsync(
          harness.getToastByMessage('This is a custom component'),
        ).toBeRejectedWithError(
          'No toast message found. This method cannot be used to query toasts with custom components.',
        );
      });
    });
  });
});
