import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyPageHeaderModule, SkyPageLink } from '@skyux/pages';

import { SkyPageHeaderHarness } from './page-header-harness';

//#region Test component
@Component({
  selector: 'sky-page-header-test',
  template: `
    <sky-page-header
      [pageTitle]="pageTitle"
      [parentLink]="parentLink"
      data-sky-id="test-page-header"
    />
  `,
  standalone: false,
})
class TestComponent {
  public pageTitle: string | undefined;
  public parentLink: SkyPageLink | undefined;
}
//#endregion Test component

describe('Page header harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    harness: SkyPageHeaderHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyPageHeaderModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyPageHeaderHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyPageHeaderHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyPageHeaderHarness);
    }

    return { harness, fixture, loader };
  }

  it('should return the pageTitle', async () => {
    const title = 'Test page title';
    const { harness, fixture } = await setupTest({
      dataSkyId: 'test-page-header',
    });

    fixture.componentInstance.pageTitle = title;
    fixture.detectChanges();

    await expectAsync(harness.getPageTitle()).toBeResolvedTo(title);
  });

  it('should return the parentLink label text', async () => {
    const linkText = 'Parent link';
    const parentLink: SkyPageLink = {
      permalink: { url: '/' },
      label: linkText,
    };
    const { harness, fixture } = await setupTest({
      dataSkyId: 'test-page-header',
    });

    fixture.componentInstance.parentLink = parentLink;
    fixture.detectChanges();

    await expectAsync(harness.getParentLinkText()).toBeResolvedTo(linkText);
  });

  it('should throw error if the parentLink does not exist when getting parentLinkText', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'test-page-header',
    });

    await expectAsync(harness.getParentLinkText()).toBeRejectedWithError(
      'No parent link was found in the page header.',
    );
  });
});
