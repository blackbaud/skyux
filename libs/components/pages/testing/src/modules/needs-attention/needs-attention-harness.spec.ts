import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyActionHubNeedsAttention,
  SkyNeedsAttentionModule,
} from '@skyux/pages';

import { SkyNeedsAttentionHarness } from './needs-attention-harness';
import { SkyNeedsAttentionItemHarness } from './needs-attention-item-harness';

//#region Test component
@Component({
  standalone: true,
  selector: 'sky-needs-attention-test',
  template: ` <sky-needs-attention
    data-sky-id="needs-attention"
    [items]="items()"
  />`,
  imports: [SkyNeedsAttentionModule],
})
class TestComponent {
  public readonly items = input<SkyActionHubNeedsAttention[]>([]);
}

//#endregion Test component

describe('Needs attention harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
      items?: SkyActionHubNeedsAttention[] | undefined;
    } = {},
  ): Promise<{
    harness: SkyNeedsAttentionHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    if (options.items) {
      fixture.componentRef.setInput('items', options.items);
    }

    let harness: SkyNeedsAttentionHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyNeedsAttentionHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyNeedsAttentionHarness);
    }

    return { harness, fixture, loader };
  }

  it('should return the heading text', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'needs-attention',
    });
    fixture.detectChanges();

    await expectAsync(harness.getTitle()).toBeResolvedTo('Needs attention');
  });

  it('should return the empty list text', async () => {
    const { harness, fixture } = await setupTest();
    fixture.detectChanges();

    await expectAsync(harness.hasItems()).toBeResolvedTo(false);
    await expectAsync(harness.getEmptyListText()).toBeResolvedTo(
      'No issues currently need attention',
    );
  });

  it('should return the list items', async () => {
    const { harness, fixture, loader } = await setupTest({
      items: [
        {
          title: 'Item 1',
          permalink: {
            url: '#',
          },
        },
      ],
    });
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(harness.hasItems()).toBeResolvedTo(true);
    await expectAsync(harness.getEmptyListText()).toBeResolvedTo(undefined);
    const items = await loader.getAllHarnesses(SkyNeedsAttentionItemHarness);
    expect(items).toHaveSize(1);
    await expectAsync(items[0].getText()).toBeResolvedTo('Item 1');
  });
});
