import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { SkyAutocompleteHarness } from './autocomplete-harness';
import { AutocompleteHarnessTestComponent } from './fixtures/autocomplete-harness-test.component';
import { AutocompleteHarnessTestModule } from './fixtures/autocomplete-harness-test.module';
import { ColorIdHarness } from './fixtures/color-id-harness';
import { MyExtendsAutocompleteHarness } from './fixtures/my-extends-harness';
import { NonexistentHarness } from './fixtures/nonexistent-harness';

describe('Autocomplete harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}) {
    await TestBed.configureTestingModule({
      imports: [AutocompleteHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(AutocompleteHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let autocompleteHarness: SkyAutocompleteHarness | undefined;
    if (options.dataSkyId) {
      autocompleteHarness = await loader.getHarness(
        SkyAutocompleteHarness.with({ dataSkyId: options.dataSkyId }),
      );
    }

    return { autocompleteHarness, fixture, loader };
  }

  it('should focus and blur input', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await expectAsync(autocompleteHarness?.isFocused()).toBeResolvedTo(false);

    await autocompleteHarness?.focus();
    await expectAsync(autocompleteHarness?.isFocused()).toBeResolvedTo(true);

    await autocompleteHarness?.blur();
    await expectAsync(autocompleteHarness?.isFocused()).toBeResolvedTo(false);
  });

  it('should check if autocomplete is disabled', async () => {
    const { fixture, autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await expectAsync(autocompleteHarness?.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();

    await expectAsync(autocompleteHarness?.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if autocomplete is open', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('r');

    await expectAsync(autocompleteHarness?.isOpen()).toBeResolvedTo(true);
  });

  it('should return search result harnesses', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('d');

    const results = (await autocompleteHarness?.getSearchResults()) ?? [];

    await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Red');
    await expectAsync(results[0].getText()).toBeResolvedTo('Red');
  });

  it('should return search results text content', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('r');

    await expectAsync(
      autocompleteHarness?.getSearchResultsText(),
    ).toBeResolvedTo([
      'Red',
      'Green',
      'Orange',
      'Purple',
      'Brown',
      'Turquoise',
    ]);
  });

  it('should select a search result', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('r');
    const result = ((await autocompleteHarness?.getSearchResults()) ?? [])[0];
    await result.select();

    await expectAsync(autocompleteHarness?.getValue()).toBeResolvedTo('Red');
  });

  it('should select a search result using filters', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('r');
    await autocompleteHarness?.selectSearchResult({
      text: 'Green',
    });

    await expectAsync(autocompleteHarness?.getValue()).toBeResolvedTo('Green');
  });

  it('should clear the input value', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    // First, set a value on the autocomplete.
    await autocompleteHarness?.enterText('r');
    await autocompleteHarness?.selectSearchResult({
      text: 'Green',
    });
    await expectAsync(autocompleteHarness?.getValue()).toBeResolvedTo('Green');

    // Now, clear the value.
    await autocompleteHarness?.clear();
    await expectAsync(autocompleteHarness?.getValue()).toBeResolvedTo('');
  });

  it('should throw error if getting search results when autocomplete not open', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await expectAsync(
      autocompleteHarness?.getSearchResults(),
    ).toBeRejectedWithError(
      'Unable to retrieve search results. The autocomplete is closed.',
    );
  });

  it('should throw error if filtered search results are empty', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('r');

    await expectAsync(
      autocompleteHarness?.getSearchResults({
        text: /invalidSearchText/,
      }),
    ).toBeRejectedWithError(
      'Could not find search results matching filter(s): {"text":"/invalidSearchText/"}',
    );
  });

  it('should return an empty array if search results are not filtered', async () => {
    const { autocompleteHarness } = await setupTest({
      dataSkyId: 'my-autocomplete-1',
    });

    await autocompleteHarness?.enterText('invalidSearchText');

    await expectAsync(autocompleteHarness?.getSearchResults()).toBeResolvedTo(
      [],
    );
  });

  describe('custom search result template', () => {
    it('should get search result text and value', async () => {
      const { autocompleteHarness } = await setupTest({
        dataSkyId: 'my-autocomplete-2',
      });

      await autocompleteHarness?.enterText('d');

      const results = (await autocompleteHarness?.getSearchResults()) ?? [];

      await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Red');
      await expectAsync(results[0].getText()).toBeResolvedTo('Red ID: 1');
    });

    it('should query child harnesses', async () => {
      const { autocompleteHarness } = await setupTest({
        dataSkyId: 'my-autocomplete-2',
      });

      await autocompleteHarness?.enterText('d');

      const results = (await autocompleteHarness?.getSearchResults()) ?? [];
      const harness = await results[0].queryHarness(ColorIdHarness);

      await expectAsync((await harness.host()).text()).toBeResolvedTo('1');
    });

    it('should throw error if query for child harness is not found', async () => {
      const { autocompleteHarness } = await setupTest({
        dataSkyId: 'my-autocomplete-2',
      });

      await autocompleteHarness?.enterText('d');

      const results = (await autocompleteHarness?.getSearchResults()) ?? [];

      await expectAsync(
        results[0].queryHarness(NonexistentHarness),
      ).toBeRejectedWithError();
    });

    it('should return null if query for child harness is not found', async () => {
      const { autocompleteHarness } = await setupTest({
        dataSkyId: 'my-autocomplete-2',
      });

      await autocompleteHarness?.enterText('d');

      const results = (await autocompleteHarness?.getSearchResults()) ?? [];

      await expectAsync(
        results[0].queryHarnessOrNull(NonexistentHarness),
      ).toBeResolvedTo(null);
    });

    it('should get the autocomplete `aria-labelledby` value', async () => {
      const { autocompleteHarness, fixture } = await setupTest({
        dataSkyId: 'my-autocomplete-1',
      });

      fixture.componentInstance.ariaLabelledby = 'autocomplete-aria-labelledby';
      fixture.detectChanges();

      await expectAsync(autocompleteHarness.getAriaLabelledby()).toBeResolvedTo(
        'autocomplete-aria-labelledby',
      );
    });

    it('should get the text displayed when there are no search results', async () => {
      const { autocompleteHarness, fixture } = await setupTest({
        dataSkyId: 'my-autocomplete-1',
      });

      fixture.componentInstance.noResultFoundText =
        'No search results were found.';
      fixture.detectChanges();

      await autocompleteHarness?.enterText('z');
      fixture.detectChanges();

      await expectAsync(
        autocompleteHarness.getNoResultsFoundText(),
      ).toBeResolvedTo('No search results were found.');
    });

    it('should throw an error trying to get the no search results text when there are search results', async () => {
      const { autocompleteHarness, fixture } = await setupTest({
        dataSkyId: 'my-autocomplete-1',
      });

      fixture.componentInstance.noResultFoundText =
        'No search results were found.';
      fixture.detectChanges();

      await autocompleteHarness?.enterText('d');
      fixture.detectChanges();

      await expectAsync(
        autocompleteHarness.getNoResultsFoundText(),
      ).toBeRejectedWithError(
        'Cannot find no results found text as there are search results found.',
      );
    });

    it('should throw an error trying to get the no search results text when the dropdown is closed', async () => {
      const { autocompleteHarness, fixture } = await setupTest({
        dataSkyId: 'my-autocomplete-1',
      });

      fixture.componentInstance.noResultFoundText =
        'No search results were found.';
      fixture.detectChanges();

      await expectAsync(
        autocompleteHarness.getNoResultsFoundText(),
      ).toBeRejectedWithError(
        'Cannot find no results found text as the dropdown is closed.',
      );
    });
  });

  describe('protected features', () => {
    it('should click the "Add" button', async () => {
      const { loader, fixture } = await setupTest();

      const myHarness = loader.getHarness(MyExtendsAutocompleteHarness);
      const spy = spyOn(fixture.componentInstance, 'onAddClick');

      await expectAsync(
        (await myHarness).clickAddButton(),
      ).toBeRejectedWithError(
        'Unable to find the "Add" button. The autocomplete is closed.',
      );

      await (await myHarness).enterText('r');
      await (await myHarness).clickAddButton();

      expect(spy).toHaveBeenCalledWith();
    });

    it('should click the "Show more" button', async () => {
      const { loader, fixture } = await setupTest();

      const myHarness = loader.getHarness(MyExtendsAutocompleteHarness);
      const spy = spyOn(fixture.componentInstance, 'onShowMoreClick');

      await expectAsync(
        (await myHarness).clickShowMoreButton(),
      ).toBeRejectedWithError(
        'Unable to find the "Show more" button. The autocomplete is closed.',
      );

      await (await myHarness).enterText('r');
      await (await myHarness).clickShowMoreButton();

      expect(spy).toHaveBeenCalledWith();
    });

    it('should throw errors when buttons are not enabled', async () => {
      const { loader, fixture } = await setupTest();

      const myHarness = loader.getHarness(MyExtendsAutocompleteHarness);

      fixture.componentInstance.enableShowMore = false;
      fixture.componentInstance.showAddButton = false;

      await (await myHarness).enterText('r');

      await expectAsync(
        (await myHarness).clickAddButton(),
      ).toBeRejectedWithError(
        'The "Add" button cannot be clicked because it does not exist.',
      );

      await expectAsync(
        (await myHarness).clickShowMoreButton(),
      ).toBeRejectedWithError(
        'The "Show more" button cannot be clicked because it does not exist.',
      );
    });
  });
});
