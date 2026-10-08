import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { FormsButtonPermalinkExample } from './example';

describe('Permalink button example', () => {
  async function setupTest(dataSkyId: string): Promise<{
    harness: SkyButtonHarness;
  }> {
    const fixture = TestBed.createComponent(FormsButtonPermalinkExample);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness };
  }

  it('should display the expected button', async () => {
    const { harness } = await setupTest('permalink-button');

    await expectAsync(harness.getLabelText()).toBeResolvedTo(
      'Go to blackbaud.com',
    );

    await expectAsync(harness.getLink()).toBeResolvedTo(
      'https://www.blackbaud.com/',
    );
  });
});
