import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { LookupHarnessTestComponent } from './fixtures/lookup-harness-test.component';
import { LookupHarnessTestModule } from './fixtures/lookup-harness-test.module';
import { SkyLookupHarness } from './lookup.harness';

describe('Lookup harness', () => {
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
    expect(options).toEqual([
      { textContent: 'Abed' },
      { textContent: 'Leonard' },
      { textContent: 'Todd' },
    ]);
  });
});
