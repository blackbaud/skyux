import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SkyTabsetHarness } from '@skyux/tabs/testing';

import { RecordPageContentComponent } from './record-page-content.component';
import { RecordPageOverviewTabHarness } from './record-page-overview-tab-harness';

describe('Record page content', () => {
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

  it("should get the overview tab's content harness", async () => {
    const { recordPageHarness } = await setupTest();

    const overviewTabHarness = await (
      await recordPageHarness.getTabContentHarness('Overview')
    ).queryHarness(RecordPageOverviewTabHarness);

    const overviewBoxes = await overviewTabHarness.getBoxes();

    expect(overviewBoxes.length).toBe(3);
  });
});
