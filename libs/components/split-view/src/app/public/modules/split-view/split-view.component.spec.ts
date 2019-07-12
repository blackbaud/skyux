import {
  DebugElement
} from '@angular/core';

import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing/mock-media-query.service';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SplitViewFixturesModule
} from './fixtures/split-view-fixtures.module';

import {
  SplitViewFixtureComponent
} from './fixtures/split-view.fixture';

import {
  SkySplitViewMessage
} from './types/split-view-message';

import {
  SkySplitViewMessageType
} from './types/split-view-message-type';

import {
  SkySplitViewDrawerComponent
} from './split-view-drawer.component';

let mockQueryService: MockSkyMediaQueryService;

// #region helpers
function getListPanel(): HTMLElement {
  return document.querySelector('.sky-split-view-drawer') as HTMLElement;
}

function listPanelHidden(): boolean {
  const listPanel = document.querySelector('.sky-split-view-drawer-flex-container') as HTMLElement;
  return listPanel.hasAttribute('hidden');
}

function getWorkspacePanel(): HTMLElement {
  return document.querySelector('.sky-split-view-workspace') as HTMLElement;
}

function getResizeHandle(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('.sky-split-view-resize-handle'));
}

function getMaxWidth(): number {
  return window.innerWidth - 102; // Acount for some padding.
}

function dispatchMouseEvent(eventType: string, clientXArg: number, fixture: ComponentFixture<any>): void {
  let evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(eventType, false, false, window, 0, 0, 0, clientXArg,
    0, false, false, false, false, 0, undefined);
  document.dispatchEvent(evt);
  fixture.detectChanges();
}

