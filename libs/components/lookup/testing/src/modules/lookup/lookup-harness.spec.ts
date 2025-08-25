import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { SkyAutocompleteInputHarness } from '../autocomplete/autocomplete-input-harness';

import { LookupHarnessTestComponent } from './fixtures/lookup-harness-test.component';
import { LookupHarnessTestModule } from './fixtures/lookup-harness-test.module';
import { SkyLookupHarness } from './lookup-harness';

async function setupTest(options: {
  dataSkyId: string;
  selectionDescriptor?: string;
  enableCustomTemplate?: boolean;
}): Promise<{
  fixture: ComponentFixture<LookupHarnessTestComponent>;
  lookupHarness: SkyLookupHarness;
  lookupInputHarness: SkyAutocompleteInputHarness;
}> {
  await TestBed.configureTestingModule({
    imports: [LookupHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(LookupHarnessTestComponent);
  fixture.componentInstance.showMoreConfig.nativePickerConfig = Object.assign(
    { selectionDescriptor: options.selectionDescriptor },
    fixture.componentInstance.showMoreConfig.nativePickerConfig,
  );

  if (options.enableCustomTemplate) {
    fixture.componentInstance.showMoreConfig.nativePickerConfig = Object.assign(
      { itemTemplate: fixture.componentInstance.showMoreSearchResultTemplate },
      fixture.componentInstance.showMoreConfig.nativePickerConfig,
    );
  }

  const loader = TestbedHarnessEnvironment.loader(fixture);

  let lookupHarness: SkyLookupHarness;

  if (options.dataSkyId === 'my-basic-lookup') {
    lookupHarness = await loader.getHarness(
      SkyLookupHarness.with({ dataSkyId: options.dataSkyId }),
    );
  } else {
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );
    lookupHarness = await inputBoxHarness.queryHarness(SkyLookupHarness);
  }

  const lookupInputHarness = await lookupHarness.getControl();

  return { fixture, lookupHarness, lookupInputHarness };
}

/**
 * Tests for a single select lookup.
 */
function testSingleSelect(dataSkyId: string): void {
  it('should focus and blur input', async () => {
    const { lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await expectAsync(lookupInputHarness.isFocused()).toBeResolvedTo(false);

    await lookupInputHarness.focus();
    await expectAsync(lookupInputHarness.isFocused()).toBeResolvedTo(true);

    await lookupInputHarness.blur();
    await expectAsync(lookupInputHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should focus and blur input - deprecated ', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);

    await lookupHarness.focus();
    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(true);

    await lookupHarness.blur();
    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should check if lookup is disabled', async () => {
    const { fixture, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await expectAsync(lookupInputHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();

    await expectAsync(lookupInputHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if lookup is disabled - deprecated', async () => {
    const { fixture, lookupHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await expectAsync(lookupHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();

    await expectAsync(lookupHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if lookup is open', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await lookupInputHarness.setValue('r');

    await expectAsync(lookupHarness.isOpen()).toBeResolvedTo(true);
  });

  it('should return search result harnesses', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId,
    });

    await lookupInputHarness.setValue('d');

    const results = (await lookupHarness.getSearchResults()) ?? [];

    await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Abed');
    await expectAsync(results[0].getText()).toBeResolvedTo('Abed');
  });

  it('should return search results text content', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await lookupInputHarness.setValue('d');

    await expectAsync(lookupHarness.getSearchResultsText()).toBeResolvedTo([
      'Abed',
      'Leonard',
      'Todd',
    ]);
  });

  it('should select a search result from the autocomplete results', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await lookupInputHarness.setValue('d');
    const result = ((await lookupHarness.getSearchResults()) ?? [])[0];
    await result.select();

    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('Abed');
  });

  it('should select a search result from the autocomplete results - deprecated', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await lookupHarness.enterText('d');
    const result = ((await lookupHarness.getSearchResults()) ?? [])[0];
    await result.select();

    await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Abed');
  });

  it('should select one option from the autocomplete results using filters', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId,
    });

    await expectAsync(lookupHarness.isMultiselect()).toBeResolvedTo(false);

    await lookupInputHarness.setValue('d');
    await lookupHarness.selectSearchResult({
      text: 'Leonard',
    });

    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('Leonard');
  });

  it('should clear the input value', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    // First, set a value on the autocomplete.
    await lookupInputHarness.setValue('d');
    await lookupHarness.selectSearchResult({
      text: 'Leonard',
    });
    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('Leonard');

    // Now, clear the value.
    await lookupInputHarness.clear();
    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('');
  });

  it('should clear the input value - deprecated', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    // First, set a value on the autocomplete.
    await lookupInputHarness.setValue('d');
    await lookupHarness.selectSearchResult({
      text: 'Leonard',
    });
    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('Leonard');

    // Now, clear the value.
    await lookupHarness.clear();
    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('');
  });

  it('should throw error if getting search results when autocomplete not open', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await expectAsync(lookupHarness.getSearchResults()).toBeRejectedWithError(
      'Unable to retrieve search results. The lookup is closed.',
    );
  });

  it('should return an empty array if search results are not filtered', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId: dataSkyId,
    });

    await lookupInputHarness.setValue('invalidSearchText');

    await expectAsync(lookupHarness.getSearchResults()).toBeResolvedTo([]);
  });

  it('should click the add button', async () => {
    const { fixture, lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId,
    });

    await lookupInputHarness.setValue('r');

    const spy = spyOn(fixture.componentInstance, 'onAddClick');

    await lookupHarness.clickAddButton();

    expect(spy).toHaveBeenCalled();
  });

  it('should search and select results from the show more picker', async () => {
    const { lookupHarness, lookupInputHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('rachel');
    await picker.selectSearchResult({ contentText: 'Rachel' });
    await picker.saveAndClose();

    await expectAsync(lookupInputHarness.getValue()).toBeResolvedTo('Rachel');
  });

  it('should throw an error when clicking on non-existent "Select all" button', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();

    await expectAsync(picker.selectAll()).toBeRejectedWithError(
      'Could not select all selections because the "Select all" button could not be found.',
    );
  });

  it('should throw an error when clicking on non-existent "Clear all" button', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();

    await expectAsync(picker.clearAll()).toBeRejectedWithError(
      'Could not clear all selections because the "Clear all" button could not be found.',
    );
  });

  it('should get accessibility labels', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
      selectionDescriptor: 'person',
    });

    await lookupHarness.clickShowMoreButton();
    const picker = await lookupHarness.getShowMorePicker();
    await expectAsync(
      picker.getClearAllButtonAriaLabel(),
    ).toBeRejectedWithError(
      'Could not get the aria-label for the clear all button because the "Clear all" button could not be found.',
    );
    await expectAsync(
      picker.getSelectAllButtonAriaLabel(),
    ).toBeRejectedWithError(
      'Could not get the aria-label for the select all button because the "Select all" button could not be found.',
    );
    await expectAsync(
      picker.getOnlyShowSelectedAriaLabel(),
    ).toBeRejectedWithError(
      'Could not get the "Show only selected items" checkbox because it could not be found.',
    );
    await expectAsync(picker.getSearchAriaLabel()).toBeResolvedTo(
      'Search person',
    );
    await expectAsync(picker.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select person',
    );
  });
}

