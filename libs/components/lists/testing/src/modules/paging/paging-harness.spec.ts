import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PagingHarnessTestComponent } from './fixtures/paging-harness-test.component';
import { SkyPagingHarness } from './paging-harness';

describe('Paging test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
      pageSize?: number;
      maxPages?: number;
    } = {},
  ): Promise<{
    pagingHarness: SkyPagingHarness;
    fixture: ComponentFixture<PagingHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [PagingHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(PagingHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    if (options.pageSize) {
      fixture.componentInstance.pageSize = options.pageSize;
      fixture.detectChanges();
    }

    if (options.maxPages) {
      fixture.componentInstance.maxPages = options.maxPages;
      fixture.detectChanges();
    }

    const pagingHarness: SkyPagingHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyPagingHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyPagingHarness);

    return { pagingHarness, fixture };
  }

  it('should get the paging component by data-sky-id', async () => {
    const { pagingHarness } = await setupTest({ dataSkyId: 'other-paging' });

    await expectAsync(pagingHarness.getPagingContent()).toBeRejected();
  });

  it('should get the current page', async () => {
    const { pagingHarness } = await setupTest();

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
  });

  it('should click the next and previous buttons', async () => {
    const { pagingHarness } = await setupTest({ pageSize: 10 });

    await pagingHarness.clickNextButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
    await expectAsync(pagingHarness.clickNextButton()).toBeRejectedWithError(
      'Could not click the next button because it is disabled.',
    );

    await pagingHarness.clickPreviousButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    await expectAsync(
      pagingHarness.clickPreviousButton(),
    ).toBeRejectedWithError(
      'Could not click the previous button because it is disabled.',
    );
  });

  it('should select a specific page', async () => {
    const { pagingHarness, fixture } = await setupTest();

    await pagingHarness.clickPageButton(3);

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);
  });

  it('should throw an error when trying to select page that is not currently displayed', async () => {
    const { pagingHarness } = await setupTest();

    await expectAsync(pagingHarness.clickPageButton(5)).toBeRejectedWithError(
      'Could not find page button 5.',
    );
  });

  it('should get the paging label', async () => {
    const { pagingHarness } = await setupTest();

    await expectAsync(pagingHarness.getPagingLabel()).toBeResolvedTo(
      'Paging label',
    );
  });

  it('should throw an error if the paging controls are not present', async () => {
    const { pagingHarness } = await setupTest({ dataSkyId: 'other-paging' });

    await expectAsync(pagingHarness.getPagingLabel()).toBeRejectedWithError(
      'Could not find paging label.',
    );
    await expectAsync(pagingHarness.getCurrentPage()).toBeRejectedWithError(
      'Could not find current page.',
    );
    await expectAsync(pagingHarness.clickPageButton(1)).toBeRejectedWithError(
      'Could not find page button 1.',
    );
    await expectAsync(pagingHarness.clickNextButton()).toBeRejectedWithError(
      'Could not find the next button.',
    );
    await expectAsync(
      pagingHarness.clickPreviousButton(),
    ).toBeRejectedWithError('Could not find the previous button.');
  });
});
