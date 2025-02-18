import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyToastType } from '@skyux/toast';
import { SkyToasterHarness } from '@skyux/toast/testing';

import { CustomToastHarness } from './custom-toast-harness';
import { DemoComponent } from './demo.component';

describe('Custom component toast demo', () => {
  let fixture: ComponentFixture<DemoComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(DemoComponent);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  async function setupTest(): Promise<{
    toasterHarness: SkyToasterHarness;
  }> {
    fixture.componentInstance.openToast();
    fixture.detectChanges();

    const toasterHarness: SkyToasterHarness =
      await loader.getHarness(SkyToasterHarness);

    return { toasterHarness };
  }

  it('should open custom component in toast', async () => {
    const { toasterHarness } = await setupTest();

    const toasts = await toasterHarness.getToasts();
    const customHarness = await toasts[0].queryHarness(CustomToastHarness);

    await expectAsync(toasts[0].getType()).toBeResolvedTo(SkyToastType.Success);
    await expectAsync(customHarness.getText()).toBeResolvedTo(
      'Custom message: This toast has embedded a custom component for its content.',
    );
  });

  it('should close all toasts', async () => {
    fixture.componentInstance.openToast();
    fixture.detectChanges();
    fixture.componentInstance.closeAll();
    fixture.detectChanges();

    await expectAsync(loader.getHarness(SkyToasterHarness)).toBeRejected();
  });
});
