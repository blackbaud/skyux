import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyActionButtonModule, SkyActionButtonPermalink } from '@skyux/layout';

import { SkyActionButtonHarness } from './action-button-harness';

@Component({
  standalone: true,
  imports: [SkyActionButtonModule],
  template: `
    <sky-action-button
      data-sky-id="action-button"
      (actionClick)="filterActionClick()"
    >
      <sky-action-button-icon iconName="filter" />
      <sky-action-button-header> Build a new list </sky-action-button-header>
      <sky-action-button-details>
        Start from scratch and fine-tune with filters.
      </sky-action-button-details>
    </sky-action-button>
    <sky-action-button data-sky-id="other-button" [permalink]="url">
      <sky-action-button-icon iconName="folder-open" />
      <sky-action-button-header> Open a list </sky-action-button-header>
      <sky-action-button-details>
        Start from scratch and fine-tune with filters.
      </sky-action-button-details>
    </sky-action-button>
  `,
})
class TestComponent {
  public url: SkyActionButtonPermalink = {
    url: 'google.com',
  };

  public filterActionClick() {
    // just for the spy
  }
}

describe('Action button harness', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    harness: SkyActionButtonHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyActionButtonHarness;

    if (options?.dataSkyId) {
      harness = await loader.getHarness(
        SkyActionButtonHarness.with({
          dataSkyId: options?.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyActionButtonHarness);
    }

    return { harness, fixture };
  }

  it('should get the action button by data-sky-id', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'other-button',
    });

    await expectAsync(harness.getIconType()).toBeResolvedTo('folder-open');
  });

  it('should click the action button', async () => {
    const { harness, fixture } = await setupTest();

    const spy = spyOn(fixture.componentInstance, 'filterActionClick');
    await harness.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should get the header text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeaderText()).toBeResolvedTo(
      'Build a new list',
    );
  });

  it('should get the details text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getDetailsText()).toBeResolvedTo(
      'Start from scratch and fine-tune with filters.',
    );
  });

  it('should get the icon type', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getIconType()).toBeResolvedTo('filter');
  });

  it('should get the link', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'other-button',
    });

    const check = (await harness.getLink())?.endsWith('google.com');

    expect(check).toBeTrue();
  });
});
