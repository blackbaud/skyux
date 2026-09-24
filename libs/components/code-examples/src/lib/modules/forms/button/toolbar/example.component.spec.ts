import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { FormsButtonToolbarExampleComponent } from './example.component';

describe('Toolbar buttons example', () => {
  async function setupTest(dataSkyId: string): Promise<{
    harness: SkyButtonHarness;
    loader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(FormsButtonToolbarExampleComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, loader };
  }

  describe('New button', () => {
    it('should display with the expected styles', async () => {
      const { harness } = await setupTest('new-button');

      await expectAsync(harness.getButtonStyle()).toBeResolvedTo('default');
      await expectAsync(harness.getIconName()).toBeResolvedTo('add');
      await expectAsync(harness.getLabelText()).toBeResolvedTo('New');
    });
  });
});
