import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFlyoutHarness } from '@skyux/flyout/testing';

import { DemoComponent } from './demo.component';

describe('Flyout harness', () => {
  async function setupTest(): Promise<{
    flyoutHarness: SkyFlyoutHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    fixture.componentInstance.openFlyoutWithCustomWidth();

    const flyoutHarness: SkyFlyoutHarness =
      await loader.getHarness(SkyFlyoutHarness);

    return { flyoutHarness, fixture };
  }

  it('should set up the flyout', async () => {
    const { flyoutHarness } = await setupTest();

    await expectAsync(flyoutHarness.getAriaLabelledBy()).toBeResolvedTo(
      'flyout-title',
    );
    await expectAsync(flyoutHarness.getAriaRole()).toBeResolvedTo('dialog');
    await expectAsync(flyoutHarness.getFlyoutWidth()).toBeResolvedTo(350);
    await expectAsync(flyoutHarness.getFlyoutMinWidth()).toBeResolvedTo(200);
    await expectAsync(flyoutHarness.getFlyoutMaxWidth()).toBeResolvedTo(500);

    await flyoutHarness.closeFlyout();
  });
});
