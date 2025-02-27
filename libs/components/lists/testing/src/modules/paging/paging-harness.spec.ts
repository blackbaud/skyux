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

  it('should get the page controls', async () => {
    const { pagingHarness } = await setupTest();

    let pageControls = await pagingHarness.getPageControls();

    expect(pageControls.length).toBe(3);

    await expectAsync(pageControls[0].getText()).toBeResolvedTo('1');
    await expectAsync(pageControls[0].isDisabled()).toBeResolvedTo(true);
    await expectAsync(pageControls[1].getText()).toBeResolvedTo('2');
    await expectAsync(pageControls[1].isDisabled()).toBeResolvedTo(false);
    await expectAsync(pageControls[2].getText()).toBeResolvedTo('3');
    await expectAsync(pageControls[2].isDisabled()).toBeResolvedTo(false);

    await pageControls[1].clickButton();

    await expectAsync(pageControls[1].isDisabled()).toBeResolvedTo(true);
    await expectAsync(pageControls[1].clickButton()).toBeRejectedWithError(
      'Could not click page button 2 because it is currently the active page.',
    );

    await pageControls[2].clickButton();

    pageControls = await pagingHarness.getPageControls();

    await expectAsync(pageControls[0].getText()).toBeResolvedTo('2');
    await expectAsync(pageControls[0].isDisabled()).toBeResolvedTo(false);
    await expectAsync(pageControls[1].getText()).toBeResolvedTo('3');
    await expectAsync(pageControls[1].isDisabled()).toBeResolvedTo(true);
    await expectAsync(pageControls[2].getText()).toBeResolvedTo('4');
    await expectAsync(pageControls[2].isDisabled()).toBeResolvedTo(false);
  });

  it('should throw an error if the paging controls are not present', async () => {
    const { pagingHarness } = await setupTest({ dataSkyId: 'other-paging' });

    await expectAsync(pagingHarness.getCurrentPage()).toBeRejectedWithError(
      'Could not find current page.',
    );
    await expectAsync(pagingHarness.getPageControls()).toBeRejectedWithError(
      'Could not find any page controls.',
    );
    await expectAsync(pagingHarness.clickNextButton()).toBeRejectedWithError(
      'Could not find the next button.',
    );
    await expectAsync(
      pagingHarness.clickPreviousButton(),
    ).toBeRejectedWithError('Could not find the previous button.');
  });
});
