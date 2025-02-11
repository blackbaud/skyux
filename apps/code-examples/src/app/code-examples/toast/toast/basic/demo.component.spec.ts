import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyToastType } from '@skyux/toast';
import { SkyToasterHarness } from '@skyux/toast/testing';

import { DemoComponent } from './demo.component';

fdescribe('Custom component toast demo', () => {
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

  it('should open success toasts', async () => {
    const { toasterHarness } = await setupTest();

    fixture.componentInstance.openToast();
    fixture.detectChanges();

    await expectAsync(toasterHarness.getNumberOfToasts()).toBeResolvedTo(2);

    const toast = await toasterHarness.getToastByMessage(
      'This is a sample toast message.',
    );

    await expectAsync(toast.getType()).toBeResolvedTo(SkyToastType.Success);
  });

  it('should close all toasts', async () => {
    fixture.componentInstance.openToast();
    fixture.detectChanges();
    fixture.componentInstance.closeAll();
    fixture.detectChanges();

    await expectAsync(loader.getHarness(SkyToasterHarness)).toBeRejected();
  });
});
