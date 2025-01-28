import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SkyTabsetHarness } from '@skyux/tabs/testing';

import { RecordPageContentComponent } from './record-page-content.component';
import { RecordPageOverviewTabHarness } from './record-page-overview-tab.component';

fdescribe('Record page content', () => {
  async function setupTest(): Promise<{
    recordPageHarness: SkyTabsetHarness;
    fixture: ComponentFixture<RecordPageContentComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(RecordPageContentComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const recordPageHarness = await loader.getHarness(SkyTabsetHarness);

    return { recordPageHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecordPageContentComponent, NoopAnimationsModule],
    });
  });

  it('should get the overview tab harness', async () => {
    const { recordPageHarness } = await setupTest();

    const overviewTabHarness = await (
      await recordPageHarness.getTabHarness('Overview')
    ).queryHarness(RecordPageOverviewTabHarness);

    await expectAsync(overviewTabHarness.isHarness()).toBeResolvedTo(true);
  });
});
