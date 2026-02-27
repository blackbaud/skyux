import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyRepeaterItemHarness } from '@skyux/lists/testing';
import { SkySplitViewHarness } from '@skyux/split-view/testing';

import { SplitViewPageBoundExampleComponent } from './example.component';

describe('Split view example', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    splitViewHarness: SkySplitViewHarness;
    mediaQueryController: SkyMediaQueryTestingController;
    fixture: ComponentFixture<SplitViewPageBoundExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [SplitViewPageBoundExampleComponent],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();

    const mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    const fixture = TestBed.createComponent(SplitViewPageBoundExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const splitViewHarness: SkySplitViewHarness = options.dataSkyId
      ? await loader.getHarness(
          SkySplitViewHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkySplitViewHarness);

    return { splitViewHarness, mediaQueryController, fixture, loader };
  }

  it('should set up split view component and children', async () => {
    const { splitViewHarness, fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    // validate parent split view properties
    await expectAsync(splitViewHarness.getDockType()).toBeResolvedTo('fill');
    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      true,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      true,
    );

    // query for drawer and workspace child components and validate properties
    const drawerHarness = await splitViewHarness.getDrawer();
    const workspaceHarness = await splitViewHarness.getWorkspace();

    await expectAsync(drawerHarness.getAriaLabel()).toBeResolvedTo(
      'Transaction list',
    );
    await expectAsync(workspaceHarness.getAriaLabel()).toBeResolvedTo(
      'Transaction form',
    );

    // query for content and footer child components and their child elements
    const contentHarness = await workspaceHarness.getContent();
    const footerHarness = await workspaceHarness.getFooter();

    await expectAsync(
      contentHarness?.queryHarnesses(SkyInputBoxHarness),
    ).toBeResolved();
    await expectAsync(
      footerHarness?.querySelector('sky-summary-action-bar-primary-action'),
    ).toBeResolved();
  });

  it('should switch between views in responsive mode', async () => {
    const { splitViewHarness, mediaQueryController, fixture } =
      await setupTest();

    // set XS breakpoint to force split view into responsive mode
    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      false,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      true,
    );
    await expectAsync(splitViewHarness.getBackButtonText()).toBeResolvedTo(
      'Back to list',
    );

    // switch to drawer view
    await splitViewHarness.openDrawer();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      true,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      false,
    );

    const drawerHarness = await splitViewHarness.getDrawer();
    const drawerItems = await drawerHarness.queryHarnesses(
      SkyRepeaterItemHarness,
    );

    // switch back to workspace view
    await drawerItems[3].click();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      false,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      true,
    );
  });
});
