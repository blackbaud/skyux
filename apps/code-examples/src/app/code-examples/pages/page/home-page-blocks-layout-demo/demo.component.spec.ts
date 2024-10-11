import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { DemoComponent } from './demo.component';

describe('Record page blocks layout demo', () => {
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
      imports: [
        DemoComponent,
        SkyHelpTestingModule,
        NoopAnimationsModule,
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
      '$500 pledge',
    );

    await expectAsync(pageHeaderHarness.getParentLinkText()).toBeResolvedTo(
      'Pledges',
    );
  });

  it('should have the correct help key', async () => {
    const { helpController } = await setupTest();

    helpController.expectCurrentHelpKey('demo-help');
  });
});
