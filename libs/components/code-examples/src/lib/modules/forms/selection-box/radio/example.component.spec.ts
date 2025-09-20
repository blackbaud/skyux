import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyIdService } from '@skyux/core';
import { SkySelectionBoxGridHarness } from '@skyux/forms/testing';

import { FormsSelectionBoxRadioExampleComponent } from './example.component';

let index: number;

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  selectionBoxGridHarness: SkySelectionBoxGridHarness;
}> {
  await TestBed.configureTestingModule({
    imports: [FormsSelectionBoxRadioExampleComponent, NoopAnimationsModule],
  }).compileComponents();

  spyOn(TestBed.inject(SkyIdService), 'generateId').and.callFake(
    () => `MOCK_ID_${++index}`,
  );

  index = 0;
  const fixture = TestBed.createComponent(
    FormsSelectionBoxRadioExampleComponent,
  );
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

describe('Selection box radio example', () => {
  it('should set up the component', async () => {
    const { selectionBoxGridHarness } = await setupTest();

    const selectionBoxHarnesses =
      await selectionBoxGridHarness.getSelectionBoxes();

    expect(selectionBoxHarnesses.length).toBe(3);

    await expectAsync(selectionBoxHarnesses[0].getHeaderText()).toBeResolvedTo(
      'Save time and effort',
    );
    await expectAsync(
      selectionBoxHarnesses[1].getDescriptionText(),
    ).toBeResolvedTo(
      'Encourage supporters to interact with your organization.',
    );
    await expectAsync(
      (await selectionBoxHarnesses[2].getIcon())?.getIconName(),
    ).toBeResolvedTo('people-team');

    await (await selectionBoxHarnesses[0].getControl()).check();
  });
});
