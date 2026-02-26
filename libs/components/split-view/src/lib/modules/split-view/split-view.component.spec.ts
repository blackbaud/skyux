import {
  DebugElement,
  ElementRef,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SplitViewFixturesModule } from './fixtures/split-view-fixtures.module';
import { SplitViewFixtureComponent } from './fixtures/split-view.fixture';
import { SkySplitViewDrawerComponent } from './split-view-drawer.component';
import { SkySplitViewDockType } from './types/split-view-dock-type';
import { SkySplitViewMessage } from './types/split-view-message';
import { SkySplitViewMessageType } from './types/split-view-message-type';

let mediaQueryController: SkyMediaQueryTestingController;

// #region helpers
function noop(): void {
  return;
}

function getListPanel(): HTMLElement {
  return document.querySelector('.sky-split-view-drawer') as HTMLElement;
}

function listPanelHidden(): boolean {
  const listPanel = document.querySelector(
    '.sky-split-view-drawer-flex-container',
  ) as HTMLElement;
  return !listPanel.classList.contains('sky-split-view-drawer-visible');
}

function getWorkspacePanel(): HTMLElement {
  return document.querySelector('.sky-split-view-workspace') as HTMLElement;
}

function getResizeHandle(fixture: ComponentFixture<unknown>): DebugElement {
  return fixture.debugElement.query(By.css('.sky-split-view-resize-handle'));
}

function getMaxWidth(): number {
  return window.innerWidth - 102; // Account for some padding.
}

