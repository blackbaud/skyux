import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { LookupResultTemplatesDemoComponent } from './lookup-result-templates-demo.component';
import { LookupResultTemplatesDemoModule } from './lookup-result-templates-demo.module';
import { LookupResultTemplatesItemHarness } from './lookup-result-templates-item-harness';

describe('Lookup result templates demo', () => {
  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness | null;
    fixture: ComponentFixture<LookupResultTemplatesDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(LookupResultTemplatesDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' })
      )
    ).queryHarness(SkyLookupHarness);

    return { lookupHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupResultTemplatesDemoModule, NoopAnimationsModule],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness?.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);
  });

  it('should use the expected dropdown item template', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness?.enterText('be');

    const results = await lookupHarness?.getSearchResults();
    const templateItemHarness =
      results &&
      (await results[0].queryHarness(LookupResultTemplatesItemHarness));

    await expectAsync(templateItemHarness?.getName()).toBeResolvedTo('Abed');
    await expectAsync(templateItemHarness?.getFormalName()).toBeResolvedTo(
      'Mr. Nadir'
    );
  });

  it('should use the expected modal item template', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness?.clickShowMoreButton();

    const pickerHarness = await lookupHarness?.getShowMorePicker();
    await pickerHarness?.enterSearchText('be');

    const results = await pickerHarness?.getSearchResults();
    const templateItemHarness =
      results &&
      (await results[0].queryHarness(LookupResultTemplatesItemHarness));

    await expectAsync(templateItemHarness?.getName()).toBeResolvedTo('Abed');
    await expectAsync(templateItemHarness?.getFormalName()).toBeResolvedTo(
      'Mr. Nadir'
    );
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    await lookupHarness?.enterText('be');

    const allResultHarnesses = await lookupHarness?.getSearchResults();
    const firstResultHarness = allResultHarnesses && allResultHarnesses[0];
    await firstResultHarness?.select();

    expect(
      fixture.componentInstance.favoritesForm.controls.favoriteNames.value
    ).toEqual([
      { name: 'Shirley', formal: 'Ms. Bennett' },
      { name: 'Abed', formal: 'Mr. Nadir' },
    ]);
  });
});
