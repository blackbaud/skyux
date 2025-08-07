import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarHarnessTestComponent } from './fixtures/toolbar-harness-test.component';
import { SkyToolbarHarness } from './toolbar-harness';

describe('Text expand test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    toolbarHarness: SkyToolbarHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [ToolbarHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToolbarHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const toolbarHarness: SkyToolbarHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyToolbarHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyToolbarHarness);

    return { toolbarHarness };
  }

  it('should get the toolbar and a toolbar item by data-sky-id', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'basic-toolbar',
    });

    await expectAsync(
      toolbarHarness.getItem({ dataSkyId: 'toolbar-button-1' }),
    ).toBeResolved();
  });

  it('should get an array of all toolbar items', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'basic-toolbar',
    });

    const items = await toolbarHarness.getItems();

    expect(items.length).toBe(2);
  });

  it('should get an array of toolbar items based on criteria', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'basic-toolbar',
    });

    const items = await toolbarHarness.getItems({
      dataSkyId: 'toolbar-button-1',
    });

    expect(items.length).toBe(1);
  });

  it('should throw an error if no toolbar items are found', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'empty-toolbar',
    });

    await expectAsync(toolbarHarness.getItems()).toBeRejectedWithError(
      'Unable to find any toolbar items.',
    );
  });

  it('should throw an error if no toolbar items are found matching criteria', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'basic-toolbar',
    });

    await expectAsync(
      toolbarHarness.getItems({ dataSkyId: 'toolbar-item-3' }),
    ).toBeRejectedWithError(
      'Unable to find any toolbar items with filter(s): {"dataSkyId":"toolbar-item-3"}',
    );
  });

  it('should get the toolbar view actions', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'basic-toolbar',
    });

    await expectAsync(toolbarHarness.getViewActions()).toBeResolved();
  });

  it('should throw an error if no toolbar view actions are found', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'empty-toolbar',
    });

    await expectAsync(toolbarHarness.getViewActions()).toBeRejectedWithError(
      'Unable to find toolbar view actions.',
    );
  });

  it('should get a toolbar section by data-sky-id', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    await expectAsync(
      toolbarHarness.getSection({ dataSkyId: 'top-section' }),
    ).toBeResolved();
  });

  it('should get an array of all toolbar sections', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    const items = await toolbarHarness.getSections();

    expect(items.length).toBe(2);
  });

  it('should get an array of toolbar sections based on criteria', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    const items = await toolbarHarness.getSections({
      dataSkyId: 'top-section',
    });

    expect(items.length).toBe(1);
  });

  it('should throw an error if no toolbar sections are found', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'empty-toolbar',
    });

    await expectAsync(toolbarHarness.getSections()).toBeRejectedWithError(
      'Unable to find any toolbar sections.',
    );
  });

  it('should throw an error if no toolbar sections are found matching criteria', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    await expectAsync(
      toolbarHarness.getSections({ dataSkyId: 'middle-section' }),
    ).toBeRejectedWithError(
      'Unable to find any toolbar sections with filter(s): {"dataSkyId":"middle-section"}',
    );
  });

  it('should get a toolbar section item by data-sky-id', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'top-section',
    });

    await expectAsync(
      sectionHarness.getItem({ dataSkyId: 'toolbar-button-1' }),
    ).toBeResolved();
  });

  it('should get an array of all toolbar section items', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'top-section',
    });

    const items = await sectionHarness.getItems();

    expect(items.length).toBe(2);
  });

  it('should get an array of toolbar section items based on criteria', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'top-section',
    });

    const items = await sectionHarness.getItems({
      dataSkyId: 'toolbar-button-1',
    });

    expect(items.length).toBe(1);
  });

  it('should throw an error if no toolbar section items are found', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'empty-toolbar-section',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'empty-section',
    });

    await expectAsync(sectionHarness.getItems()).toBeRejectedWithError(
      'Unable to find any toolbar section items.',
    );
  });

  it('should throw an error if no toolbar section items are found matching criteria', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'empty-toolbar-section',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'empty-section',
    });

    await expectAsync(
      sectionHarness.getItems({ dataSkyId: 'toolbar-item-3' }),
    ).toBeRejectedWithError(
      'Unable to find any toolbar section items with filter(s): {"dataSkyId":"toolbar-item-3"}',
    );
  });

  it('should get the toolbar section view actions', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'sectioned-toolbar',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'top-section',
    });

    await expectAsync(sectionHarness.getViewActions()).toBeResolved();
  });

  it('should throw an error if no toolbar section view actions are found', async () => {
    const { toolbarHarness } = await setupTest({
      dataSkyId: 'empty-toolbar-section',
    });

    const sectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'empty-section',
    });

    await expectAsync(sectionHarness.getViewActions()).toBeRejectedWithError(
      'Unable to find toolbar section view actions.',
    );
  });
});
