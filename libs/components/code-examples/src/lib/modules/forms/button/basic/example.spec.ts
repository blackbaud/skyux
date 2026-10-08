import { HarnessLoader } from '@angular/cdk/testing';
import { TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SkyConfirmHarness } from '@skyux/modals/testing';
import { FormsButtonBasicExample } from './example';

describe('Basic button example', () => {
  async function setupTest(dataSkyId: string): Promise<{
    harness: SkyButtonHarness;
    rootLoader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(FormsButtonBasicExample);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const harness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, rootLoader };
  }

  it('should display the expected button', async () => {
    const { harness } = await setupTest('simple-button');

    await expectAsync(harness.getButtonStyle()).toBeResolvedTo('primary');
    await expectAsync(harness.getLabelText()).toBeResolvedTo('Simple button');
  });

  it('should display a confirm when clicked', async () => {
    const { harness, rootLoader } = await setupTest('simple-button');

    await harness.click();

    const confirmHarness = await rootLoader.getHarness(SkyConfirmHarness);

    await expectAsync(confirmHarness.getMessageText()).toBeResolvedTo(
      'You clicked the simple button!',
    );

    await confirmHarness.clickOkButton();
  });
});
