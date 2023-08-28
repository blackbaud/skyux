import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { RecordPageBlocksLayoutDemoComponent } from './record-page-blocks-layout-demo.component';
import { RecordPageBlocksLayoutDemoModule } from './record-page-blocks-layout-demo.module';

describe('Record page blocks layout demo', async () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<RecordPageBlocksLayoutDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(
      RecordPageBlocksLayoutDemoComponent
    );

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);

    return { pageHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RecordPageBlocksLayoutDemoModule,
        RouterTestingModule,
      ],
    });
  });

  it('should have a blocks layout', async () => {
    const { pageHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('blocks');
  });

  it('should have the correct page header text', async () => {
    const { pageHarness } = await setupTest();

    const pageHeaderHarness = await pageHarness.getPageHeader();

    await expectAsync(pageHeaderHarness.getPageTitle()).toBeResolvedTo(
      '$500 pledge'
    );

    await expectAsync(pageHeaderHarness.getParentLinkText()).toBeResolvedTo(
      'Pledges'
    );
  });
});