function dispatchMouseEvent(
  eventType: string,
  clientXArg: number,
  fixture: ComponentFixture<unknown>,
): void {
  const evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(
    eventType,
    false,
    false,
    window,
    0,
    0,
    0,
    clientXArg,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  document.dispatchEvent(evt);
  fixture.detectChanges();
}

function resizeList(deltaX: number, fixture: ComponentFixture<unknown>): void {
  // Mousedown.
  const resizeHandle = getResizeHandle(fixture);
  const axis = getElementCords(resizeHandle);
  const event = {
    target: resizeHandle.nativeElement,
    clientX: axis.x,
    clientY: axis.y,
    preventDefault: noop,
    stopPropagation: noop,
  };
  resizeHandle.triggerEventHandler('mousedown', event);
  fixture.detectChanges();

  // Mousemove.
  dispatchMouseEvent('mousemove', axis.x + deltaX, fixture);

  // Mouseup.
  dispatchMouseEvent('mouseup', axis.x + deltaX, fixture);

  // Clear any timers that may still be pending.
  tick();
}

function getElementCords(elementRef: ElementRef): { x: number; y: number } {
  const rect = (
    elementRef.nativeElement as HTMLElement
  ).getBoundingClientRect();
  const coords = {
    x: Math.round(rect.left + rect.width / 2),
    y: Math.round(rect.top + rect.height / 2),
  };

  return coords;
}

function getIframe(): HTMLElement {
  return document.querySelector('iframe') as HTMLElement;
}

function getFocusedElement(): HTMLElement {
  return document.activeElement as HTMLElement;
}

function initiateResponsiveMode(fixture: ComponentFixture<unknown>): void {
  mediaQueryController.setBreakpoint('xs');
  fixture.detectChanges();
}

function getBackToListButton(): HTMLElement {
  return document.querySelector(
    '.sky-split-view-workspace-header-content > button',
  ) as HTMLElement;
}

function getHeader(): HTMLElement {
  return document.querySelector(
    '.sky-split-view-workspace-header-content',
  ) as HTMLElement;
}

function isWithin(actual: number, base: number, distance: number): boolean {
  return Math.abs(actual - base) <= distance;
}

function validateSplitViewHeightStyles(
  expectedComputedHeight: number,
  actionBarHeight: number,
  lowered = false,
): void {
  const splitViewElement = document.querySelector(
    '.sky-split-view',
  ) as HTMLElement;

  expect(splitViewElement.style.maxHeight).toBe(
    `calc(100vh - ${lowered ? '100px' : '0px'} - calc(${actionBarHeight}px + var(--sky-dock-height, 0px)))`,
  );

  // Verify computed style is calculated correctly
  const computedStyle = window.getComputedStyle(splitViewElement);
  expect(parseInt(computedStyle.maxHeight)).toBe(expectedComputedHeight);
}
// #endregion

describe('Split view component', () => {
  let component: SplitViewFixtureComponent;
  let fixture: ComponentFixture<SplitViewFixtureComponent>;
  const minWidth = 100;
  let maxWidth: number;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  let rendererFactory: RendererFactory2;
  let renderer: Renderer2;

  function validateDockCssClass(
    dock: SkySplitViewDockType | undefined,
    expectedDockCssClass: string,
  ): void {
    fixture.componentInstance.dock = dock;
    fixture.detectChanges();

    expect(document.querySelector('.sky-split-view')).toHaveCssClass(
      expectedDockCssClass,
    );
  }

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SplitViewFixturesModule],
      providers: [
        provideSkyMediaQueryTesting(),
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
    rendererFactory = TestBed.inject(RendererFactory2);
    renderer = rendererFactory.createRenderer(undefined, null);
    fixture = TestBed.createComponent(SplitViewFixtureComponent);
    component = fixture.componentInstance;
    maxWidth = getMaxWidth();
  });

  describe('before properties initialize', () => {
    it('should resize list panel when listPanelWidth input property has a numeric value', fakeAsync(() => {
      component.width = 500;
      fixture.detectChanges();
      tick();
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('500px');
    }));

    it('should accept configuration options for aria-label', fakeAsync(() => {
      const expectedLabelForList = 'customLabelledBy';
      const expectedLabelForWorkspace = 'customLabelledBy';

      component.ariaLabelForDrawer = expectedLabelForList;
      component.ariaLabelForWorkspace = expectedLabelForWorkspace;

      fixture.detectChanges();
      tick();

      const list = getListPanel();
      const workspace = getWorkspacePanel();

      expect(list.getAttribute('aria-label')).toBe(expectedLabelForList);
      expect(list.getAttribute('role')).toBe('region');
      expect(workspace.getAttribute('aria-label')).toBe(
        expectedLabelForWorkspace,
      );
      expect(workspace.getAttribute('role')).toBe('region');
    }));

    it('should set iframe styles correctly during dragging', fakeAsync(() => {
      component.showIframe = true;
      fixture.detectChanges();
      tick();
      const iframe = getIframe();
      expect(iframe.style.pointerEvents).toBeFalsy();

      // Mousedown.
      const resizeHandle = getResizeHandle(fixture);
      const axis = getElementCords(resizeHandle);
      const event = {
        target: resizeHandle.nativeElement,
        clientX: axis.x,
        clientY: axis.y,
        preventDefault: noop,
        stopPropagation: noop,
      };
      resizeHandle.triggerEventHandler('mousedown', event);
      fixture.detectChanges();

      expect(iframe.style.pointerEvents).toBe('none');

      // Mousemove.
      dispatchMouseEvent('mousemove', axis.x + 500, fixture);

      expect(iframe.style.pointerEvents).toBe('none');

      // Mouseup.
      dispatchMouseEvent('mouseup', axis.x + 500, fixture);
      tick();

      expect(iframe.style.pointerEvents).toBeFalsy();
    }));

    it('should bind the split view hight when the `bindHeightToWindow` property is set', fakeAsync(() => {
      component.bindHeightToWindow = true;
      const rendererSpy = spyOn(renderer, 'setStyle').and.callThrough();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const splitViewElement = document.querySelector(
        '.sky-split-view',
      ) as HTMLElement;
      expect(component.splitViewComponent.bindHeightToWindow).toBeTruthy();
      expect(rendererSpy).toHaveBeenCalledWith(
        splitViewElement,
        'min-height',
        '300px',
      );
      expect(rendererSpy).toHaveBeenCalledWith(
        splitViewElement,
        'max-height',
        'calc(100vh - ' + splitViewElement.offsetTop + 'px - 0px)',
      );
    }));

    it('should not bind the split view hight when the `bindHeightToWindow` property is removed', fakeAsync(() => {
      component.bindHeightToWindow = true;
      const rendererSpySetStyle = spyOn(renderer, 'setStyle').and.callThrough();
      const rendererSpyRemoveStyle = spyOn(
        renderer,
        'removeStyle',
      ).and.callThrough();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(component.splitViewComponent.bindHeightToWindow).toBeTruthy();
      let splitViewElement = document.querySelector(
        '.sky-split-view',
      ) as HTMLElement;
      expect(rendererSpySetStyle).toHaveBeenCalledWith(
        splitViewElement,
        'min-height',
        '300px',
      );
      expect(rendererSpySetStyle).toHaveBeenCalledWith(
        splitViewElement,
        'max-height',
        'calc(100vh - ' + splitViewElement.offsetTop + 'px - 0px)',
      );
      component.bindHeightToWindow = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(component.splitViewComponent.bindHeightToWindow).toBeFalsy();
      splitViewElement = document.querySelector(
        '.sky-split-view',
      ) as HTMLElement;
      expect(rendererSpyRemoveStyle).toHaveBeenCalledWith(
        splitViewElement,
        'min-height',
      );
      expect(rendererSpyRemoveStyle).toHaveBeenCalledWith(
        splitViewElement,
        'max-height',
      );
    }));

    it('should bind the split view hight when the `bindHeightToWindow` property is set with an element above it', fakeAsync(() => {
      const rendererSpy = spyOn(renderer, 'setStyle').and.callThrough();
      component.bindHeightToWindow = true;
      component.lowerSplitView = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(component.splitViewComponent.bindHeightToWindow).toBeTruthy();
      const splitViewElement = document.querySelector(
        '.sky-split-view',
      ) as HTMLElement;
      expect(rendererSpy).toHaveBeenCalledWith(
        splitViewElement,
        'min-height',
        '300px',
      );
      expect(rendererSpy).toHaveBeenCalledWith(
        splitViewElement,
        'max-height',
        'calc(100vh - 100px - 0px)',
      );
    }));

    it('should bind the split view height when the `bindHeightToWindow` property is set with a body bottom margin', () => {
      component.bindHeightToWindow = true;
      component.showActionBar = true;
      fixture.detectChanges();
      expect(component.splitViewComponent.bindHeightToWindow).toBeTruthy();
    });

    it(`should bind the split view hight when the 'bindHeightToWindow' property is set with a body
    bottom margin and element above it`, waitForAsync(() => {
      const rendererSpy = spyOn(renderer, 'setStyle').and.callThrough();
      component.bindHeightToWindow = true;
      component.lowerSplitView = true;
      component.showActionBar = true;
      fixture.detectChanges();
      // Without the `setTimeout` the mutation observer isn't hit
      setTimeout(() => {
        fixture.detectChanges();
        expect(component.splitViewComponent.bindHeightToWindow).toBeTruthy();
        const splitViewElement = document.querySelector(
          '.sky-split-view',
        ) as HTMLElement;
        const actionBar = document.querySelector(
          '.sky-summary-action-bar',
        ) as HTMLElement;
        expect(rendererSpy).toHaveBeenCalledWith(
          splitViewElement,
          'min-height',
          '300px',
        );

        const expectedHeight =
          window.innerHeight - 100 - actionBar.offsetHeight;
        validateSplitViewHeightStyles(
          expectedHeight,
          actionBar.offsetHeight,
          true,
        );
      }, 10);
    }));

    it('should compute correct split view height with dock height', waitForAsync(() => {
      // Set a dock height value
      document.documentElement.style.setProperty('--sky-dock-height', '40px');

      component.bindHeightToWindow = true;
      component.lowerSplitView = true;
      component.showActionBar = true;
      fixture.detectChanges();

      setTimeout(() => {
        fixture.detectChanges();
        const actionBar = document.querySelector(
          '.sky-summary-action-bar',
        ) as HTMLElement;

        // Verify computed style includes dock height in calculation
        const expectedHeight =
          window.innerHeight - 100 - (actionBar.offsetHeight + 40);
        validateSplitViewHeightStyles(
          expectedHeight,
          actionBar.offsetHeight,
          true,
        );

        // Clean up
        document.documentElement.style.removeProperty('--sky-dock-height');
      }, 20);
    }));
  });

  describe('after properties initialize', () => {
    // Runs the initial getters. Make sure we always have a baseline of lg media breakpoint.
    beforeEach(fakeAsync(() => {
      mediaQueryController.setBreakpoint('lg');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
    }));

    it('should default the list panel width to 320 pixels', fakeAsync(() => {
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('320px');
    }));

    it('should resize list panel when listPanelWidth input property has a numeric value', fakeAsync(() => {
      component.width = 500;
      fixture.detectChanges();
      tick();
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('500px');
    }));

    it('should respect min and max widths when changing width input', fakeAsync(() => {
      const listPanelElement = getListPanel();

      // Resize list width larger than maximum.
      component.width = 9999;
      fixture.detectChanges();
      tick();

      // Expect list to be set at max.
      expect(listPanelElement.style.width).toBe(getMaxWidth() + 'px');

      // Resize list width smaller than minimum.
      component.width = 1;
      fixture.detectChanges();
      tick();

      // Expect list to be set at minimum.
      expect(listPanelElement.style.width).toBe(minWidth + 'px');
    }));

    it('should resize when handle is dragged', fakeAsync(() => {
      const moveSpy = spyOn(
        SkySplitViewDrawerComponent.prototype,
        'onMouseMove',
      ).and.callThrough();
      const mouseUpSpy = spyOn(
        SkySplitViewDrawerComponent.prototype,
        'onHandleRelease',
      ).and.callThrough();
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle(fixture).nativeElement;

      resizeList(100, fixture);

      // Expect list panel width to be 100 more than default (320).
      // Expect resize handle to move 100 pixels to the right.
      expect(listPanelElement.style.width).toBe('420px');
      expect(resizeHandle.style.left).toBe('413px');

      resizeList(-100, fixture);

      // Expect list panel and resize handle to return to their defaults.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');
      expect(moveSpy).toHaveBeenCalled();
      expect(mouseUpSpy).toHaveBeenCalled();
    }));

    it('should not run any resizing logic when in responsive mode', fakeAsync(() => {
      const drawerComponent = component.splitViewComponent
        .drawerComponent as SkySplitViewDrawerComponent;

      const moveSpy = spyOn(drawerComponent, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(
        drawerComponent,
        'onHandleRelease',
      ).and.callThrough();

      // Window should fake a small size.
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);

      // Get split view component and fire a mouse down event.
      const mouseEvent = document.createEvent('MouseEvents');
      mouseEvent.initMouseEvent(
        'mousedown',
        false,
        false,
        window,
        0,
        0,
        0,
        12,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      drawerComponent.onResizeHandleMouseDown(mouseEvent);
      fixture.detectChanges();
      tick();

      // None of the resizing logic should be called.
      expect(moveSpy).not.toHaveBeenCalled();
      expect(mouseUpSpy).not.toHaveBeenCalled();
    }));

    it('should not resize on mousemove unless the resize handle was clicked', fakeAsync(() => {
      const drawerComponent = component.splitViewComponent
        .drawerComponent as SkySplitViewDrawerComponent;
      const moveSpy = spyOn(drawerComponent, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(
        drawerComponent,
        'onHandleRelease',
      ).and.callThrough();
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle(fixture).nativeElement;

      // Mousemove.
      dispatchMouseEvent('mousemove', 999, fixture);

      // Mouseup.
      dispatchMouseEvent('mouseup', 999, fixture);

      // Expect list panel width and handle to remain at default.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');
      // Expect move and mouse up logic to never be called.
      expect(moveSpy).not.toHaveBeenCalled();
      expect(mouseUpSpy).not.toHaveBeenCalled();
    }));

    it('should resize list panel when range input is changed', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeInput = getResizeHandle(fixture)
        .nativeElement as HTMLInputElement;

      resizeInput.value = '400';
      SkyAppTestUtility.fireDomEvent(resizeInput, 'input');
      SkyAppTestUtility.fireDomEvent(resizeInput, 'change');
      fixture.detectChanges();
      tick();
      expect(listPanelElement.style.width).toBe('400px');

      resizeInput.value = '500';
      SkyAppTestUtility.fireDomEvent(resizeInput, 'input');
      SkyAppTestUtility.fireDomEvent(resizeInput, 'change');
      fixture.detectChanges();
      tick();
      expect(listPanelElement.style.width).toBe('500px');
    }));

    it('should respect minimum and maximum when resizing with mouse', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle(fixture).nativeElement;

      // Attempt to resize list panel larger than maximum.
      resizeList(9999, fixture);

      // Expect list panel width and handle to remain at default.
      // Note: a human user would see this revert to the last valid drag point,
      // but due to the nature of the unit test it jumps from default to 999 -
      // hence making the default the last valid width.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');

      // Attempt to resize list panel smaller than minimum.
      resizeList(maxWidth - 99, fixture);

      // Expect list panel width and handle to remain at default.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');
    }));

    it('should have correct aria-labels on resizing range input', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeInput = getResizeHandle(fixture)
        .nativeElement as HTMLInputElement;

      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeInput.getAttribute('aria-controls')).toBe(
        listPanelElement.id,
      );
      expect(resizeInput.getAttribute('aria-valuenow')).toBe('320');
      expect(resizeInput.getAttribute('aria-valuemax')).toBe(
        maxWidth.toString(),
      );
      expect(resizeInput.getAttribute('aria-valuemin')).toBe(
        minWidth.toString(),
      );
      expect(resizeInput.getAttribute('max')).toBe(maxWidth.toString());
      expect(resizeInput.getAttribute('min')).toBe(minWidth.toString());
    }));

    it('resize handle and workspace panel should be hidden when screen size changes to xs', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      const resizeHandle = getResizeHandle(fixture);

      expect(resizeHandle).toBeNull();
      expect(listPanelHidden()).toEqual(true);
    }));

    it('resize handle and workspace panel should be revealed when screen size changes back to md from xs', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      mediaQueryController.setBreakpoint('md');
      fixture.detectChanges();
      const resizeHandle = getResizeHandle(fixture);

      expect(resizeHandle).not.toBeNull();
      expect(listPanelHidden()).toEqual(false);
    }));

    it('should set focus in the workspace when messages are sent to the stream', fakeAsync(() => {
      // Send message to focus on workspace.
      const message: SkySplitViewMessage = {
        type: SkySplitViewMessageType.FocusWorkspace,
      };
      component.splitViewMessageStream.next(message);
      fixture.detectChanges();
      tick();

      // Expect first element in workspace to have focus.
      const firstInputElement = document.querySelector(
        '#sky-test-first-input',
      ) as HTMLElement;
      expect(getFocusedElement()).toEqual(firstInputElement);
    }));

    it('should set focus in the workspace when messages are sent to the stream and in mobile mode', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      const backToListButton = getBackToListButton();

      // Click the back button.
      backToListButton.click();
      fixture.detectChanges();

      // Send message to show and focus on workspace.
      const message: SkySplitViewMessage = {
        type: SkySplitViewMessageType.FocusWorkspace,
      };
      component.splitViewMessageStream.next(message);
      fixture.detectChanges();

      // Simulate the CSS transition completing on the workspace panel.
      const workspaceEl = document.querySelector(
        '.sky-split-view-workspace-flex-container',
      );
      workspaceEl?.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'transform' }),
      );
      fixture.detectChanges();
      tick();

      // Expect first element in workspace to have focus.
      const firstInputElement = document.querySelector(
        '#sky-test-first-input',
      ) as HTMLElement;
      expect(getFocusedElement()).toEqual(firstInputElement);
    }));

    it('should show the header and back link on smaller screens', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      const responsiveHeader = getHeader();
      const backToListButton = getBackToListButton();

      expect(responsiveHeader).not.toBeNull();
      expect(backToListButton).not.toBeNull();
    }));

    it('should use default when backButtonText property is not defined', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      const backToListButton = getBackToListButton();

      expect(backToListButton.innerText.trim()).toEqual('Back to list');
    }));

    it('should allow custom labels for back button if backButtonText property is defined', fakeAsync(() => {
      const labelText = 'FOOBAR';
      component.backButtonText = labelText;
      fixture.detectChanges();
      initiateResponsiveMode(fixture);
      const backToListButton = getBackToListButton();

      expect(backToListButton.innerText.trim()).toEqual(labelText);
    }));

    it('should show the list when the back link is clicked', fakeAsync(() => {
      // Start in responsive mode.
      initiateResponsiveMode(fixture);
      const backToListButton = getBackToListButton();

      // Expect list to be hidden when in responsive mode.
      expect(listPanelHidden()).toEqual(true);

      // Click the back button.
      backToListButton.click();
      fixture.detectChanges();

      // Expect list to now be shown.
      expect(listPanelHidden()).toEqual(false);
    }));

    it('should resize list panel as window gets smaller to prevent it from overflowing', fakeAsync(() => {
      // Make list as wide as possible.
      component.width = 9999;
      fixture.detectChanges();
      tick();

      // Get baseline variables.
      const windowResizeAmount = 300;
      const tolerance = 100;
      const listPanel = getListPanel();
      const initialWidth = listPanel.clientWidth;
      const resizeWidth = initialWidth + tolerance - windowResizeAmount;
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(resizeWidth);

      // Resize the window smaller.
      SkyAppTestUtility.fireDomEvent(window, 'resize');
      fixture.detectChanges();

      // Expect the list panel width to resize down as the window gets smaller.
      // Use isWithin() to allow some pixel tolerance for different browsers.
      const newWidth = initialWidth - windowResizeAmount;
      expect(isWithin(listPanel.clientWidth, newWidth, 10)).toEqual(true);
    }));

    it(`should bind the split view hight when the 'bindHeightToWindow' property is set after
      initialization and update correctly`, waitForAsync(() => {
      component.bindHeightToWindow = true;
      const rendererSpy = spyOn(renderer, 'setStyle').and.callThrough();
      fixture.detectChanges();
      void fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.splitViewComponent.bindHeightToWindow).toBeTruthy();
        let splitViewElement = document.querySelector(
          '.sky-split-view',
        ) as HTMLElement;
        expect(rendererSpy).toHaveBeenCalledWith(
          splitViewElement,
          'min-height',
          '300px',
        );
        expect(rendererSpy).toHaveBeenCalledWith(
          splitViewElement,
          'max-height',
          'calc(100vh - 0px - 0px)',
        );
        rendererSpy.calls.reset();
        component.showActionBar = true;
        fixture.detectChanges();
        void fixture.whenStable().then(() => {
          fixture.detectChanges();
          // Without the `setTimeout` the mutation observer isn't hit
          setTimeout(() => {
            fixture.detectChanges();
            splitViewElement = document.querySelector(
              '.sky-split-view',
            ) as HTMLElement;
            let actionBar = document.querySelector(
              '.sky-summary-action-bar',
            ) as HTMLElement;

            expect(
              component.splitViewComponent.bindHeightToWindow,
            ).toBeTruthy();
            expect(rendererSpy).toHaveBeenCalledWith(
              splitViewElement,
              'min-height',
              '300px',
            );
            validateSplitViewHeightStyles(
              window.innerHeight - actionBar.offsetHeight,
              actionBar.offsetHeight,
            );

            rendererSpy.calls.reset();

            component.lowerSplitView = true;
            fixture.detectChanges();

            // Fire a window resize to trigger a sizing update.
            SkyAppTestUtility.fireDomEvent(window, 'resize');
            fixture.detectChanges();
            expect(
              component.splitViewComponent.bindHeightToWindow,
            ).toBeTruthy();
            splitViewElement = document.querySelector(
              '.sky-split-view',
            ) as HTMLElement;
            actionBar = document.querySelector(
              '.sky-summary-action-bar',
            ) as HTMLElement;
            expect(rendererSpy).toHaveBeenCalledWith(
              splitViewElement,
              'min-height',
              '300px',
            );
            validateSplitViewHeightStyles(
              window.innerHeight - 100 - actionBar.offsetHeight,
              actionBar.offsetHeight,
              true,
            );
          }, 10);
        });
      });
    }));

    it('should set the expected dock CSS class', () => {
      validateDockCssClass('none', 'sky-split-view-dock-none');
      validateDockCssClass('fill', 'sky-split-view-dock-fill');
      validateDockCssClass(undefined, 'sky-split-view-dock-none');
    });

    it('should pass accessibility', async () => {
      fixture.componentInstance.ariaLabelForDrawer = 'My drawer';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should pass accessibility when in responsive mode', async () => {
      initiateResponsiveMode(fixture);
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should pass accessibility when scrolling', async () => {
      component.ariaLabelForDrawer = 'My drawer';
      Array.from(Array(70).keys()).forEach((i) => {
        component.items.push({
          id: `${component.items.length + 1}`,
          name: `item ${component.items.length + 1}`,
        });
        component.additionalItems.push(`additional item ${i + 1}`);
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
