import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyInfiniteScrollHarness } from '@skyux/lists/testing';

import { DemoComponent } from './demo.component';

fdescribe('Infinite scroll demo', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DemoComponent>;
    infiniteScrollHarness: SkyInfiniteScrollHarness;
    overflowContainer: HTMLElement;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const infiniteScrollHarness = await loader.getHarness(
      SkyInfiniteScrollHarness.with({ dataSkyId: 'infinite-scroll' }),
    );

    const overflowContainer = fixture.nativeElement.querySelector(
      '.overflow-container',
    ) as HTMLElement;

    return { fixture, infiniteScrollHarness, overflowContainer };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
      providers: [provideNoopAnimations()],
    });
  });

  async function waitForResults(
    fixture: ComponentFixture<DemoComponent>,
  ): Promise<void> {
    // Wait for items from the service.
    fixture.detectChanges();
    tick(1000);
    // Update the view.
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    await fixture.whenStable();
  }

  it('should load more items', fakeAsync(async () => {
    const { fixture, infiniteScrollHarness } = await setupTest();

    // overflowContainer.scrollTop = 1000;
    await waitForResults(fixture);

    // await fixture.whenStable();

    await expectAsync(infiniteScrollHarness.isEnabled()).toBeResolvedTo(true);
    await expectAsync(infiniteScrollHarness.isLoading()).toBeResolvedTo(false);

    await infiniteScrollHarness.loadMore();
    await waitForResults(fixture);

    await infiniteScrollHarness.loadMore();
    await waitForResults(fixture);

    // fixture.detectChanges();
    // tick(1000);
    // fixture.detectChanges();

    // await fixture.whenStable();

    // await infiniteScrollHarness.loadMore();
    // tick(1000);

    // await infiniteScrollHarness.loadMore();
    // tick(1000);

    // await infiniteScrollHarness.loadMore();
    // tick(1000);

    // await infiniteScrollHarness.loadMore();
    // tick(1000);

    // await infiniteScrollHarness.loadMore();
    // tick(1000);

    // await infiniteScrollHarness.loadMore();
    // tick(1000);

    // await expectAsync(infiniteScrollHarness.isEnabled()).toBeResolvedTo(false);

    // await expectAsync(infiniteScrollHarness.loadMore()).toBeRejectedWithError(
    //   'Unable to click the "Load more" button because the infinite scroll is loading.',
    // );
  }));
});
