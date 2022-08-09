import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { SkyAutocompleteHarness } from './autocomplete-harness';
import { AutocompleteHarnessTestComponent } from './fixtures/autocomplete-harness-test.component';
import { AutocompleteHarnessTestModule } from './fixtures/autocomplete-harness-test.module';

describe('Autocomplete harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [AutocompleteHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(AutocompleteHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const autocompleteHarness = await loader.getHarness(
      SkyAutocompleteHarness.with({
        dataSkyId: 'my_autocomplete_2',
      })
    );

    return { fixture, autocompleteHarness };
  }

  it('should focus and blur input', async () => {
    const { fixture, autocompleteHarness } = await setupTest();

    fixture.detectChanges();

    await expectAsync(autocompleteHarness.isFocused()).toBeResolvedTo(false);

    await autocompleteHarness.focus();
    await expectAsync(autocompleteHarness.isFocused()).toBeResolvedTo(true);

    await autocompleteHarness.blur();
    await expectAsync(autocompleteHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should return information about the search results', async () => {
    const { fixture, autocompleteHarness } = await setupTest();

    await autocompleteHarness.enterText('d');

    fixture.detectChanges();

    const results = await autocompleteHarness.getSearchResults();

    expect(results).toEqual([{ textContent: 'Red' }]);
  });
});
