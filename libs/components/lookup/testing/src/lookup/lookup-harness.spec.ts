import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { LookupHarnessTestComponent } from './fixtures/lookup-harness-test.component';
import { LookupHarnessTestModule } from './fixtures/lookup-harness-test.module';
import { SkyLookupHarness } from './lookup-harness';

fdescribe('Lookup harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [LookupHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(LookupHarnessTestComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'my_lookup_1' })
    );

    const lookupHarness = await inputBoxHarness.getHarness(SkyLookupHarness);

    return { fixture, lookupHarness };
  }

  it('should focus and blur input', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);

    await lookupHarness.focus();
    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(true);

    await lookupHarness.blur();
    await expectAsync(lookupHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should return information about the search results', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness.enterText('d');

    await expectAsync(lookupHarness.getSearchResults()).toBeResolvedTo([
      { textContent: 'Abed' },
      { textContent: 'Leonard' },
      { textContent: 'Todd' },
    ]);
  });

  it('should select one option from the search results', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness.enterText('d');
    await lookupHarness.selectSearchResult({ textContent: 'Leonard' });

    await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Leonard');
  });

  it('should clear the input value', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness.enterText('d');
    await lookupHarness.selectSearchResult({ textContent: 'Leonard' });

    await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Leonard');

    await lookupHarness.clear();

    await expectAsync(lookupHarness.getValue()).toBeResolvedTo('');
  });

  it('should throw error if retrieving search results when dropdown closed', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.isOpen()).toBeResolvedTo(false);
    await expectAsync(lookupHarness.getSearchResults()).toBeRejectedWithError(
      'Unable to retrieve search results. The autocomplete dropdown is closed.'
    );
  });

  it('should throw error if search results not found with filters', async () => {
    const { lookupHarness } = await setupTest();

    // Enter search text that will result in no matching results.
    await lookupHarness.enterText('1234567890');

    await expectAsync(lookupHarness.isOpen()).toBeResolvedTo(true);

    await expectAsync(
      lookupHarness.selectSearchResult({ textContent: 'foobar' })
    ).toBeRejectedWithError(
      'Could not find search results matching filter(s): {"textContent":"foobar"}'
    );
  });

  it('should check if component is disabled', async () => {
    const { fixture, lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();

    await expectAsync(lookupHarness.isDisabled()).toBeResolvedTo(true);
  });
});
