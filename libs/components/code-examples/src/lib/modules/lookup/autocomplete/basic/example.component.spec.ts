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
});
