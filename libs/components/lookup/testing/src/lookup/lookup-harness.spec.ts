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

    if (options.dataSkyId === 'my_basic_lookup') {
      lookupHarness = await loader.getHarness(
        SkyLookupHarness.with({ dataSkyId: options.dataSkyId })
      );
    } else {
      const inputBoxHarness = await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId })
      );
      lookupHarness = await inputBoxHarness.getHarness(SkyLookupHarness);
    }

    return { fixture, lookupHarness };
  }

  describe('single select picker', async () => {
    it('should focus and blur input', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);

      await lookupHarness.focus();
      await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(true);

      await lookupHarness.blur();
      await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);
    });

    it('should return information about the autocomplete results', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await lookupHarness.enterText('d');

      await expectAsync(lookupHarness.getSearchResults()).toBeResolvedTo([
        { textContent: 'Abed' },
        { textContent: 'Leonard' },
        { textContent: 'Todd' },
      ]);
    });

    it('should clear the input value', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await lookupHarness.enterText('d');
      await lookupHarness.selectSearchResult({ textContent: 'Leonard' });

      await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Leonard');

      await lookupHarness.clear();

      await expectAsync(lookupHarness.getValue()).toBeResolvedTo('');
    });

    it('should error if retrieving results when autocomplete closed', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await expectAsync(lookupHarness.isOpen()).toBeResolvedTo(false);
      await expectAsync(lookupHarness.getSearchResults()).toBeRejectedWithError(
        'Unable to retrieve search results. The autocomplete dropdown is closed.'
      );
    });

    it('should check if lookup is disabled', async () => {
      const { fixture, lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await expectAsync(lookupHarness.isDisabled()).toBeResolvedTo(false);

      fixture.componentInstance.disableForm();

      await expectAsync(lookupHarness.isDisabled()).toBeResolvedTo(true);
    });

    it('should select one option from the autocomplete results', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await lookupHarness.enterText('d');
      await lookupHarness.selectSearchResult({ textContent: 'Leonard' });

      await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Leonard');
    });

    it('should throw error if autocomplete results not found with filters', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      // Enter search text that will result in no matching results.
      await lookupHarness.enterText('1234567890');

      await expectAsync(lookupHarness.isOpen()).toBeResolvedTo(true);

      await expectAsync(
        lookupHarness.selectSearchResult({ textContent: 'foobar' })
      ).toBeRejectedWithError(
        'Could not find search results matching filter(s): {"textContent":"foobar"}'
      );
    });

    it('should click the add button', async () => {
      const { fixture, lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await lookupHarness.enterText('r');

      const spy = spyOn(fixture.componentInstance, 'onAddClick');

      await lookupHarness.clickAddButton();

      expect(spy).toHaveBeenCalled();
    });

    it('should throw an error if show more button clicked when dropdown not open', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await expectAsync(
        lookupHarness.clickShowMoreButton()
      ).toBeRejectedWithError(
        'Unable to find the show more button. The autocomplete dropdown is closed.'
      );
    });

    it('should throw an error if add button clicked when dropdown not open', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      await expectAsync(lookupHarness.clickAddButton()).toBeRejectedWithError(
        'Unable to find the add button. The autocomplete dropdown is closed.'
      );
    });

    it('should throw an error if show more button clicked when it does not exist', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_basic_lookup',
      });

      await lookupHarness.enterText('r');

      await expectAsync(
        lookupHarness.clickShowMoreButton()
      ).toBeRejectedWithError(
        'The show more button cannot be clicked because it does not exist.'
      );
    });

    it('should throw an error if add button clicked when it does not exist', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_basic_lookup',
      });

      await lookupHarness.enterText('r');

      await expectAsync(lookupHarness.clickAddButton()).toBeRejectedWithError(
        'The add button cannot be clicked because it does not exist.'
      );
    });

    it('should search and select results from the show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_single_select_lookup',
      });

      const picker = await lookupHarness.openShowMorePicker();

      await picker.enterSearchText('rachel');
      await picker.selectSearchResults({ textContent: 'Rachel' });
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Rachel');
    });
  });

  describe('multiselect picker', async () => {
    it('should select multiple results from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_multiselect_lookup',
      });

      await lookupHarness.closeTokens();
      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([]);

      const picker = await lookupHarness.openShowMorePicker();

      await picker.enterSearchText('ch');
      await picker.selectSearchResults({ textContent: 'Rachel' });
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([
        { textContent: 'Rachel' },
      ]);
    });

    it('should select all results from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_multiselect_lookup',
      });

      await lookupHarness.closeTokens();
      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([]);

      const picker = await lookupHarness.openShowMorePicker();

      await picker.enterSearchText('ra');
      await picker.selectAll();
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([
        { textContent: 'Craig' },
        { textContent: 'Rachel' },
      ]);
    });

    it('should clear all results from show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_multiselect_lookup',
      });

      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([
        { textContent: 'Shirley' },
      ]);

      const picker = await lookupHarness.openShowMorePicker();

      await picker.clearAll();
      await picker.saveAndClose();

      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([]);
    });

    it('should click cancel button in show more picker', async () => {
      const { lookupHarness } = await setupTest({
        dataSkyId: 'my_multiselect_lookup',
      });

      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([
        { textContent: 'Shirley' },
      ]);

      const picker = await lookupHarness.openShowMorePicker();

      await picker.enterSearchText('ra');
      await picker.selectAll();
      await picker.cancel();

      await expectAsync(lookupHarness.getTokens()).toBeResolvedTo([
        { textContent: 'Shirley' },
      ]);
    });
  });

  // describe('async picker', async () => {});
  // describe('custom picker and result template', async () => {});
});
