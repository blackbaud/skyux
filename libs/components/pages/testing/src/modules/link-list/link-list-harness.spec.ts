import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLinkListModule, SkyPageLinksInput } from '@skyux/pages';

import { SkyLinkListHarness } from './link-list-harness';
import { SkyLinkListItemHarness } from './link-list-item-harness';

//#region Test component
@Component({
  selector: 'sky-link-list-test',
  template: ` <sky-link-list
    data-sky-id="test-list"
    [links]="inputLinks()"
    headingText="Heading Text"
  >
    @if (showLinks()) {
      <sky-link-list-item><a href="#">Link 1</a></sky-link-list-item>
    }
  </sky-link-list>`,
  imports: [SkyLinkListModule],
})
class TestComponent {
  public readonly showLinks = input<boolean>(true);
  public readonly inputLinks = input<SkyPageLinksInput>();
}

//#endregion Test component

describe('Link list harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    harness: SkyLinkListHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyLinkListHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyLinkListHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyLinkListHarness);
    }

    return { harness, fixture, loader };
  }

  it('should return the wait status', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'test-list',
    });
    fixture.detectChanges();

    await expectAsync(harness.isWaiting()).toBeResolvedTo(false);

    fixture.componentRef.setInput('showLinks', false);
    fixture.componentRef.setInput('inputLinks', 'loading');
    await expectAsync(harness.isWaiting()).toBeResolvedTo(true);
  });

  it('should return the heading text', async () => {
    const { harness, fixture } = await setupTest();
    fixture.detectChanges();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo('Heading Text');

    fixture.componentRef.setInput('showLinks', false);
    await expectAsync(harness.getHeadingText()).toBeResolvedTo(undefined);
  });

  it('should return the visibility', async () => {
    const { harness, fixture } = await setupTest();
    fixture.detectChanges();

    await expectAsync(harness.isVisible()).toBeResolvedTo(true);

    fixture.componentRef.setInput('showLinks', false);
    await expectAsync(harness.isVisible()).toBeResolvedTo(false);
  });

  it('should retrieve list items', async () => {
    const { fixture, loader } = await setupTest();
    fixture.componentRef.setInput('inputLinks', [
      {
        label: 'Test Link 1',
        permalink: {
          url: '#',
        },
      },
      {
        label: 'Test Link 2',
        permalink: {
          url: '#',
        },
      },
    ]);
    fixture.detectChanges();

    const links = await loader.getAllHarnesses(SkyLinkListItemHarness);
    expect(links).toHaveSize(2);
    await expectAsync(
      loader
        .getHarness(
          SkyLinkListItemHarness.with({
            text: 'Test Link 2',
          }),
        )
        .then((harness) => harness.getText()),
    ).toBeResolvedTo('Test Link 2');
  });

  it('should get all list items using harness method', async () => {
    const { harness, fixture } = await setupTest();
    fixture.componentRef.setInput('inputLinks', [
      {
        label: 'Test Link 1',
        permalink: {
          url: '#',
        },
      },
      {
        label: 'Test Link 2',
        permalink: {
          url: '#',
        },
      },
    ]);
    fixture.detectChanges();

    const items = await harness.getListItems();
    expect(items.length).toBe(2);
    await expectAsync(items[0].getText()).toBeResolvedTo('Test Link 1');
    await expectAsync(items[1].getText()).toBeResolvedTo('Test Link 2');
  });

  it('should return empty array when no list items exist and no filters provided', async () => {
    const { harness, fixture } = await setupTest();
    fixture.componentRef.setInput('inputLinks', []);
    fixture.componentRef.setInput('showLinks', false);
    fixture.detectChanges();

    const items = await harness.getListItems();
    expect(items.length).toBe(0);
  });

  it('should get a specific list item using harness method', async () => {
    const { harness, fixture } = await setupTest();
    fixture.componentRef.setInput('inputLinks', [
      {
        label: 'Test Link 1',
        permalink: {
          url: '#',
        },
      },
      {
        label: 'Test Link 2',
        permalink: {
          url: '#',
        },
      },
    ]);
    fixture.detectChanges();

    const item = await harness.getListItem({ text: 'Test Link 2' });
    await expectAsync(item.getText()).toBeResolvedTo('Test Link 2');
  });

  it('should get filtered list items using harness method', async () => {
    const { harness, fixture } = await setupTest();
    fixture.componentRef.setInput('inputLinks', [
      {
        label: 'Test Link 1',
        permalink: {
          url: '#',
        },
      },
      {
        label: 'Test Link 2',
        permalink: {
          url: '#',
        },
      },
    ]);
    fixture.detectChanges();

    const items = await harness.getListItems({ text: 'Test Link 1' });
    expect(items.length).toBe(1);
    await expectAsync(items[0].getText()).toBeResolvedTo('Test Link 1');
  });
});
