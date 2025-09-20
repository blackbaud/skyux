import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { SearchHarnessTestComponent } from './fixtures/search-harness-test.component';
import { SearchHarnessTestModule } from './fixtures/search-harness-test.module';
import { SkySearchHarness } from './search-harness';

describe('Search harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    searchHarness: SkySearchHarness;
    fixture: ComponentFixture<SearchHarnessTestComponent>;
    loader: HarnessLoader;
    mediaQuery: SkyMediaQueryTestingController;
  }> {
    await TestBed.configureTestingModule({
      imports: [SearchHarnessTestModule],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(SearchHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const searchHarness = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: options.dataSkyId }),
    );

    const mediaQuery = TestBed.inject(SkyMediaQueryTestingController);

    return { searchHarness, fixture, loader, mediaQuery };
  }

  it('should focus and blur input', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await expectAsync(searchHarness?.isFocused()).toBeResolvedTo(false);

    await searchHarness?.focus();
    await expectAsync(searchHarness?.isFocused()).toBeResolvedTo(true);

    await searchHarness?.blur();
    await expectAsync(searchHarness?.isFocused()).toBeResolvedTo(false);
  });

  it('should get ARIA attributes', async () => {
    const { searchHarness, fixture } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await expectAsync(searchHarness.getAriaLabel()).toBeResolvedTo(null);
    await expectAsync(searchHarness.getAriaLabelledby()).toBeResolvedTo(
      'foo-search-id',
    );

    fixture.componentInstance.ariaLabel = 'Search emails';
    fixture.componentInstance.ariaLabelledBy = undefined;

    fixture.detectChanges();

    await expectAsync(searchHarness.getAriaLabel()).toBeResolvedTo(
      'Search emails',
    );
    await expectAsync(searchHarness.getAriaLabelledby()).toBeResolvedTo(null);
  });

  it('should check if search is disabled', async () => {
    const { fixture, searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await expectAsync(searchHarness?.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disabled = true;

    await expectAsync(searchHarness?.isDisabled()).toBeResolvedTo(true);
  });

  it('should clear the input value', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    // First, set a value on the search.
    await searchHarness?.enterText('green');
    await expectAsync(searchHarness?.getValue()).toBeResolvedTo('green');

    // Now, clear the value.
    await searchHarness?.clear();
    await expectAsync(searchHarness?.getValue()).toBeResolvedTo('');
  });

  it('should get the placeholder value', async () => {
    const { fixture, searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    fixture.componentInstance.placeholderText = 'My placeholder text.';

    await expectAsync(searchHarness?.getPlaceholderText()).toBeResolvedTo(
      'My placeholder text.',
    );
  });

  it('should click the clear button', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await searchHarness.enterText('abc');
    await expectAsync(searchHarness.getValue()).toBeResolvedTo('abc');

    await searchHarness.clickClearButton();
    await expectAsync(searchHarness.getValue()).toBeResolvedTo('');
  });

  it('should should throw an error when trying to click dismiss on a non collapsible search', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });
    await expectAsync(
      searchHarness.clickDismissSearchButton(),
    ).toBeRejectedWithError(
      'Cannot find dismiss search button. Is a collapsed search open?',
    );
  });

  it('should should throw an error when trying to click open on a non collapsed search', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });
    await expectAsync(
      searchHarness.clickOpenSearchButton(),
    ).toBeRejectedWithError(
      'Cannot click search open button as search is not collapsed',
    );
  });

  describe('In mobile view', () => {
    async function setMobileView(
      fixture: ComponentFixture<SearchHarnessTestComponent>,
      mockMediaQueryService: SkyMediaQueryTestingController,
    ): Promise<void> {
      mockMediaQueryService.setBreakpoint('xs');
      fixture.detectChanges();
      await fixture.whenStable();
    }
    it('should throw errors trying to interact with collapsed search input', async () => {
      const { fixture, searchHarness, mediaQuery } = await setupTest({
        dataSkyId: 'my-search-1',
      });

      await setMobileView(fixture, mediaQuery);

      await expectAsync(searchHarness.blur()).toBeRejectedWithError(
        'Failed to blur the search input. Search is collapsed.',
      );
      await expectAsync(searchHarness.clear()).toBeRejectedWithError(
        'Failed to clear the search input. Search is collapsed.',
      );
      await expectAsync(searchHarness.clickClearButton()).toBeRejectedWithError(
        'Failed to click clear button. Search is collapsed.',
      );
      await expectAsync(
        searchHarness.clickSubmitButton(),
      ).toBeRejectedWithError(
        'Failed to click the submit button. Search is collapsed.',
      );
      await expectAsync(searchHarness.enterText('abc')).toBeRejectedWithError(
        'Failed to enter text into the search input. Search is collapsed.',
      );
      await expectAsync(searchHarness.focus()).toBeRejectedWithError(
        'Failed to focus the search input. Search is collapsed.',
      );
      await expectAsync(
        searchHarness.getPlaceholderText(),
      ).toBeRejectedWithError(
        'Failed to get the placeholder text. Search is collapsed.',
      );
      await expectAsync(searchHarness.getValue()).toBeRejectedWithError(
        'Failed to get the value of the search input. Search is collapsed.',
      );
      await expectAsync(searchHarness.isFocused()).toBeRejectedWithError(
        'Failed to get the search input focus status. Search is collapsed.',
      );
    });

    it('should open and close a collapsible search get whether the search is collapsed', async () => {
      const { fixture, searchHarness, mediaQuery } = await setupTest({
        dataSkyId: 'my-search-1',
      });

      await setMobileView(fixture, mediaQuery);

      await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(true);
      await searchHarness.clickOpenSearchButton();
      await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(false);
      await searchHarness.clickDismissSearchButton();
      await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(true);
    });
  });
});
