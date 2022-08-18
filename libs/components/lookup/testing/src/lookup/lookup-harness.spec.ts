import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { LookupHarnessTestComponent } from './fixtures/lookup-harness-test.component';
import { LookupHarnessTestModule } from './fixtures/lookup-harness-test.module';
import { SkyLookupHarness } from './lookup-harness';

describe('Lookup harness', () => {
  async function setupTest(options: { dataSkyId: string }) {
    await TestBed.configureTestingModule({
      imports: [LookupHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(LookupHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let lookupHarness: SkyLookupHarness;

    if (options.dataSkyId === 'my-basic-lookup') {
      lookupHarness = await loader.getHarness(
        SkyLookupHarness.with({ dataSkyId: options.dataSkyId })
      );
    } else {
      const inputBoxHarness = await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId })
      );
      lookupHarness = await inputBoxHarness.queryHarness(SkyLookupHarness);
    }

    return { fixture, lookupHarness };
  }

  describe('single select picker', async () => {
    it('should return search result harnesses', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-single-select-lookup',
      });

      await lookupHarness.enterText('d');

      const results = await lookupHarness.getSearchResults();

      await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Abed');
      await expectAsync(results[0].textContent()).toBeResolvedTo('Abed');
    });

    it('should select one option from the autocomplete results', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-single-select-lookup',
      });

      await expectAsync(lookupHarness.isMulti()).toBeResolvedTo(false);

      await lookupHarness.enterText('d');
      await lookupHarness.selectSearchResult({
        textContent: 'Leonard',
      });

      await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Leonard');
    });

    it('should click the add button', async () => {
      const { fixture, lookupHarness } = await setupTest({
        dataSkyId: 'my-single-select-lookup',
      });

      await lookupHarness.enterText('r');

      const spy = spyOn(fixture.componentInstance, 'onAddClick');

      await lookupHarness.clickAddButton();

      expect(spy).toHaveBeenCalled();
    });

    it('should search and select results from the show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-single-select-lookup',
      });

      await lookupHarness.clickShowMoreButton();

      const picker = await lookupHarness.getShowMorePicker();
      await picker.enterSearchText('rachel');
      await picker.selectSearchResults({ textContent: 'Rachel' });
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Rachel');
    });
  });

  describe('multiselect picker', async () => {
    it('should select the first result from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await lookupHarness.dismissAllSelections();
      await lookupHarness.clickShowMoreButton();

      const picker = await lookupHarness.getShowMorePicker();
      await picker.selectFirstSearchResult();
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
        'Abed',
      ]);
    });

    it('should select multiple results from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await lookupHarness.dismissAllSelections();
      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);

      await lookupHarness.clickShowMoreButton();
      const picker = await lookupHarness.getShowMorePicker();
      await picker.enterSearchText('ra');
      await picker.selectSearchResults({ textContent: /Craig|Rachel/ });
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
        'Craig',
        'Rachel',
      ]);
    });

    it('should select all results from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await lookupHarness.dismissAllSelections();
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

    it('should clear all results from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
        'Shirley',
      ]);

      await lookupHarness.clickShowMoreButton();

      const picker = await lookupHarness.getShowMorePicker();
      await picker.clearAll();
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);
    });

    it('should clear search text in show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
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

    it('should cancel the show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
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

    it('should load more results in the show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await lookupHarness.dismissAllSelections();

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([]);

      await lookupHarness.clickShowMoreButton();

      const picker = await lookupHarness.getShowMorePicker();
      await picker.loadMore();
      await picker.selectSearchResults({ textContent: 'Vicki' });
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
        'Vicki',
      ]);
    });

    it('should throw an error if selecting non-existant result', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await lookupHarness.clickShowMoreButton();
      const picker = await lookupHarness.getShowMorePicker();

      await expectAsync(
        picker.selectSearchResults({ textContent: 'Invalid search' })
      ).toBeRejectedWithError(
        'Could not find search results in the picker matching filter(s): {"textContent":"Invalid search"}'
      );
    });

    it('should throw an error when attempting to get an unopened picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-multiselect-lookup',
      });

      await expectAsync(
        lookupHarness.getShowMorePicker()
      ).toBeRejectedWithError(
        'Cannot get the "Show more" picker because it is not open.'
      );
    });
  });

  describe('async picker', () => {
    it('should return information about the autocomplete results', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-async-lookup',
      });

      await lookupHarness.enterText('d');

      await expectAsync(lookupHarness.getSearchResultsText()).toBeResolvedTo([
        'Abed',
        'Leonard',
        'Todd',
      ]);
    });

    it('should search and select results from the show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-async-lookup',
      });

      await lookupHarness.clickShowMoreButton();

      const picker = await lookupHarness.getShowMorePicker();
      await picker.enterSearchText('rachel');
      await picker.selectSearchResults({ textContent: 'Rachel' });
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
        'Rachel',
      ]);
    });
  });

  describe('without input box', () => {
    it('should create a harness', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my-basic-lookup',
      });

      await lookupHarness.focus();

      await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(true);
    });
  });
});