function resizeList(deltaX: number, fixture: ComponentFixture<any>): void {
  // Mousedown.
  const resizeHandle = getResizeHandle(fixture);
  let axis = getElementCords(resizeHandle);
  let event = {
    target: resizeHandle.nativeElement,
    'clientX': axis.x,
    'clientY': axis.y,
    'preventDefault': function () { },
    'stopPropagation': function () { }
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

function getElementCords(elementRef: any): any {
  const rect = (elementRef.nativeElement as HTMLElement).getBoundingClientRect();
  const coords = {
    x: Math.round(rect.left + (rect.width / 2)),
    y: Math.round(rect.top + (rect.height / 2))
  };

  return coords;
}

function getIframe(): HTMLElement {
  return document.querySelector('iframe') as HTMLElement;
}

function getFocusedElement(): HTMLElement {
  return document.activeElement as HTMLElement;
}

function initiateResponsiveMode(fixture: ComponentFixture<any>): void {
  mockQueryService.fire(SkyMediaBreakpoints.xs);
  fixture.detectChanges();
}

function getBackToListButton(): HTMLElement {
  return document.querySelector('.sky-split-view-workspace-header-content > button') as HTMLElement;
}

function getHeader(): HTMLElement {
  return document.querySelector('.sky-split-view-workspace-header-content') as HTMLElement;
}

function isWithin(actual: number, base: number, distance: number): boolean {
  return Math.abs(actual - base) <= distance;
}
// #endregion

describe('Split view component', () => {
  let component: SplitViewFixtureComponent;
  let fixture: ComponentFixture<SplitViewFixtureComponent>;
  let minWidth = 100;
  let maxWidth: number;
  mockQueryService = new MockSkyMediaQueryService();

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SplitViewFixturesModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService }
      ]
    });

    fixture = TestBed.createComponent(SplitViewFixtureComponent);
    component = fixture.componentInstance;
    maxWidth = getMaxWidth();
  }));

  describe('before properties initialize', () => {
    it('should resize list panel when listPanelWidth input property has a numeric value', fakeAsync(() => {
      component.width = 500;
      fixture.detectChanges();
      tick();
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('500px');
    }));

    it('should accept configuration options for aria-label',
    fakeAsync(() => {
      const expectedLabelForList = 'customlabelledby';
      const expectedLabelForWorkspace = 'customlabelledby';

      component.ariaLabelForDrawer = expectedLabelForList;
      component.ariaLabelForWorkspace = expectedLabelForWorkspace;

      fixture.detectChanges();
      tick();

      const list = getListPanel();
      const workspace = getWorkspacePanel();

      expect(list.getAttribute('aria-label')).toBe(expectedLabelForList);
      expect(list.getAttribute('role')).toBe('region');
      expect(workspace.getAttribute('aria-label')).toBe(expectedLabelForWorkspace);
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
      let axis = getElementCords(resizeHandle);
      let event = {
        target: resizeHandle.nativeElement,
        'clientX': axis.x,
        'clientY': axis.y,
        'preventDefault': function () { },
        'stopPropagation': function () { }
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
  });

  describe('after properties initialize', () => {

    // Runs the initial getters. Make sure we always have a baseline of lg media breakpoint.
    beforeEach(fakeAsync(() => {
      mockQueryService.fire(SkyMediaBreakpoints.lg);
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
      const moveSpy = spyOn(SkySplitViewDrawerComponent.prototype, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(SkySplitViewDrawerComponent.prototype, 'onHandleRelease').and.callThrough();
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
      const drawerComponent = component.splitViewComponent.drawerComponent;
      const moveSpy = spyOn(drawerComponent, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(drawerComponent, 'onHandleRelease').and.callThrough();

      // Window should fake a small size.
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);

      // Get split view component and fire a mouse down event.
      const mouseEvent = document.createEvent('MouseEvents');
      mouseEvent.initMouseEvent('mousedown', false, false, window, 0, 0, 0, 12,
        0, false, false, false, false, 0, undefined);
      drawerComponent.onResizeHandleMouseDown(mouseEvent);
      fixture.detectChanges();
      tick();

      // None of the resizing logic should be called.
      expect(moveSpy).not.toHaveBeenCalled();
      expect(mouseUpSpy).not.toHaveBeenCalled();
    }));

    it('should not resize on mousemove unless the resize handle was clicked', fakeAsync(() => {
      const drawerComponent = component.splitViewComponent.drawerComponent;
      const moveSpy = spyOn(drawerComponent, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(drawerComponent, 'onHandleRelease').and.callThrough();
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
      const resizeInput = getResizeHandle(fixture).nativeElement as HTMLInputElement;

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

      // Attmpt to resize list panel larger than maximum.
      resizeList(999, fixture);

      // Expect list panel width and handle to remain at default.
      // Note: a human user would see this revert to the last valid drag point,
      // but due to the nature of the unit test it jumps from default to 999 -
      // hence making the default the last valid width.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');

      // Attmpt to resize list panel smaller than minimum.
      resizeList(maxWidth - 99, fixture);

      // Expect list panel width and handle to remain at default.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');
    }));

    it('should have correct aria-labels on resizing range input', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeInput = getResizeHandle(fixture).nativeElement as HTMLInputElement;

      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeInput.getAttribute('aria-controls')).toBe(listPanelElement.id);
      expect(resizeInput.getAttribute('aria-valuenow')).toBe('320');
      expect(resizeInput.getAttribute('aria-valuemax')).toBe(maxWidth.toString());
      expect(resizeInput.getAttribute('aria-valuemin')).toBe(minWidth.toString());
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
      mockQueryService.fire(SkyMediaBreakpoints.md);
      fixture.detectChanges();
      const resizeHandle = getResizeHandle(fixture);

      expect(resizeHandle).not.toBeNull();
      expect(listPanelHidden()).toEqual(false);
    }));

    it('should set focus in the workspace when messages are sent to the stream', fakeAsync(() => {
      // Send message to focus on workspace.
      const message: SkySplitViewMessage = {
        type: SkySplitViewMessageType.FocusWorkspace
      };
      component.splitViewMessageStream.next(message);
      fixture.detectChanges();
      tick();

      // Expect first element in workspace to have focus.
      const firstInputElement = document.querySelector('#sky-test-first-input');
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
        type: SkySplitViewMessageType.FocusWorkspace
      };
      component.splitViewMessageStream.next(message);
      fixture.detectChanges();
      tick();

      // Expect first element in workspace to have focus.
      const firstInputElement = document.querySelector('#sky-test-first-input');
      expect(getFocusedElement()).toEqual(firstInputElement);
    }));

    it ('should show the header and back link on smaller screens', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      const responsiveHeader = getHeader();
      const backToListButton = getBackToListButton();

      expect(responsiveHeader).not.toBeNull();
      expect(backToListButton).not.toBeNull();
    }));

    it ('should use default when backButtonText property is not defined', fakeAsync(() => {
      initiateResponsiveMode(fixture);
      const backToListButton = getBackToListButton();

      expect(backToListButton.innerText.trim()).toEqual('Back to list');
    }));

    it ('should allow custom labels for back button if backButtonText property is defined', fakeAsync(() => {
      const labelText = 'FOOBAR';
      component.backButtonText = labelText;
      fixture.detectChanges();
      initiateResponsiveMode(fixture);
      const backToListButton = getBackToListButton();

      expect(backToListButton.innerText.trim()).toEqual(labelText);
    }));

    it ('should show the list when the back link is clicked', fakeAsync(() => {
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

    it ('should resize list panel as window gets smaller to prevent it from overflowing', fakeAsync(() => {
      // Make list as wide as possible.
      component.width = 9999;
      fixture.detectChanges();
      tick();

      // Get baseline variables.
      const windowResizeAmount = 300;
      const tolerance = 100;
      const listPanel = getListPanel();
      const initialwidth = listPanel.clientWidth;
      const resizeWidth = initialwidth + tolerance - windowResizeAmount;
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(resizeWidth);

      // Resize the window smaller.
      SkyAppTestUtility.fireDomEvent(window, 'resize');
      fixture.detectChanges();

      // Expect the list panel width to resize down as the window gets smaller.
      // Use isWithin() to allow some pixel tolerance for different browsers.
      const newWidth = initialwidth - windowResizeAmount;
      expect(isWithin(listPanel.clientWidth, newWidth, 10)).toEqual(true);
    }));

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeAccessible();
    }));

    it('should pass accessibility when in responsive mode', async(() => {
      initiateResponsiveMode(fixture);
      expect(fixture.nativeElement).toBeAccessible();
    }));
  });
});