/**
 * Tests for a multiselect lookup.
 */
function testMultiselect(dataSkyId: string): void {
  it('should get selections', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.dismissSelections();
    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('abed');
    await picker.selectSearchResult({ contentText: 'Abed' });
    await picker.saveAndClose();

    const selections = (await lookupHarness.getSelections()) ?? [];

    expect(selections.length).toBe(1);
    await expectAsync(selections[0].getText()).toBeResolvedTo('Abed');
  });

  it('should select multiple results from the "Show more" picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.dismissSelections();
    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);

    await lookupHarness.clickShowMoreButton();
    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('ra');
    await picker.selectSearchResult({ contentText: /Craig|Rachel/ });
    await picker.saveAndClose();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Craig',
      'Rachel',
    ]);
  });

  it('should select all results from the "Show more" picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.dismissSelections();
    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);
    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('ra');
    await picker.selectAll();
    await picker.saveAndClose();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Craig',
      'Rachel',
    ]);
  });

  it('should clear all results from the "Show more" picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.loadMore(); // <-- make sure existing selection is present in the search results.
    await picker.clearAll();
    await picker.saveAndClose();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);
  });

  it('should clear search text from the "Show more" picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('rachel');
    let searchResults = await picker.getSearchResults();

    expect(searchResults.length).toEqual(1);

    await picker.clearSearchText();
    searchResults = await picker.getSearchResults();

    expect(searchResults.length).toEqual(10);
  });

  it('should cancel the "Show more" picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.enterSearchText('ra');
    await picker.selectAll();
    await picker.cancel();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);
  });

  it('should load more results in the "Show more" picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await lookupHarness.dismissSelections();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();
    await picker.loadMore();
    await picker.selectSearchResult({ contentText: 'Vicki' });
    await picker.saveAndClose();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Vicki',
    ]);
  });

  it('should throw an error when attempting to get an unopened picker', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
    });

    await expectAsync(lookupHarness.getShowMorePicker()).toBeRejectedWithError(
      'Cannot get the "Show more" picker because it is not open.',
    );
  });

  it('should get accessibility labels', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId,
      selectionDescriptor: 'people',
    });

    await lookupHarness.clickShowMoreButton();
    const picker = await lookupHarness.getShowMorePicker();
    await expectAsync(picker.getClearAllButtonAriaLabel()).toBeResolvedTo(
      'Clear all selected people',
    );
    await expectAsync(picker.getSelectAllButtonAriaLabel()).toBeResolvedTo(
      'Select all people',
    );
    await expectAsync(picker.getSearchAriaLabel()).toBeResolvedTo(
      'Search people',
    );
    await expectAsync(picker.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select people',
    );
    await expectAsync(picker.getOnlyShowSelectedAriaLabel()).toBeResolvedTo(
      'Show only selected people',
    );
  });
}

