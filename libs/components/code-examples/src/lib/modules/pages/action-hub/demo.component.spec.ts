import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';
import { SkyActionHubHarness } from '@skyux/pages/testing';

import { DemoComponent } from './demo.component';
import { SettingsModalComponent } from './settings-modal.component';

describe('Action hub', () => {
  async function setupTest(): Promise<{
    actionHubHarness: SkyActionHubHarness;
    fixture: ComponentFixture<DemoComponent>;
    loader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const actionHubHarness = await loader.getHarness(
      SkyActionHubHarness.with({
        dataSkyId: 'action-hub',
      }),
    );

    return { actionHubHarness, fixture, loader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, SkyModalTestingModule],
    });
  });

  it('should have correct page title', async () => {
    const { actionHubHarness } = await setupTest();

    expect(await actionHubHarness.getTitle()).toBe('Active accounts');
  });

  it('should show needs-attention items', async () => {
    const { actionHubHarness } = await setupTest();

    expect(
      await actionHubHarness
        .getNeedsAttentionItems()
        .then(
          async (items) =>
            await Promise.all(items.map((item) => item.getText())),
        ),
    ).toEqual([
      '9 updates from portal',
      '8 new messages from online donation',
      '7 possible duplicates from constituent lists',
      '6 updates from portal',
      '5 new messages from online donation',
      '4 possible duplicates from constituent lists',
      '3 update from portal',
      '2 new messages from online donation',
      '1 possible duplicate from constituent lists',
    ]);
  });

  it('should show recent links', async () => {
    const { actionHubHarness } = await setupTest();

    const linkListHarness = await actionHubHarness.getRecentLinks();
    const listItems = await linkListHarness.getListItems();
    expect(await Promise.all(listItems.map((item) => item.getText()))).toEqual([
      'Recent 1',
      'Recent 2',
      'Recent 3',
      'Recent 4',
      'Recent 5',
    ]);
  });

  it('should show related links', async () => {
    const { actionHubHarness } = await setupTest();

    const linkListHarness = await actionHubHarness.getRelatedLinks();
    const listItems = await linkListHarness.getListItems();
    expect(await Promise.all(listItems.map((item) => item.getText()))).toEqual([
      'Link 1',
      'Link 2',
      'Link 3',
    ]);
  });

  it('should show settings links', async () => {
    const { actionHubHarness } = await setupTest();

    const linkListHarness = await actionHubHarness.getSettingsLinks();
    const listItems = await linkListHarness.getListItems();
    expect(await Promise.all(listItems.map((item) => item.getText()))).toEqual([
      'Number',
      'Color',
    ]);
    const modalController = TestBed.inject(SkyModalTestingController);
    modalController.expectNone();
    await listItems[0].click();
    const app = TestBed.inject(ApplicationRef);
    app.tick();
    await app.whenStable();
    modalController.expectCount(1);
    modalController.expectOpen(SettingsModalComponent);
  });
});
