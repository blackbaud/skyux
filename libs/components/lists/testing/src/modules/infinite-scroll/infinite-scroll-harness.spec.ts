import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InfiniteScrollHarnessTestComponent } from './fixtures/infinite-scroll-harness-test.component';
import { InfiniteScrollHarnessTestModule } from './fixtures/infinite-scroll-harness-test.module';
import { SkyInfiniteScrollHarness } from './infinite-scroll-harness';

describe('Infinite scroll harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    fixture: ComponentFixture<InfiniteScrollHarnessTestComponent>;
    infiniteScrollHarness: SkyInfiniteScrollHarness;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [InfiniteScrollHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(InfiniteScrollHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const infiniteScrollHarness: SkyInfiniteScrollHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyInfiniteScrollHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyInfiniteScrollHarness);

    return { fixture, infiniteScrollHarness, loader };
  }

  function verifyNumListItems(
    fixture: ComponentFixture<InfiniteScrollHarnessTestComponent>,
    count: number,
  ): void {
    expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(count);
  }

  it('should click the "Load more" button', async () => {
    const { fixture, infiniteScrollHarness } = await setupTest({
      dataSkyId: 'my-infinite-scroll',
    });

    verifyNumListItems(fixture, 0);

    await infiniteScrollHarness.loadMore();

    verifyNumListItems(fixture, 10);
  });

  it('should throw error if clicking "Load more" button when scroll loading', async () => {
    const { fixture, infiniteScrollHarness } = await setupTest({
      dataSkyId: 'my-infinite-scroll',
    });

    fixture.componentInstance.loading = true;

    await expectAsync(infiniteScrollHarness.isLoading()).toBeResolvedTo(true);
    await expectAsync(infiniteScrollHarness.loadMore()).toBeRejectedWithError(
      'Unable to click the "Load more" button because the infinite scroll is loading.',
    );
  });

  it('should throw error if clicking "Load more" button when scroll not enabled', async () => {
    const { fixture, infiniteScrollHarness } = await setupTest({
      dataSkyId: 'my-infinite-scroll',
    });

    fixture.componentInstance.enabled = false;

    await expectAsync(infiniteScrollHarness.isEnabled()).toBeResolvedTo(false);
    await expectAsync(infiniteScrollHarness.loadMore()).toBeRejectedWithError(
      'Unable to click the "Load more" button because the infinite scroll is not enabled.',
    );
  });
});
