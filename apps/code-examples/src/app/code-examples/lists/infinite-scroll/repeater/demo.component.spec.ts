import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInfiniteScrollHarness } from '@skyux/lists/testing';

import { DemoComponent } from './demo.component';

describe('Infinite scroll demo', () => {
  async function setupTest(): Promise<{
    infiniteScrollHarness: SkyInfiniteScrollHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const infiniteScrollHarness: SkyInfiniteScrollHarness =
      await loader.getHarness(SkyInfiniteScrollHarness);

    return { infiniteScrollHarness };
  }

  it('should set up the component', async () => {
    const { infiniteScrollHarness } = await setupTest();

    await expectAsync(infiniteScrollHarness.isEnabled()).toBeResolvedTo(true);

    await infiniteScrollHarness.loadMore();

    await expectAsync(infiniteScrollHarness.isEnabled()).toBeResolvedTo(true);

    await infiniteScrollHarness.loadMore();

    await expectAsync(infiniteScrollHarness.isEnabled()).toBeResolvedTo(false);

    await expectAsync(infiniteScrollHarness.loadMore()).toBeRejectedWithError(
      'Unable to click the "Load more" button because the infinite scroll is not enabled.',
    );
  });
});
