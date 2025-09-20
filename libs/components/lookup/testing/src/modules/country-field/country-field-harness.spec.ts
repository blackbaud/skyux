import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAutocompleteInputHarness } from '../autocomplete/autocomplete-input-harness';

import { SkyCountryFieldHarness } from './country-field-harness';
import { CountryFieldHarnessTestComponent } from './fixtures/country-field-harness-test.component';

describe('Country field harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    countryFieldHarness: SkyCountryFieldHarness;
    countryFieldInputHarness: SkyAutocompleteInputHarness;
    fixture: ComponentFixture<CountryFieldHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [CountryFieldHarnessTestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CountryFieldHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const countryFieldHarness = await loader.getHarness(
      SkyCountryFieldHarness.with({ dataSkyId: options.dataSkyId }),
    );
    const countryFieldInputHarness = await countryFieldHarness.getControl();

    return { countryFieldHarness, countryFieldInputHarness, fixture, loader };
  }

  it('should focus and blur input', async () => {
    const { countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(countryFieldInputHarness.isFocused()).toBeResolvedTo(
      false,
    );

    await countryFieldInputHarness.focus();
    await expectAsync(countryFieldInputHarness.isFocused()).toBeResolvedTo(
      true,
    );

    await countryFieldInputHarness.blur();
    await expectAsync(countryFieldInputHarness.isFocused()).toBeResolvedTo(
      false,
    );
  });

  it('should focus and blur input - deprecated', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(countryFieldHarness.isFocused()).toBeResolvedTo(false);

    await countryFieldHarness.focus();
    await expectAsync(countryFieldHarness.isFocused()).toBeResolvedTo(true);

    await countryFieldHarness.blur();
    await expectAsync(countryFieldHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should check if country field is disabled', async () => {
    const { fixture, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(countryFieldInputHarness.isDisabled()).toBeResolvedTo(
      false,
    );

    fixture.componentInstance.disableForm();

    await expectAsync(countryFieldInputHarness.isDisabled()).toBeResolvedTo(
      true,
    );
  });

  it('should check if country field is disabled - deprecated', async () => {
    const { fixture, countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(countryFieldHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();

    await expectAsync(countryFieldHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if country field is open', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldInputHarness.setValue('gr');

    await expectAsync(countryFieldHarness.isOpen()).toBeResolvedTo(true);
  });

  it('should return search result harnesses', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldInputHarness.setValue('gr');

    const results = (await countryFieldHarness.getSearchResults()) ?? [];

    await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Greece');
    await expectAsync(results[0].getText()).toBeResolvedTo('Greece');
  });

  it('should get a specific search result that meets criteria', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldInputHarness.setValue('gr');

    const result = await countryFieldHarness.getSearchResult({
      text: 'Greece',
    });
    await expectAsync(result.getDescriptorValue()).toBeResolvedTo('Greece');
    await expectAsync(result.getText()).toBeResolvedTo('Greece');
  });

  it('should throw error if getting search result when country field not open', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(
      countryFieldHarness.getSearchResult({ text: 'Greece' }),
    ).toBeRejectedWithError(
      'Unable to retrieve search result. The country field is closed.',
    );
  });

  it('should return search results text content', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldInputHarness.setValue('gr');

    await expectAsync(
      countryFieldHarness.getSearchResultsText(),
    ).toBeResolvedTo([
      'Greece',
      'Greenland',
      'Grenada',
      'Montenegro',
      'St. Vincent & Grenadines',
    ]);
  });

  it('should select a search result', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldInputHarness.setValue('gr');
    const result = ((await countryFieldHarness.getSearchResults()) ?? [])[0];
    await result.select();

    await expectAsync(countryFieldInputHarness.getValue()).toBeResolvedTo(
      'Greece',
    );
  });

  it('should select a search result - deprecated', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness.enterText('gr');
    const result = ((await countryFieldHarness.getSearchResults()) ?? [])[0];
    await result.select();

    await expectAsync(countryFieldHarness.getValue()).toBeResolvedTo('Greece');
  });

  it('should select a search result using filters', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldInputHarness.setValue('gr');
    await countryFieldHarness.selectSearchResult({
      text: 'Grenada',
    });

    await expectAsync(countryFieldInputHarness.getValue()).toBeResolvedTo(
      'Grenada',
    );
  });

  it('should clear the input value', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    // First, set a value on the countryField.
    await countryFieldInputHarness.setValue('gr');
    await countryFieldHarness.selectSearchResult({
      text: 'Greenland',
    });
    await expectAsync(countryFieldInputHarness.getValue()).toBeResolvedTo(
      'Greenland',
    );

    // Now, clear the value.
    await countryFieldInputHarness.clear();
    await expectAsync(countryFieldInputHarness.getValue()).toBeResolvedTo('');
  });

  it('should clear the input value - deprecated', async () => {
    const { countryFieldHarness, countryFieldInputHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    // First, set a value on the countryField.
    await countryFieldInputHarness.setValue('gr');
    await countryFieldHarness.selectSearchResult({
      text: 'Greenland',
    });
    await expectAsync(countryFieldInputHarness.getValue()).toBeResolvedTo(
      'Greenland',
    );

    // Now, clear the value.
    await countryFieldHarness.clear();
    await expectAsync(countryFieldInputHarness.getValue()).toBeResolvedTo('');
  });

  it('should throw error if getting search results when country field not open', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(
      countryFieldHarness.getSearchResults(),
    ).toBeRejectedWithError(
      'Unable to retrieve search results. The country field is closed.',
    );
  });

  it('should return an empty array if search results are not filtered', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await (
      await countryFieldHarness.getControl()
    ).setValue('invalidSearchText');

    await expectAsync(countryFieldHarness.getSearchResults()).toBeResolvedTo(
      [],
    );
  });
});
