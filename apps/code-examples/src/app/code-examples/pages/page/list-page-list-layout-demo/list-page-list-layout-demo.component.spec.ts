import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyPageHarness } from '@skyux/pages/testing';

import { ListPageListLayoutDemoComponent } from './list-page-list-layout-demo.component';
import { ListPageListLayoutDemoModule } from './list-page-list-layout-demo.module';

describe('List page list layout demo', async () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<ListPageListLayoutDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(ListPageListLayoutDemoComponent);

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);

    return { pageHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListPageListLayoutDemoModule, NoopAnimationsModule],
    });
  });

  it('should have a list layout', async () => {
    const { pageHarness } = await setupTest();

    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('list');
  });

  it('should have the correct page header text', async () => {
    const { pageHarness } = await setupTest();

    const pageHeaderHarness = await pageHarness.getPageHeader();

    await expectAsync(pageHeaderHarness.getPageTitle()).toBeResolvedTo(
      'Dashboards'
    );
  });
});
