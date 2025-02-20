import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFlyoutHarness } from '@skyux/flyout/testing';

import { FlyoutBasicExampleComponent } from './example.component';

describe('Basic flyout example', () => {
  async function setupTest(): Promise<{
    flyoutHarness: SkyFlyoutHarness;
    fixture: ComponentFixture<FlyoutBasicExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [FlyoutBasicExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlyoutBasicExampleComponent);
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
