import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { DemoComponent } from './demo.component';

describe('List page list layout demo', () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<DemoComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);
    const helpController = TestBed.inject(SkyHelpTestingController);

    return { pageHarness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, SkyHelpTestingModule, NoopAnimationsModule],
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
      'Dashboards',
    );
  });

  it('should have the correct help key', async () => {
    const { helpController } = await setupTest();

    helpController.expectCurrentHelpKey('demo-help');
  });
});
