import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyInfiniteScrollHarness } from '@skyux/lists/testing';

import { ListsInfiniteScrollRepeaterExampleComponent } from './example.component';

describe('Infinite scroll example', () => {
  async function setupTest(): Promise<{
    infiniteScrollHarness: SkyInfiniteScrollHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [
        ListsInfiniteScrollRepeaterExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      ListsInfiniteScrollRepeaterExampleComponent,
    );
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
