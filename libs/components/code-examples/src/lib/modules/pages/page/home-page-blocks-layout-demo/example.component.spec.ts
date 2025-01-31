import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SkyHelpTestingModule } from '@skyux/core/testing';
import { SkyPageHarness } from '@skyux/pages/testing';

import { PagesPageHomePageBlocksLayoutExampleComponent } from './example.component';

describe('Record page blocks layout example', () => {
  async function setupTest(): Promise<{
    pageHarness: SkyPageHarness;
    fixture: ComponentFixture<PagesPageHomePageBlocksLayoutExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      PagesPageHomePageBlocksLayoutExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const pageHarness = await loader.getHarness(SkyPageHarness);

    return { pageHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PagesPageHomePageBlocksLayoutExampleComponent,
        SkyHelpTestingModule,
        NoopAnimationsModule,
      ],
      providers: [provideRouter([])],
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

    await expectAsync(pageHeaderHarness.getPageTitle()).toBeResolvedTo('Home');

    await expectAsync(
      pageHeaderHarness.getParentLinkText(),
    ).toBeRejectedWithError(/No parent link was found in the page header/);
  });
});
