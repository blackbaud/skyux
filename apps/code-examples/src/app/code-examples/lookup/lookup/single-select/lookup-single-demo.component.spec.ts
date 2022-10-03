import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';

import { LookupSingleSelectDemoComponent } from './lookup-single-demo.component';
import { LookupSingleSelectDemoModule } from './lookup-single-demo.module';

describe('Lookup single select demo', () => {
  async function setupTest() {
    const fixture = TestBed.createComponent(LookupSingleSelectDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-name-field' })
      )
    ).queryHarness(SkyLookupHarness);

    return { lookupHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupSingleSelectDemoModule, NoopAnimationsModule],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.getValue()).toBeResolvedTo('Shirley');
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    await lookupHarness.enterText('vick');
    await lookupHarness.selectSearchResult({
      text: 'Vicki',
    });

    expect(
      fixture.componentInstance.favoritesForm.get('favoriteName').value
    ).toEqual([{ name: 'Vicki' }]);
  });
});
