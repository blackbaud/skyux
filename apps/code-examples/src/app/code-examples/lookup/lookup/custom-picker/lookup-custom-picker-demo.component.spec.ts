import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { LookupCustomPickerDemoComponent } from './lookup-custom-picker-demo.component';
import { LookupCustomPickerDemoModule } from './lookup-custom-picker-demo.module';
import { LookupCustomPickerHarness } from './lookup-custom-picker-harness';

describe('Lookup custom picker demo', () => {
  async function setupTest() {
    const fixture = TestBed.createComponent(LookupCustomPickerDemoComponent);
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
      imports: [LookupCustomPickerDemoModule, NoopAnimationsModule],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    await lookupHarness.enterText('vick');

    const firstResultHarness = (await lookupHarness.getSearchResults())[0];
    await firstResultHarness.select();

    expect(fixture.componentInstance.favoritesForm.value.favoriteNames).toEqual(
      [
        { name: 'Shirley', formal: 'Ms. Bennett' },
        { name: 'Vicki', formal: 'Ms. Jenkins' },
      ]
    );
  });

  it('should use a custom picker', async () => {
    const { lookupHarness, fixture } = await setupTest();

    // Show the custom picker.
    await lookupHarness.clickShowMoreButton();

    // Use the custom picker harness to validate that selecting/deslecting items
    // updates the lookup form field.
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const customPickerHarness = await loader.getHarness(
      LookupCustomPickerHarness
    );

    await customPickerHarness.checkItemAt(3); // Britta (Ms. Perry)
    await customPickerHarness.checkItemAt(7); // Garret (Mr. Lambert)
    await customPickerHarness.uncheckItemAt(15); // Shirley (Ms. Bennett)

    await customPickerHarness.save();

    expect(fixture.componentInstance.favoritesForm.value.favoriteNames).toEqual(
      [
        { name: 'Britta', formal: 'Ms. Perry' },
        { name: 'Garrett', formal: 'Mr. Lambert' },
      ]
    );
  });
});
