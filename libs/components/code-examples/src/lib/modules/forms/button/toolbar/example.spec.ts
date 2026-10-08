import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { FormsButtonToolbarExample } from './example';

describe('Toolbar buttons example', () => {
  async function setupTest(dataSkyId: string): Promise<{
    harness: SkyButtonHarness;
  }> {
    const fixture = TestBed.createComponent(FormsButtonToolbarExample);

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

  describe('New button', () => {
    it('should display with the expected styles', async () => {
      const { harness } = await setupTest('new-button');

      await expectAsync(harness.getButtonStyle()).toBeResolvedTo('default');
      await expectAsync(harness.getIconName()).toBeResolvedTo('add');
      await expectAsync(harness.getLabelText()).toBeResolvedTo('New');
    });
  });

  describe('Save button', () => {
    it('should display with the expected styles', async () => {
      const { harness } = await setupTest('save-button');

      await expectAsync(harness.getButtonStyle()).toBeResolvedTo('default');
      await expectAsync(harness.getIconName()).toBeResolvedTo('save');
      await expectAsync(harness.getLabelText()).toBeResolvedTo('Save');
    });
  });

  describe('Columns button', () => {
    it('should display with the expected styles', async () => {
      const { harness } = await setupTest('columns-button');

      await expectAsync(harness.getButtonStyle()).toBeResolvedTo('default');
      await expectAsync(harness.getIconName()).toBeResolvedTo(
        'layout-column-three',
      );
      await expectAsync(harness.getLabelText()).toBeResolvedTo('Columns');
    });
  });
});