describe('Lookup harness', () => {
  describe('single select', () => {
    describe('standard', () => testSingleSelect('my-single-select-lookup'));
    describe('async', () => testSingleSelect('my-single-select-async-lookup'));
  });

  describe('multiselect', () => {
    describe('standard', () => testMultiselect('my-multiselect-lookup'));
    describe('async', () => testMultiselect('my-async-lookup'));
  });

  describe('custom templates', () => {
    it('should get search result text and value', async () => {
      const { lookupHarness, lookupInputHarness } = await setupTest({
        dataSkyId: 'my-custom-template-lookup',
        enableCustomTemplate: true,
      });

      await lookupInputHarness.setValue('d');

      const results = (await lookupHarness.getSearchResults()) ?? [];

      await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Abed');
      await expectAsync(results[0].getText()).toBeResolvedTo(
        'Abed (Mr. Nadir)',
      );
    });

    it('should get "Show more" picker search results text', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-custom-template-lookup',
      });

      await lookupHarness.clickShowMoreButton();

      const picker = await lookupHarness.getShowMorePicker();
      await picker.enterSearchText('d');

      const results = (await picker.getSearchResults()) ?? [];
      await expectAsync(results[0].getContentText()).toBeResolvedTo(
        'Abed (Mr. Nadir)',
      );
    });
  });

  it('should get the autocomplete `aria-labelledby` value', async () => {
    const { lookupHarness } = await setupTest({
      dataSkyId: 'my-custom-template-lookup',
    });

    await expectAsync(lookupHarness.getAriaLabelledby()).toBeResolvedTo(
      jasmine.stringMatching(/sky-id-gen__[0-9]+__[0-9]+/),
    );
  });

  describe('without input box', () => {
    it('should create a harness', async () => {
      const { lookupInputHarness } = await setupTest({
        dataSkyId: 'my-basic-lookup',
      });

      await lookupInputHarness.focus();

      await expectAsync(lookupInputHarness.isFocused()).toBeResolvedTo(true);
    });
  });
});
