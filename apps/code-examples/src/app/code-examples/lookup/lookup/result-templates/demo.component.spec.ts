import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { DemoComponent } from './demo.component';
import { ItemHarness } from './item-harness';

describe('Lookup result templates demo', () => {
  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness | null;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);

    return { lookupHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
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
      results && (await results[0].queryHarness(ItemHarness));

    await expectAsync(templateItemHarness?.getName()).toBeResolvedTo('Abed');
    await expectAsync(templateItemHarness?.getFormalName()).toBeResolvedTo(
      'Mr. Nadir',
    );
  });

  it('should use the expected modal item template', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness?.clickShowMoreButton();

    const pickerHarness = await lookupHarness?.getShowMorePicker();
    await pickerHarness?.enterSearchText('be');

    const results = await pickerHarness?.getSearchResults();
    const templateItemHarness =
      results && (await results[0].queryHarness(ItemHarness));

    await expectAsync(templateItemHarness?.getName()).toBeResolvedTo('Abed');
    await expectAsync(templateItemHarness?.getFormalName()).toBeResolvedTo(
      'Mr. Nadir',
    );
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    await lookupHarness?.enterText('be');

    const allResultHarnesses = await lookupHarness?.getSearchResults();
    const firstResultHarness = allResultHarnesses && allResultHarnesses[0];
    await firstResultHarness?.select();

    expect(
      fixture.componentInstance.favoritesForm.controls.favoriteNames.value,
    ).toEqual([
      { name: 'Shirley', formal: 'Ms. Bennett' },
      { name: 'Abed', formal: 'Mr. Nadir' },
    ]);
  });

  it('should respect the selection descriptor', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness?.clickShowMoreButton();

    const picker = await lookupHarness?.getShowMorePicker();

    await expectAsync(picker?.getSearchAriaLabel()).toBeResolvedTo(
      'Search names',
    );
    await expectAsync(picker?.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select names',
    );
  });
});
