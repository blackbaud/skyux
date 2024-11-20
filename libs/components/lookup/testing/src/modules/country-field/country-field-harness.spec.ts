import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyCountryFieldHarness } from './country-field-harness';
import { CountryFieldHarnessTestComponent } from './fixtures/country-field-harness-test.component';

describe('Country field harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    countryFieldHarness: SkyCountryFieldHarness;
    fixture: ComponentFixture<CountryFieldHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [CountryFieldHarnessTestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CountryFieldHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let countryFieldHarness: SkyCountryFieldHarness | undefined;
    if (options.dataSkyId) {
      countryFieldHarness = await loader.getHarness(
        SkyCountryFieldHarness.with({ dataSkyId: options.dataSkyId }),
      );
    }

    return { countryFieldHarness, fixture, loader };
  }

  it('should focus and blur input', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(countryFieldHarness?.isFocused()).toBeResolvedTo(false);

    await countryFieldHarness?.focus();
    await expectAsync(countryFieldHarness?.isFocused()).toBeResolvedTo(true);

    await countryFieldHarness?.blur();
    await expectAsync(countryFieldHarness?.isFocused()).toBeResolvedTo(false);
  });

  it('should check if country field is disabled', async () => {
    const { fixture, countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(countryFieldHarness?.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();

    await expectAsync(countryFieldHarness?.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if country field is open', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('gr');

    await expectAsync(countryFieldHarness?.isOpen()).toBeResolvedTo(true);
  });

  it('should return search result harnesses', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('gr');

    const results = (await countryFieldHarness?.getSearchResults()) ?? [];

    await expectAsync(results[0].getDescriptorValue()).toBeResolvedTo('Greece');
    await expectAsync(results[0].getText()).toBeResolvedTo('Greece');
  });

  it('should return search results text content', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('gr');

    await expectAsync(
      countryFieldHarness?.getSearchResultsText(),
    ).toBeResolvedTo([
      'Greece',
      'Greenland',
      'Grenada',
      'Montenegro',
      'St. Vincent & Grenadines',
    ]);
  });

  it('should select a search result', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('gr');
    const result = ((await countryFieldHarness?.getSearchResults()) ?? [])[0];
    await result.select();

    await expectAsync(countryFieldHarness?.getValue()).toBeResolvedTo('Greece');
  });

  it('should select a search result using filters', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('gr');
    await countryFieldHarness?.selectSearchResult({
      text: 'Grenada',
    });

    await expectAsync(countryFieldHarness?.getValue()).toBeResolvedTo(
      'Grenada',
    );
  });

  it('should clear the input value', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    // First, set a value on the countryField.
    await countryFieldHarness?.enterText('gr');
    await countryFieldHarness?.selectSearchResult({
      text: 'Greenland',
    });
    await expectAsync(countryFieldHarness?.getValue()).toBeResolvedTo(
      'Greenland',
    );

    // Now, clear the value.
    await countryFieldHarness?.clear();
    await expectAsync(countryFieldHarness?.getValue()).toBeResolvedTo('');
  });

  it('should throw error if getting search results when country field not open', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await expectAsync(
      countryFieldHarness?.getSearchResults(),
    ).toBeRejectedWithError(
      'Unable to retrieve search results. The country field is closed.',
    );
  });

  it('should throw error if filtered search results are empty', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('gr');

    await expectAsync(
      countryFieldHarness?.getSearchResults({
        text: /invalidSearchText/,
      }),
    ).toBeRejectedWithError(
      'Could not find search results matching filter(s): {"text":"/invalidSearchText/"}',
    );
  });

  it('should return an empty array if search results are not filtered', async () => {
    const { countryFieldHarness } = await setupTest({
      dataSkyId: 'country-field',
    });

    await countryFieldHarness?.enterText('invalidSearchText');

    await expectAsync(countryFieldHarness?.getSearchResults()).toBeResolvedTo(
      [],
    );
  });
});
