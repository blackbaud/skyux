import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyIdService } from '@skyux/core';

import { SelectionBoxHarnessTestComponent } from './fixtures/selection-box-harness-test.component';
import { SkySelectionBoxGridHarness } from './selection-box-grid-harness';

let index: number;

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  selectionBoxGridHarness: SkySelectionBoxGridHarness;
}> {
  await TestBed.configureTestingModule({
    imports: [SelectionBoxHarnessTestComponent, NoopAnimationsModule],
  }).compileComponents();

  index = 0;
  spyOn(TestBed.inject(SkyIdService), 'generateId').and.callFake(
    () => `MOCK_ID_${++index}`,
  );

  const fixture = TestBed.createComponent(SelectionBoxHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const selectionBoxGridHarness: SkySelectionBoxGridHarness = options.dataSkyId
    ? await loader.getHarness(
        SkySelectionBoxGridHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkySelectionBoxGridHarness);

  return { selectionBoxGridHarness };
}

describe('Selection box harness', () => {
  it('should get the selection box grid and selection boxes by data-sky-id', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    await expectAsync(
      selectionBoxGridHarness.getSelectionBox({ dataSkyId: 'clock' }),
    ).toBeResolved();
  });

  it('should get an array of all selection boxes', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const selectionBoxes = await selectionBoxGridHarness.getSelectionBoxes();

    expect(selectionBoxes.length).toBe(4);
  });

  it('should get an array of selection boxes based on criteria', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const selectionBoxes = await selectionBoxGridHarness.getSelectionBoxes({
      dataSkyId: 'clock',
    });

    expect(selectionBoxes.length).toBe(1);
  });

  it('should get the selection box header text', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const selectionBoxHarness = await selectionBoxGridHarness.getSelectionBox({
      dataSkyId: 'clock',
    });

    await expectAsync(selectionBoxHarness.getHeaderText()).toBeResolvedTo(
      'Save time and effort',
    );
  });

  it('should get the selection box description text', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const selectionBoxHarness = await selectionBoxGridHarness.getSelectionBox({
      dataSkyId: 'clock',
    });

    await expectAsync(selectionBoxHarness.getDescriptionText()).toBeResolvedTo(
      'Automate mundane tasks and spend more time on the things that matter.',
    );
  });

  it('should return empty string when headers or descriptions are not present', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const selectionBoxHarness = await selectionBoxGridHarness.getSelectionBox({
      dataSkyId: 'empty-box',
    });

    await expectAsync(selectionBoxHarness.getHeaderText()).toBeResolvedTo('');
    await expectAsync(selectionBoxHarness.getDescriptionText()).toBeResolvedTo(
      '',
    );
  });

  it('should get the selection box icon', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const iconHarness = await (
      await selectionBoxGridHarness.getSelectionBox({ dataSkyId: 'clock' })
    ).getIcon();

    await expectAsync(iconHarness?.getIconName()).toBeResolvedTo('clock');
  });

  it('should get the selection box checkbox', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'checkbox-selection-boxes',
    });

    const checkboxHarness = await (
      await selectionBoxGridHarness.getSelectionBox({ dataSkyId: 'clock' })
    ).getControl();

    await expectAsync(checkboxHarness.check()).toBeResolved();
  });

  it('should get the selection box radio button', async () => {
    const { selectionBoxGridHarness } = await setupTest({
      dataSkyId: 'radio-selection-boxes',
    });

    const radioHarness = await (
      await selectionBoxGridHarness.getSelectionBoxes()
    )[0].getControl();

    await expectAsync(radioHarness.check()).toBeResolved();
  });
});
