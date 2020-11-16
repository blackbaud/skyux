import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkySplitViewFixture
} from './split-view-fixture';

import {
  SplitViewTestComponent
} from './fixtures/split-view-fixture-test.component';

import {
  SkySplitViewTestingModule
} from './split-view-testing.module';

const DEFAULT_DRAWER_ARIA_LABEL = 'Transaction list';
const DEFAULT_DRAWER_WIDTH = '320px';
const DEFAULT_WORKSPACE_ARIA_LABEL = 'Transaction form';
const DEFAULT_BACK_BUTTON_TEXT = 'Back to list';

describe('SplitView fixture', () => {
  let fixture: ComponentFixture<SplitViewTestComponent>;
  let testComponent: SplitViewTestComponent;
  let mockQueryService: MockSkyMediaQueryService;
  let splitViewFixture: SkySplitViewFixture;

  //#region helpers

  async function initiateResponsiveMode(breakpoint: SkyMediaBreakpoints): Promise<void> {
    mockQueryService.fire(breakpoint);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function getRepeaterItemElements(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.sky-repeater-item'));
  }

  async function selectRepeaterItem(index: number): Promise<void> {
    const items = getRepeaterItemElements();
    items[index].nativeElement.click();

    fixture.detectChanges();
    return await fixture.whenStable();
  }

  //#endregion

  beforeEach(() => {
    // replace the mock service before using in the test bed to avoid change detection errors
    mockQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      declarations: [
        SplitViewTestComponent
      ],
      imports: [
        ReactiveFormsModule,
        SkyConfirmModule,
        SkyDefinitionListModule,
        SkyRepeaterModule,
        SkySummaryActionBarModule,
        SkySplitViewTestingModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService }
      ]
    });

    fixture = TestBed.createComponent(
      SplitViewTestComponent
    );
    testComponent = fixture.componentInstance;
    splitViewFixture = new SkySplitViewFixture(fixture, SplitViewTestComponent.dataSkyId);
  });

  it('should expose drawer properties', async () => {
    // non-responsive mode
    expect(splitViewFixture.drawer.ariaLabel).toBe(DEFAULT_DRAWER_ARIA_LABEL);
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.drawer.width).toBe(DEFAULT_DRAWER_WIDTH);

    // responsive mode
    await initiateResponsiveMode(SkyMediaBreakpoints.xs);
    expect(splitViewFixture.drawer.ariaLabel).toBe(DEFAULT_DRAWER_ARIA_LABEL);
    expect(splitViewFixture.drawer.isVisible).toBeFalse();
    expect(splitViewFixture.drawer.width).toBe('');
  });

  it('should reflect changes to default drawer properties', async () => {
    // update to non-default values
    testComponent.listAriaLabel = 'not-default';
    testComponent.listWidth = 500;
    fixture.detectChanges();
    await fixture.whenStable();

    // verify updates
    expect(splitViewFixture.drawer.ariaLabel).toBe(testComponent.listAriaLabel);
    expect(splitViewFixture.drawer.width).toBe(`${testComponent.listWidth}px`);
  });

  it('should expose workspace properties', async () => {
    // non-reponsive mode
    expect(splitViewFixture.workspace.ariaLabel).toBe(DEFAULT_WORKSPACE_ARIA_LABEL);
    expect(splitViewFixture.workspace.backButtonText).toBeUndefined();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    // responsive mode
    await initiateResponsiveMode(SkyMediaBreakpoints.xs);
    expect(splitViewFixture.workspace.ariaLabel).toBe(DEFAULT_WORKSPACE_ARIA_LABEL);
    expect(splitViewFixture.workspace.backButtonText).toBe(DEFAULT_BACK_BUTTON_TEXT);
    expect(splitViewFixture.workspace.isVisible).toBeTrue();
  });

  it('should reflect changes to default workspace properties', async () => {
    // update to non-default values
    testComponent.workspaceAriaLabel = 'not-default';
    testComponent.backButtonText = 'Back';
    fixture.detectChanges();
    await fixture.whenStable();

    // verify updates
    await initiateResponsiveMode(SkyMediaBreakpoints.xs);
    expect(splitViewFixture.workspace.ariaLabel).toBe(testComponent.workspaceAriaLabel);
    expect(splitViewFixture.workspace.backButtonText).toBe(testComponent.backButtonText);
  });

  it('should open drawer when in responsive mode', async () => {
    // switch to responsive mode
    await initiateResponsiveMode(SkyMediaBreakpoints.xs);
    expect(splitViewFixture.drawer.isVisible).toBeFalse();
    expect(splitViewFixture.drawer.width).toBe('');
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    // switch to drawer
    await splitViewFixture.openDrawer();
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.drawer.width).toBe('');
    expect(splitViewFixture.workspace.isVisible).toBeFalse();
  });

  it('should handle attempting to open drawer when already open', async () => {
    // responsive mode switches to the workspace by default
    await initiateResponsiveMode(SkyMediaBreakpoints.xs);
    expect(splitViewFixture.drawer.isVisible).toBeFalse();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeTrue();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    // switch to the drawer so it's already open
    await splitViewFixture.openDrawer();
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeFalse();
    expect(splitViewFixture.workspace.isVisible).toBeFalse();

    // try to open it again; this should be a noop
    await splitViewFixture.openDrawer();
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeFalse();
    expect(splitViewFixture.workspace.isVisible).toBeFalse();
  });

  it('should handle attempting to open drawer on large screen', async () => {
    // non-responsive mode should never display the back to list button
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeFalse();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    // try to open the drawer even though it's already open; this should be a noop
    await splitViewFixture.openDrawer();
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeFalse();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();
  });

  it('should switch to workspace on item selection', async () => {
    // responsive mode switches to the workspace by default
    await initiateResponsiveMode(SkyMediaBreakpoints.xs);
    expect(splitViewFixture.drawer.isVisible).toBeFalse();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeTrue();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    // switch to the drawer for item selection
    await splitViewFixture.openDrawer();
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeFalse();
    expect(splitViewFixture.workspace.isVisible).toBeFalse();

    // select a different item
    await selectRepeaterItem(2);

    // verify the workspace is now active
    expect(splitViewFixture.drawer.isVisible).toBeFalse();
    expect(splitViewFixture.workspace.backButtonIsVisible).toBeTrue();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();
  });
});
