import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { RepeaterHarnessTestItemHarness } from './fixtures/repeater-harness-test-item-harness';
import { RepeaterHarnessTestComponent } from './fixtures/repeater-harness-test.component';
import { RepeaterHarnessTestModule } from './fixtures/repeater-harness-test.module';
import { SkyRepeaterHarness } from './repeater-harness';
import { SkyRepeaterItemHarness } from './repeater-item-harness';

async function setupTest(options: { dataSkyId?: string } = {}) {
  await TestBed.configureTestingModule({
    imports: [RepeaterHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(RepeaterHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const repeaterHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyRepeaterHarness.with({
          dataSkyId: options.dataSkyId,
        })
      )
    : await loader.getHarness(SkyRepeaterHarness);

  return { repeaterHarness, fixture, loader };
}

describe('Repeater harness', () => {
  it('should get child repeater items', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    expect(items.length).toEqual(2);
    expect(items[0] instanceof SkyRepeaterItemHarness).toBeTrue();
  });

  it('should select and deselect an item', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    await expectAsync(items[0].isSelectable()).toBeResolvedTo(false);

    fixture.componentInstance.selectable = true;

    const item = items[0];

    await expectAsync(item.isSelected()).toBeResolvedTo(false);
    await expectAsync(item.isSelectable()).toBeResolvedTo(true);

    await item.select();

    await expectAsync(item.isSelected()).toBeResolvedTo(true);

    await item.deselect();

    await expectAsync(item.isSelected()).toBeResolvedTo(false);
  });

  it('should throw an error if (de)selecting an unselectable item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isSelected()).toBeRejectedWithError(
      'Could not determine if repeater item is selected because it is not selectable.'
    );
    await expectAsync(item.select()).toBeRejectedWithError(
      'Could not select the repeater item because it is not selectable.'
    );
    await expectAsync(item.deselect()).toBeRejectedWithError(
      'Could not deselect the repeater item because it is not selectable.'
    );
  });

  it('should find items by `data-sky-id` attributes', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      dataSkyId: 'my-basic-repeater-item-0',
    });

    expect(items.length).toEqual(1);
  });

  it('should find items by title text', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      titleText: 'Call Robert Hernandez',
    });

    await expectAsync(items[0].getTitleText()).toBeResolvedTo(
      'Call Robert Hernandez'
    );
  });

  it('should find items by body text', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      contentText: /We should call him to thank him/,
    });

    await expectAsync(items[0].getContentText()).toBeResolvedTo(
      'Robert recently gave a very generous gift. We should call him to thank him.'
    );
  });

  it('should allow querying harnesses inside an item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      contentText: /We should call him to thank him/,
    });

    const noteHarness = await items[0].queryHarness(
      RepeaterHarnessTestItemHarness
    );

    expect(noteHarness).not.toBeNull();
    await expectAsync((await noteHarness!.host()).text()).toBeResolvedTo(
      'Robert recently gave a very generous gift. We should call him to thank him.'
    );
  });
});
