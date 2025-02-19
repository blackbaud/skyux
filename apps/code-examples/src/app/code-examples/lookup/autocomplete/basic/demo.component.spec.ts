import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLiveAnnouncerTestingModule } from '@skyux/core/testing';
import { SkyAutocompleteHarness } from '@skyux/lookup/testing';

import { DemoComponent } from './demo.component';

describe('Basic autocomplete demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyAutocompleteHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
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
      imports: [DemoComponent, SkyLiveAnnouncerTestingModule],
    });
  });

  it('should set up favorite color autocomplete input', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'favorite-color',
    });
    const control = await harness.getControl();

    await control.focus();
    await control.setValue('b');

    const searchResultsText = await harness.getSearchResultsText();

    expect(searchResultsText.length).toBe(3);

    await control.clear();
    await control.setValue('blu');

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
