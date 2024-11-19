import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLinkListModule, SkyPageLinksInput } from '@skyux/pages';

import { SkyLinkListHarness } from './link-list-harness';

//#region Test component
@Component({
  standalone: true,
  selector: 'sky-link-list-test',
  template: `<sky-link-list
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
});
