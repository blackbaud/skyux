import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyActionButtonContainerAlignItemsType,
  SkyActionButtonModule,
} from '@skyux/layout';

import { SkyActionButtonContainerHarness } from './action-button-container-harness';

@Component({
  standalone: true,
  imports: [SkyActionButtonModule],
  template: `
    <sky-action-button-container [alignItems]="alignItems">
      <sky-action-button>
        <sky-action-button-icon iconName="filter" />
        <sky-action-button-header> Build a new list </sky-action-button-header>
        <sky-action-button-details>
          Start from scratch and fine-tune with filters.
        </sky-action-button-details>
      </sky-action-button>
      <sky-action-button>
        <sky-action-button-icon iconName="folder-open" />
        <sky-action-button-header> Open a saved list </sky-action-button-header>
      </sky-action-button>
    </sky-action-button-container>

    <sky-action-button-container data-sky-id="other-container">
      <sky-action-button>
        <sky-action-button-icon iconName="filter" />
        <sky-action-button-header> Build a new list </sky-action-button-header>
        <sky-action-button-details>
          Start from scratch and fine-tune with filters.
        </sky-action-button-details>
      </sky-action-button>
    </sky-action-button-container>
  `,
})
class TestComponent {
  public alignItems: SkyActionButtonContainerAlignItemsType = 'center';
}

describe('Action button container harness', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    harness: SkyActionButtonContainerHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyActionButtonContainerHarness;

    if (options?.dataSkyId) {
      harness = await loader.getHarness(
        SkyActionButtonContainerHarness.with({
          dataSkyId: options?.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyActionButtonContainerHarness);
    }

    return { harness, fixture };
  }

  it('should get the container by data-sky-id', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'other-container',
    });
    const actionButtons = await harness.getActionButtons();

    expect(actionButtons.length).toBe(1);
  });

  it('should get item alignment', async () => {
    const { harness, fixture } = await setupTest();

    await expectAsync(harness.getAlignment()).toBeResolvedTo('center');

    fixture.componentInstance.alignItems = 'left';
    fixture.detectChanges();

    await expectAsync(harness.getAlignment()).toBeResolvedTo('left');
  });

  it('should get all action buttons', async () => {
    const { harness } = await setupTest();

    const actionButtons = await harness.getActionButtons();

    expect(actionButtons.length).toBe(2);
  });

  it('should get action button from header', async () => {
    const { harness } = await setupTest();

    const actionButton = await harness.getActionButton({
      header: 'Build a new list',
    });

    await expectAsync(actionButton.getIconType()).toBeResolvedTo('filter');
  });
});
