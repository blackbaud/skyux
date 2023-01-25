import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { LookupMultipleSelectDemoComponent } from './lookup-multiple-demo.component';
import { LookupMultipleSelectDemoModule } from './lookup-multiple-demo.module';

describe('Lookup multi-select demo', () => {
  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness | null;
    fixture: ComponentFixture<LookupMultipleSelectDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(LookupMultipleSelectDemoComponent);
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
      imports: [LookupMultipleSelectDemoModule, NoopAnimationsModule],
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

    await lookupHarness?.enterText('vick');
    await lookupHarness?.selectSearchResult({
      text: 'Vicki',
    });

    expect(
      fixture.componentInstance.favoritesForm.controls.favoriteNames.value
    ).toEqual([{ name: 'Shirley' }, { name: 'Vicki' }]);
  });
});
