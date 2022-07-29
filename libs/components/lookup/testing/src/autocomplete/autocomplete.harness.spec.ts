import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { SkyAutocompleteHarness } from './autocomplete.harness';
import { AutocompleteHarnessTestComponent } from './fixtures/autocomplete-harness-test.component';
import { AutocompleteHarnessTestModule } from './fixtures/autocomplete-harness-test.module';

describe('autocomplete harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [AutocompleteHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(AutocompleteHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const lookupHarness = await loader.getHarness(SkyAutocompleteHarness);

    return { fixture, lookupHarness };
  }

  it('should focus and blur input', async () => {
    const { fixture, lookupHarness } = await setupTest();

    fixture.detectChanges();

    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);

    await lookupHarness.focus();
    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(true);

    await lookupHarness.blur();
    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should return information about the search results', async () => {
    const { fixture, lookupHarness } = await setupTest();

    await lookupHarness.enterText('d');

    fixture.detectChanges();

    const options = await lookupHarness.getOptions();
    expect(options).toEqual([{ textContent: 'Red' }]);
  });
});
