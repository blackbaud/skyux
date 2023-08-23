import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { SearchHarnessTestComponent } from './fixtures/search-harness-test.component';
import { SearchHarnessTestModule } from './fixtures/search-harness-test.module';
import { SkySearchHarness } from './search-harness';

describe('Search harness', () => {
  async function setupTest(options: { dataSkyId: string }) {
    await TestBed.configureTestingModule({
      imports: [SearchHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(SearchHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const searchHarness = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: options.dataSkyId })
    );

    return { searchHarness, fixture, loader };
  }

  it('should focus and blur input', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await expectAsync(searchHarness?.isFocused()).toBeResolvedTo(false);

    await searchHarness?.focus();
    await expectAsync(searchHarness?.isFocused()).toBeResolvedTo(true);

    await searchHarness?.blur();
    await expectAsync(searchHarness?.isFocused()).toBeResolvedTo(false);
  });

  it('should get ARIA attributes', async () => {
    const { searchHarness, fixture } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await expectAsync(searchHarness.getAriaLabel()).toBeResolvedTo(null);
    await expectAsync(searchHarness.getAriaLabelledby()).toBeResolvedTo(
      'foo-search-id'
    );

    fixture.componentInstance.ariaLabel = 'Search emails';
    fixture.componentInstance.ariaLabelledBy = undefined;

    fixture.detectChanges();

    await expectAsync(searchHarness.getAriaLabel()).toBeResolvedTo(
      'Search emails'
    );
    await expectAsync(searchHarness.getAriaLabelledby()).toBeResolvedTo(null);
  });

  it('should check if search is disabled', async () => {
    const { fixture, searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    await expectAsync(searchHarness?.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disabled = true;

    await expectAsync(searchHarness?.isDisabled()).toBeResolvedTo(true);
  });

  it('should clear the input value', async () => {
    const { searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    // First, set a value on the search.
    await searchHarness?.enterText('green');
    await expectAsync(searchHarness?.getValue()).toBeResolvedTo('green');

    // Now, clear the value.
    await searchHarness?.clear();
    await expectAsync(searchHarness?.getValue()).toBeResolvedTo('');
  });

  it('should get the placeholder value', async () => {
    const { fixture, searchHarness } = await setupTest({
      dataSkyId: 'my-search-1',
    });

    fixture.componentInstance.placeholderText = 'My placeholder text.';

    await expectAsync(searchHarness?.getPlaceholderText()).toBeResolvedTo(
      'My placeholder text.'
    );
  });
});
