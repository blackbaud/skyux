import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { RecordPageTabsLayoutDemoComponent } from './record-page-tabs-layout-demo.component';
import { RecordPageTabsLayoutDemoModule } from './record-page-tabs-layout-demo.module';

describe('Record page tabs layout demo', async () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<RecordPageTabsLayoutDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(RecordPageTabsLayoutDemoComponent);

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);

    return { pageHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RecordPageTabsLayoutDemoModule,
        RouterTestingModule,
      ],
    });
  });

  it('should have a tabs layout', async () => {
    const { pageHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('tabs');
  });

  it('should have the correct page header text', async () => {
    const { pageHarness } = await setupTest();

    const pageHeaderHarness = await pageHarness.getPageHeader();

    await expectAsync(pageHeaderHarness.getPageTitle()).toBeResolvedTo(
      'Charlene Conners'
    );
  });
});
