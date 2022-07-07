import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { LookupHarnessTestComponent } from './fixtures/lookup-harness-test.component';
import { LookupHarnessTestModule } from './fixtures/lookup-harness-test.module';
import { SkyLookupHarness } from './lookup.harness';

fdescribe('lookup harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [LookupHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(LookupHarnessTestComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    // const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    // const lookupHarness = await TestbedHarnessEnvironment.harnessForFixture(
    //   fixture,
    //   SkyLookupHarness
    // );

    const lookupHarness = await loader.getHarness(SkyLookupHarness);

    return { fixture, lookupHarness };
  }

  it('should', async () => {
    const { fixture, lookupHarness } = await setupTest();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(lookupHarness.isControlTouched()).toBeResolvedTo(true);

    // await lookupHarness.setValue(14);

    // await expectAsync(lookupHarness.getValue()).toBeResolvedTo();
  });
});
