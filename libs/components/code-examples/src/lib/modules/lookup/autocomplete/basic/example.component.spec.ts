import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { LookupAutocompleteBasicExampleComponent } from './example.component';

describe('Basic autocomplete example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyAutocompleteHarness;
    fixture: ComponentFixture<LookupAutocompleteBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupAutocompleteBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyAutocompleteHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupAutocompleteBasicExampleComponent],
    });
  });

  it('should set up favorite color autocomplete input', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    await harness.focus();
    await harness.enterText('b');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(3);

    await harness.clear();
    await harness.enterText('blu');

    const searchResults = await harness.getSearchResults();
    await expectAsync(searchResults[0].getDescriptorValue()).toBeResolvedTo(
      'Blue',
    );
    await expectAsync(searchResults[0].getText()).toBeResolvedTo('Blue');

    await searchResults[0].select();
    const value =
      fixture.componentInstance.formGroup.get('favoriteColor')?.value;
    expect(value?.name).toBe('Blue');
  });

  it('should expect an error', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    // should not get rid of this
    await expectAsync(harness.getSearchResults()).toBeRejectedWithError(
      'Unable to retrieve search results. The autocomplete is closed.',
    );

    const control = await harness.getControl();

    await control.focus();
    await control.setValue('x');
    const filter = { text: 'Blue' };

    // should get rid of this and expect empty array. Slightly different string 'Could not.... matching'
    await expectAsync(harness.getSearchResults(filter)).toBeRejectedWithError(
      `Could not find search results matching filter(s): ${JSON.stringify(filter)}`,
    );
  });
});
