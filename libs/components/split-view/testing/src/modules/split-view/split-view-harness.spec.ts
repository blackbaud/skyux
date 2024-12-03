import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { SplitViewHarnessTestComponent } from './fixtures/split-view-harness-test.component';
import { SkySplitViewHarness } from './split-view-harness';

describe('Split view harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    splitViewHarness: SkySplitViewHarness;
    mediaQueryController: SkyMediaQueryTestingController;
    fixture: ComponentFixture<SplitViewHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [SplitViewHarnessTestComponent, NoopAnimationsModule],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();

    const mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    const fixture = TestBed.createComponent(SplitViewHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const splitViewHarness: SkySplitViewHarness = options.dataSkyId
      ? await loader.getHarness(
          SkySplitViewHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkySplitViewHarness);

    return { splitViewHarness, mediaQueryController, fixture, loader };
  }

  it('should get back button text', async () => {
    const { splitViewHarness, mediaQueryController, fixture } = await setupTest(
      { dataSkyId: 'split-view' },
    );

    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getBackButtonText()).toBeResolvedTo(
      'Test button text',
    );

    mediaQueryController.setBreakpoint('lg');

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      splitViewHarness.getBackButtonText(),
    ).toBeRejectedWithError('The workspace header button could not be found.');
  });

  it('should return the dock type', async () => {
    const { splitViewHarness, fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDockType()).toBeResolvedTo('none');

    fixture.componentInstance.dockType = 'fill';

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDockType()).toBeResolvedTo('fill');
  });

  it('should error if the drawer or workspace are missing', async () => {
    const { splitViewHarness, fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawer()).toBeResolved();
    await expectAsync(splitViewHarness.getWorkspace()).toBeResolved();

    fixture.componentInstance.showDrawer = false;
    fixture.componentInstance.showWorkspace = false;

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawer()).toBeRejectedWithError(
      'Could not find split view drawer component.',
    );
    await expectAsync(splitViewHarness.getWorkspace()).toBeRejectedWithError(
      'Could not find split view workspace component.',
    );
  });

  it('should get which child components are hidden in responsive mode', async () => {
    const { splitViewHarness, mediaQueryController, fixture } =
      await setupTest();

    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      false,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      true,
    );

    await splitViewHarness.openDrawer();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      true,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      false,
    );
  });

  it('should get the workspace content and footer harnesses', async () => {
    const { splitViewHarness, fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    const workspaceHarness = await splitViewHarness.getWorkspace();

    await expectAsync(workspaceHarness.getContent()).toBeResolved();
    await expectAsync(workspaceHarness.getFooter()).toBeResolved();
  });

  it('should return the ARIA labels for the drawer and workspace', async () => {
    const { splitViewHarness, fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    const drawerHarness = await splitViewHarness.getDrawer();
    const workspaceHarness = await splitViewHarness.getWorkspace();
    await expectAsync(drawerHarness.getAriaLabel()).toBeResolvedTo(
      'Transaction list',
    );
    await expectAsync(workspaceHarness.getAriaLabel()).toBeResolvedTo(
      'Transaction form',
    );
  });
});
