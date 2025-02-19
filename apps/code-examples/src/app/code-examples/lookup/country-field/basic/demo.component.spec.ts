import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLiveAnnouncerTestingModule } from '@skyux/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyCountryFieldHarness } from '@skyux/lookup/testing';

import { DemoComponent } from './demo.component';

describe('Basic country field demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyCountryFieldHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
      )
    ).queryHarness(SkyCountryFieldHarness);

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, SkyLiveAnnouncerTestingModule],
    });
  });

  it('should set up country field input', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'country-field',
    });

    await harness.focus();
    await harness.enterText('ger');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(4);

    await harness.clear();
    await harness.enterText('can');

    const searchResults = await harness.getSearchResults();
    await expectAsync(searchResults[1].getText()).toBeResolvedTo('Canada');

    await searchResults[1].select();
    const value = fixture.componentInstance.countryForm.get('country')?.value;
    expect(value?.name).toBe('Canada');
  });
});
