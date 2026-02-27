import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { PagesPageSplitViewPageFitLayoutExampleComponent } from './example.component';

describe('Split view page fit layout example', () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<PagesPageSplitViewPageFitLayoutExampleComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      PagesPageSplitViewPageFitLayoutExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);
    const helpController = TestBed.inject(SkyHelpTestingController);

    return { pageHarness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PagesPageSplitViewPageFitLayoutExampleComponent,
        SkyHelpTestingModule],
      providers: [provideRouter([])],
    });
  });

  it('should have a fit layout', async () => {
    const { pageHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('fit');
  });

  it('should have the correct help key', async () => {
    const { helpController } = await setupTest();

    helpController.expectCurrentHelpKey('example-help');
  });
});
