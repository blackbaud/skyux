import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyPageLayoutType, SkyPageModule } from '@skyux/pages';

import { SkyPageHarness } from './page-harness';

//#region Test component
@Component({
  selector: 'sky-page-test',
  template: ` <sky-page data-sky-id="test-page" [layout]="layout">
    @if (showPageHeader) {
      <sky-page-header [pageTitle]="pageTitle" />
    }
  </sky-page>`,
  standalone: false,
})
class TestComponent {
  public layout: string | undefined;
  public pageTitle: string | undefined;
  public showPageHeader = true;
}
//#endregion Test component

describe('Page harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    harness: SkyPageHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyPageModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyPageHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyPageHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyPageHarness);
    }

    return { harness, fixture, loader };
  }

  it('should return the layout', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'test-page',
    });

    const layouts: (SkyPageLayoutType | undefined)[] = [
      undefined,
      'none',
      'blocks',
      'fit',
      'list',
      'tabs',
    ];

    for (const layout of layouts) {
      fixture.componentInstance.layout = layout;
      fixture.detectChanges();

      await expectAsync(harness.getLayout()).toBeResolvedTo(layout ?? 'none');
    }
  });

  it('should return the page header harness', async () => {
    const title = 'Page title';
    const { harness, fixture } = await setupTest({
      dataSkyId: 'test-page',
    });
    fixture.componentInstance.pageTitle = title;
    fixture.detectChanges();

    const pageHeaderHarness = await harness.getPageHeader();

    await expectAsync(pageHeaderHarness.getPageTitle()).toBeResolvedTo(title);
  });

  it('throws an error if the page header does not exist when getting the page header harness', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'test-page',
    });
    fixture.componentInstance.showPageHeader = false;
    fixture.detectChanges();

    await expectAsync(harness.getPageHeader()).toBeRejectedWithError(
      'Unable to find a page header with filter(s): undefined.',
    );
  });
});
