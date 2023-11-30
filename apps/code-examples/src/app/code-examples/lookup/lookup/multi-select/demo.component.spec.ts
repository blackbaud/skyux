import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { DemoComponent } from './demo.component';

describe('Lookup multi-select demo', () => {
  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness | null;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
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
      imports: [DemoComponent, NoopAnimationsModule],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness?.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    await lookupHarness?.enterText('be');
    await lookupHarness?.selectSearchResult({
      text: 'Ben',
    });

    expect(
      fixture.componentInstance.favoritesForm.controls.favoriteNames.value
    ).toEqual([{ name: 'Shirley' }, { name: 'Ben' }]);
  });

  it('should respect the selection descriptor', async () => {
    const { lookupHarness } = await setupTest();

    await lookupHarness?.clickShowMoreButton();

    const picker = await lookupHarness?.getShowMorePicker();

    await expectAsync(picker?.getSearchAriaLabel()).toBeResolvedTo(
      'Search names'
    );
    await expectAsync(picker?.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select names'
    );
  });
});
