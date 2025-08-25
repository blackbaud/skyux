import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expectAsync } from '@skyux-sdk/testing';
import {
  SkyActionHubModule,
  SkyActionHubNeedsAttentionInput,
  SkyPageLinksInput,
  SkyPageModalLinksInput,
  SkyRecentLinksInput,
} from '@skyux/pages';

import { SkyActionHubHarness } from './action-hub-harness';

//#region Test component
@Component({
  standalone: true,
  selector: 'sky-link-list-test',
  template: ` <sky-action-hub
    data-sky-id="action-hub"
    [needsAttention]="needsAttention()"
    [recentLinks]="recentLinks()"
    [relatedLinks]="relatedLinks()"
    [settingsLinks]="settingsLinks()"
    [title]="title()"
  />`,
  imports: [SkyActionHubModule],
})
class TestComponent {
  public readonly needsAttention = input<SkyActionHubNeedsAttentionInput>();
  public readonly recentLinks = input<SkyRecentLinksInput>();
  public readonly relatedLinks = input<SkyPageLinksInput>();
  public readonly settingsLinks = input<SkyPageModalLinksInput>();
  public readonly title = input<string>('Title');
}

//#endregion Test component

describe('SkyActionHubHarness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    harness: SkyActionHubHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyActionHubHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyActionHubHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyActionHubHarness);
    }

    return { harness, fixture, loader };
  }

  it('should return the title', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'action-hub',
    });

    await expectAsync(harness.getTitle()).toBeResolvedTo('Title');
  });

  it('should return the needs attention block', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('needsAttention', [
      {
        title: 'First item',
        click: jasmine.createSpy('click'),
      },
      {
        title: 'Second item',
        click: jasmine.createSpy('click'),
      },
    ]);
    fixture.detectChanges();

    await expectAsync(
      harness
        .getNeedsAttentionBlock()
        .then((needsAttention) => needsAttention.getTitle()),
    ).toBeResolvedTo('Needs attention');
  });

  it('should get all needs attention items', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('needsAttention', [
      {
        title: 'First item',
        click: jasmine.createSpy('click'),
      },
      {
        title: 'Second item',
        click: jasmine.createSpy('click'),
      },
    ]);
    fixture.detectChanges();

    const items = await harness.getNeedsAttentionItems();
    expect(items.length).toBe(2);

    await expectAsync(
      Promise.all(items.map((item) => item.getText())),
    ).toBeResolvedTo(['First item', 'Second item']);
  });

  it('should get a needs attention item that matches the given filters', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('needsAttention', [
      {
        title: 'First item',
        click: jasmine.createSpy('click'),
      },
      {
        title: 'Second item',
        click: jasmine.createSpy('click'),
      },
    ]);
    fixture.detectChanges();

    const item = await harness.getNeedsAttentionItem({
      text: 'First item',
    });

    await expectAsync(item.getText()).toBeResolvedTo('First item');
    await expectAsync(item.click()).toBeResolved();
  });

  it('should get needs attention items that match the given filters', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('needsAttention', [
      {
        title: 'First item',
        click: jasmine.createSpy('click'),
      },
      {
        title: 'Second item',
        click: jasmine.createSpy('click'),
      },
      {
        title: 'First item',
        click: jasmine.createSpy('click'),
      },
    ]);
    fixture.detectChanges();

    const items = await harness.getNeedsAttentionItems({
      text: 'First item',
    });

    expect(items.length).toBe(2);
    await expectAsync(
      Promise.all(items.map((item) => item.getText())),
    ).toBeResolvedTo(['First item', 'First item']);
  });

  it('should return an empty array if there are no needs attention items', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('needsAttention', []);
    fixture.detectChanges();

    await expectAsync(harness.getNeedsAttentionItems()).toBeResolvedTo([]);
  });

  it('should return the links', async () => {
    const { fixture, harness } = await setupTest();
    fixture.componentRef.setInput('recentLinks', [
      {
        label: 'Recent Link',
        permalink: {
          url: '#',
        },
        lastAccessed: new Date(),
      },
    ]);
    fixture.componentRef.setInput('relatedLinks', [
      {
        label: 'Related Link',
        permalink: {
          url: '#',
        },
      },
    ]);
    fixture.componentRef.setInput('settingsLinks', [
      {
        label: 'Settings Link',
        permalink: {
          url: '#',
        },
      },
    ]);
    fixture.detectChanges();
    fixture.debugElement
      .queryAll(By.css('sky-page-links a'))
      .forEach((element) => {
        element.nativeElement.addEventListener('click', (event: Event) => {
          event.preventDefault();
        });
      });

    await expectAsync(
      harness.getRecentLinks().then((links) => links.isVisible()),
    ).toBeResolvedTo(true);
    await expectAsync(
      harness.getRecentLinks().then(
        async (links) =>
          await (
            await links.getListItems({
              text: 'Recent Link',
            })
          )[0].click(),
      ),
    ).toBeResolved();

    await expectAsync(
      harness.getRelatedLinks().then((links) => links.isVisible()),
    ).toBeResolvedTo(true);
    await expectAsync(
      harness
        .getRelatedLinks()
        .then(async (links) => await (await links.getListItems())[0].click()),
    ).toBeResolved();

    await expectAsync(
      harness.getSettingsLinks().then((links) => links.isVisible()),
    ).toBeResolvedTo(true);
  });
});
