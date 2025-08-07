import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyBreakpoint } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { SkyVerticalTabsFixturesModule } from './fixtures/vertical-tabs-fixtures.module';
import { VerticalTabsetEmptyGroupTestComponent } from './fixtures/vertical-tabset-empty-group.component';
import { VerticalTabsetWithNgForTestComponent } from './fixtures/vertical-tabset-ngfor.component.fixture';
import { VerticalTabsetNoActiveTestComponent } from './fixtures/vertical-tabset-no-active.component.fixture';
import { VerticalTabsetNoGroupTestComponent } from './fixtures/vertical-tabset-no-group.component.fixture';
import { VerticalTabsetProgrammaticTestComponent } from './fixtures/vertical-tabset-programmatic.component';
import { VerticalTabsetTestComponent } from './fixtures/vertical-tabset.component.fixture';
import { SkyVerticalTabsetComponent } from './vertical-tabset.component';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

// #region helpers
let mediaQueryController: SkyMediaQueryTestingController;

function getVisibleTabContentPane(
  fixture: ComponentFixture<unknown>,
): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(
      '.sky-vertical-tabset-content .sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)',
    ),
  );
}

function getTabset(fixture: ComponentFixture<unknown>): HTMLElement {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '.sky-vertical-tabset',
  ) as HTMLElement;
}

function getTabContentPanes(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane'),
  );
}

function getVisibleTabsetContent(
  fixture: ComponentFixture<unknown>,
): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(
      '.sky-vertical-tabset-content:not(.sky-vertical-tabset-content-hidden)',
    ),
  );
}

function getTabsContainer(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector(
    '.sky-vertical-tabset-group-container:not(.sky-vertical-tabset-hidden)',
  );
}

function getTabs(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.sky-vertical-tab'),
  );
}

function getTabGroups(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.sky-vertical-tabset-group'),
  );
}

function getOpenTabGroups(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.sky-expansion-indicator-up'),
  );
}

function getAllTabButtons(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.sky-vertical-tabset-button'),
  );
}

function getGroupButton(
  fixture: ComponentFixture<unknown>,
  index: number,
): HTMLButtonElement | null {
  return getTabGroups(fixture)[index].querySelector('button');
}

function clickGroupButton(
  fixture: ComponentFixture<unknown>,
  index: number,
): void {
  getGroupButton(fixture, index)?.click();
  fixture.detectChanges();
  tick();
}

function getTab(
  fixture: ComponentFixture<unknown>,
  groupIndex: number,
  tabIndex: number,
): HTMLElement {
  return getTabGroups(fixture)[groupIndex].querySelectorAll(
    '.sky-vertical-tab',
  )[tabIndex] as HTMLElement;
}

function clickTab(
  fixture: ComponentFixture<unknown>,
  groupIndex: number,
  tabIndex: number,
): void {
  getTab(fixture, groupIndex, tabIndex).click();
  fixture.detectChanges();
}

function expectGroupTabsAreVisible(
  fixture: ComponentFixture<unknown>,
  index: number,
): void {
  const groupContent = getTabGroups(fixture)[index].querySelector(
    '.sky-vertical-tabset-group-content',
  ) as HTMLElement;
  expect(groupContent.style.visibility).toEqual('visible');
  expect(groupContent.style.height).not.toEqual('0px');
  expect(groupContent.style.height).not.toEqual('0');
}

function expectGroupTabsAreNotVisible(
  fixture: ComponentFixture<unknown>,
  index: number,
): void {
  const groupContent = getTabGroups(fixture)[index].querySelector(
    '.sky-vertical-tabset-group-content',
  ) as HTMLElement;
  expect(groupContent.style.visibility).toEqual('hidden');
  expect(['0', '0px']).toContain(groupContent.style.height);
}

function expectActiveGroup(
  fixture: ComponentFixture<unknown>,
  innerText: string,
): void {
  const openGroupEl = fixture.nativeElement.querySelector(
    '.sky-vertical-tabset-group-header-active',
  ) as HTMLElement | null;

  expect(openGroupEl).toBeTruthy();
  expect(openGroupEl?.textContent?.trim()).toBe(innerText);
}

function expectOpenGroup(
  fixture: ComponentFixture<unknown>,
  innerText: string,
  open = true,
): void {
  const openGroupEl = fixture.nativeElement.querySelector(
    '.sky-vertical-tabset-group-header-sub-open',
  ) as HTMLElement | null;

  if (open) {
    expect(openGroupEl).toBeTruthy();
    expect(openGroupEl?.textContent?.trim()).toBe(innerText);
  } else {
    expect(openGroupEl?.textContent?.trim() === innerText).toBe(false);
  }
}

function expectVisibleTabContentPane(
  fixture: ComponentFixture<unknown>,
  innerText: string,
): void {
  const visibleTabContent = getVisibleTabContentPane(fixture);
  expect(visibleTabContent.length).toBe(1);
  expect(visibleTabContent[0]).toHaveText(innerText);
}

function elementHasFocus(el: HTMLElement | null): boolean {
  return !!el && document.activeElement === el;
}

function fireKeyEvent(
  el: HTMLElement | null,
  eventName: 'keydown' | 'keyup',
  key: string,
): void {
  SkyAppTestUtility.fireDomEvent(el, eventName, {
    keyboardEventInit: {
      key,
    },
  });
}

function fireTabsContainerKeydown(
  fixture: ComponentFixture<unknown>,
  key: string,
): void {
  fireKeyEvent(getTabsContainer(fixture), 'keydown', key);
}

function validateTabsKeyboardNav(
  fixture: ComponentFixture<unknown>,
  key: 'ArrowDown' | 'ArrowUp',
  expectedActiveIndex: number,
): void {
  fireTabsContainerKeydown(fixture, key);

  expect(
    elementHasFocus(getAllTabButtons(fixture)[expectedActiveIndex]),
  ).toBeTrue();
}
// #endregion

describe('Vertical tabset component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyVerticalTabsFixturesModule],
      providers: [provideSkyMediaQueryTesting()],
    });

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  function createTestComponent(): ComponentFixture<VerticalTabsetTestComponent> {
    return TestBed.createComponent(VerticalTabsetTestComponent);
  }

  it('first tab in open group should be selected', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();

    fixture.detectChanges();

    // check open group
    expectOpenGroup(fixture, 'Group 1');

    // check open group tab content
    const content = getVisibleTabContentPane(fixture)[0];
    expect(content).toHaveText('Group 1 Tab 1 content');
  });

  it('open second tab in second group', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    // check open tab
    expectVisibleTabContentPane(fixture, 'Group 1 Tab 1 content');

    // open second group
    clickGroupButton(fixture, 1);

    // check open tab
    expectVisibleTabContentPane(fixture, 'Group 1 Tab 1 content');

    // check second group open
    const openTabGroups = getOpenTabGroups(fixture);
    expect(openTabGroups.length).toBe(2);

    // click second tab in second group
    clickTab(fixture, 1, 1);

    // check open tab
    expectVisibleTabContentPane(fixture, 'Group 2 Tab 2 content');

    // check if parent group of selected tab has "active" CSS class
    expectActiveGroup(fixture, 'Group 2');

    flush();
  }));

  it('should open tab when enter key is pressed', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const tabs = getTabs(fixture);

    // open second tab
    fireKeyEvent(tabs[1], 'keyup', 'enter');
    fixture.detectChanges();

    // check open tab
    expectVisibleTabContentPane(fixture, 'Group 1 Tab 2 content');

    flush();
  }));

  it('should open tab when space key is pressed', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const tabs = getTabs(fixture);

    // open second tab
    fireKeyEvent(tabs[1], 'keyup', ' ');
    fixture.detectChanges();

    // check open tab
    expectVisibleTabContentPane(fixture, 'Group 1 Tab 2 content');

    flush();
  }));

  it('should expand and collapse groups with the left and right arrow keys', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const groupButton = getGroupButton(fixture, 0);

    expectOpenGroup(fixture, 'Group 1');

    fireKeyEvent(groupButton, 'keyup', 'ArrowLeft');
    fixture.detectChanges();

    expectOpenGroup(fixture, 'Group 1', false);

    fireKeyEvent(groupButton, 'keyup', 'ArrowRight');
    fixture.detectChanges();

    expectOpenGroup(fixture, 'Group 1');
  });

  it('should move to the first item in a group with the right arrow key', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const groupButton = getGroupButton(fixture, 0);

    expectOpenGroup(fixture, 'Group 1');

    fireKeyEvent(groupButton, 'keyup', 'ArrowRight');
    fixture.detectChanges();

    expect(elementHasFocus(getTab(fixture, 0, 0))).toBeTrue();
  });

  it('should focus parent group when left arrow is pressed', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    clickGroupButton(fixture, 1);

    // click second tab in second group
    clickTab(fixture, 1, 1);

    fireKeyEvent(getTab(fixture, 1, 1), 'keyup', 'ArrowLeft');

    expect(elementHasFocus(getGroupButton(fixture, 1))).toBeTrue();

    flush();
  }));

  it('should navigate between tabs when up and down arrow keys are pressed', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const tabsContainer = getTabsContainer(fixture);
    const allButtons = getAllTabButtons(fixture);
    const groups = getTabGroups(fixture);

    // This will focus the active tab, which is the second tab button
    // (the first being its group button)
    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focus');

    // The last group is disabled, so get the penultimate group.
    const lastEnabledGroupButton = getGroupButton(
      fixture,
      groups.length - 2,
    ) as HTMLButtonElement;

    validateTabsKeyboardNav(fixture, 'ArrowDown', 2);
    validateTabsKeyboardNav(fixture, 'ArrowDown', 3);
    validateTabsKeyboardNav(fixture, 'ArrowUp', 2);
    validateTabsKeyboardNav(fixture, 'ArrowUp', 1);
    validateTabsKeyboardNav(fixture, 'ArrowUp', 0);

    // Validate focus circles back to the top or bottom.
    validateTabsKeyboardNav(
      fixture,
      'ArrowUp',
      allButtons.indexOf(lastEnabledGroupButton),
    );
    validateTabsKeyboardNav(fixture, 'ArrowDown', 0);
  });

  it('should focus the active tab when the tabs container is focused', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const tabset = getTabset(fixture);
    const tabsContainer = getTabsContainer(fixture);

    clickGroupButton(fixture, 1);

    // click second tab in second group
    clickTab(fixture, 1, 1);

    // Disallow tabbing to the tabset while focus is in the tabs container.
    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focusin');
    fixture.detectChanges();
    expect(tabset.tabIndex).toBe(-1);

    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focus');

    expect(elementHasFocus(getTab(fixture, 1, 1))).toBeTrue();

    // Enable tabbing to the tabset when focus leaves the tabs container.
    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focusout');
    fixture.detectChanges();
    expect(tabset.tabIndex).toBe(0);

    flush();
  }));

  it('should focus the active tab when the tab container is opened on mobile view', fakeAsync(() => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const el = fixture.nativeElement;

    // click show tabs button to open tab group
    let showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();
    fixture.detectChanges();

    // click second tab in second group
    clickGroupButton(fixture, 1);
    clickTab(fixture, 1, 1);

    // open tab group and wait for timer to finish
    showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();
    fixture.detectChanges();

    //wait for animation to finish
    tick();

    expect(elementHasFocus(getTab(fixture, 1, 1))).toBeTrue();
  }));

  it('should focus the first tab when the tabs container is focused and no tab is active', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();

    fixture.componentInstance.active = false;
    fixture.detectChanges();

    const tabsContainer = getTabsContainer(fixture);

    const tabButtons = getAllTabButtons(fixture);

    expect(elementHasFocus(tabButtons[0])).toBeFalse();

    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focus');

    expect(elementHasFocus(tabButtons[0])).toBeTrue();
  });

  it('should reset tab index when leaving tab list view in mobile view', () => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;
    const tabset = getTabset(fixture);
    fixture.detectChanges();

    expect(tabset.tabIndex).toBe(0);

    // click show tabs button
    const showTabsButton = el.querySelector(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    showTabsButton.click();
    fixture.detectChanges();

    // focus into tablist
    const tabsContainer = getTabsContainer(fixture);
    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focusin');
    fixture.detectChanges();

    expect(tabset.tabIndex).toBe(-1);

    // click the second tab
    const allTabs = el.querySelectorAll('.sky-vertical-tab');
    allTabs[1].click();
    fixture.detectChanges();

    // focus the tabset content container
    const verticalTabsetContent = el.querySelector(
      '.sky-vertical-tabset-content',
    );
    SkyAppTestUtility.fireDomEvent(verticalTabsetContent, 'focusin');
    fixture.detectChanges();

    expect(tabset.tabIndex).toBe(0);
  });

  it('should set a tab active=false when set to undefined', () => {
    const fixture = createTestComponent();

    const verticalTabsetSvc = fixture.debugElement
      .query(By.directive(SkyVerticalTabsetComponent))
      .injector.get(SkyVerticalTabsetService);

    const activateSpy = spyOn(
      verticalTabsetSvc,
      'activateTab',
    ).and.callThrough();

    fixture.componentInstance.active = undefined;
    fixture.detectChanges();

    const tabButtons = getAllTabButtons(fixture);
    expect(elementHasFocus(tabButtons[0])).toBeFalse();

    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(0);

    expect(activateSpy).not.toHaveBeenCalled();
  });

  it('should programmatically select tabs', () => {
    const fixture = TestBed.createComponent(
      VerticalTabsetProgrammaticTestComponent,
    );

    // Activate first tab.
    fixture.componentInstance.activeIndex = 0;
    fixture.detectChanges();

    // Activate second tab.
    fixture.componentInstance.activeIndex = 1;
    fixture.detectChanges();

    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Tab 2 content');
  });

  it("should focus the active tab's group when the tabs container is focused and the tab's group is collapsed", fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    const tabsContainer = getTabsContainer(fixture);

    clickGroupButton(fixture, 1);

    // click second tab in second group
    clickTab(fixture, 1, 1);

    clickGroupButton(fixture, 1);

    expectOpenGroup(fixture, 'Group 2', false);
    expect(elementHasFocus(getGroupButton(fixture, 1))).toBeFalse();

    SkyAppTestUtility.fireDomEvent(tabsContainer, 'focus');

    expect(elementHasFocus(getGroupButton(fixture, 1))).toBeTrue();

    flush();
  }));

  it('should pass through aria inputs, id, and set role', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.componentInstance.tab1Required = true;
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check open tab content
    const tab = el.querySelector('sky-vertical-tab a');
    const tabset = el.querySelector('.sky-vertical-tabset-tablist');
    expect(tab?.id).toBe('some-tab');
    expect(tab?.getAttribute('aria-controls')).toBe('some-div');
    expect(tab?.getAttribute('id')).toBe('some-tab');
    expect(tab?.getAttribute('role')).toBe('tab');
    expect(tabset?.getAttribute('role')).toBe('tablist');

    fixture.componentInstance.tab1Id = undefined;
    fixture.componentInstance.tab1AriaRole = undefined;
    fixture.componentInstance.tabsetAriaRole = undefined;
    fixture.detectChanges();
    expect(tab?.getAttribute('id')).toEqual(
      jasmine.stringMatching(/sky-vertical-tab-[0-9]/),
    );
    expect(tab?.getAttribute('role')).toBe('tab');
    expect(tabset?.getAttribute('role')).toBe('tablist');

    fixture.componentInstance.tab1Id = 'tab-changed';
    fixture.componentInstance.tab1AriaRole = 'custom';
    fixture.componentInstance.tabsetAriaRole = 'custom';
    fixture.detectChanges();
    expect(tab?.getAttribute('id')).toBe('tab-changed');
    expect(tab?.getAttribute('role')).toBe('custom');
    expect(tabset?.getAttribute('role')).toBe('custom');
  });

  it('check closing of group', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    expectGroupTabsAreVisible(fixture, 0);

    // close first group
    clickGroupButton(fixture, 0);

    expectGroupTabsAreNotVisible(fixture, 0);
  }));

  it('disabled group should not open when clicked', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();

    expectGroupTabsAreVisible(fixture, 0);
    expectGroupTabsAreNotVisible(fixture, 1);

    // click disabled group
    clickGroupButton(fixture, 2);

    // check group is still closed (only first group still open)
    expectGroupTabsAreVisible(fixture, 0);
    expectGroupTabsAreNotVisible(fixture, 1);
  }));

  it('mobile button should not be visible on wide screen', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check show tabs button is not visible
    const showTabsButton = el.querySelectorAll(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    expect(showTabsButton.length).toBe(0);
  });

  it('mobile button should be visible on small screen', () => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check show tabs button is visible
    const showTabsButton = el.querySelectorAll(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    expect(showTabsButton.length).toBe(1);
    expect(showTabsButton[0].textContent.trim()).toBe('Tab list');

    // check content is visible
    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 1 content');

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs).toBeFalsy();
  });

  it('show tabs button should show tabs on mobile', () => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs).toBeFalsy();

    // check content is visible
    let visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 1 content');

    // click show tabs
    const showTabsButton = el.querySelector(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    showTabsButton.click();

    fixture.detectChanges();

    // check tabs are visible
    const tabsUpdated = getTabsContainer(fixture);
    expect(tabsUpdated).toBeTruthy();

    // check content is not visible
    visibleTabs = getVisibleTabsetContent(fixture);
    expect(visibleTabs.length).toBe(0);
  });

  it('clicking a tab in mobile should show content and hides tabs', () => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // click show tabs
    const showTabsButton = el.querySelector(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    showTabsButton.click();

    fixture.detectChanges();

    // click second tab in first group
    const allTabs = el.querySelectorAll('.sky-vertical-tab');
    allTabs[1].click();

    fixture.detectChanges();

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs).toBeFalsy();

    // check content is visible
    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 2 content');
  });

  it('tabs should not have tab aria associations and roles in mobile view', () => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // click show tabs
    const showTabsButton = el.querySelector(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    showTabsButton.click();

    fixture.detectChanges();

    const visibleTab = el.querySelector('.sky-vertical-tab');
    expect(visibleTab.getAttribute('aria-controls')).toBeFalsy();
    expect(visibleTab.getAttribute('role')).toBeFalsy();
  });

  it('should hide tabs when switching from widescreen to mobile', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // simulate screen size change switching to mobile
    mediaQueryController.setBreakpoint('xs');
    fixture.componentInstance.tabset?.tabService.updateContent();
    fixture.detectChanges();

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs).toBeFalsy();

    // check content is visible
    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 1 content');

    // check show tabs button is visible
    const showTabsButton = el.querySelector(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    showTabsButton.click();
  });

  it('should show tabs and hide tab list button when switching from mobile to widescreen', () => {
    mediaQueryController.setBreakpoint('xs');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // simulate screen size change switching to widescreen
    mediaQueryController.setBreakpoint('lg');
    fixture.componentInstance.tabset?.tabService.updateContent();
    fixture.detectChanges();

    // check tabs are visible
    const tabs = getTabsContainer(fixture);
    expect(tabs).toBeTruthy();

    // check content is visible
    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 1 content');

    // check show tabs button is not visible
    const showTabsButton = el.querySelectorAll(
      '.sky-vertical-tabset-show-tabs-btn',
    );
    expect(showTabsButton.length).toBe(0);
  });

  it('should deactivate active tab when another tab is clicked', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.detectChanges();
    const el = fixture.nativeElement;

    // click first tab in first group
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    // check open tab
    let visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 1 content');

    // check open group
    expectOpenGroup(fixture, 'Group 1');

    // click second tab in first group
    tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[1].click();

    fixture.detectChanges();

    // check open tab
    visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 1 Tab 2 content');

    // check open group
    expectOpenGroup(fixture, 'Group 1');
  });

  it('should display tab header count when defined', () => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check open tab content
    const activeTab = el.querySelectorAll('.sky-vertical-tab-active');
    expect(activeTab.length).toBe(1);
    const headerCount = activeTab[0].querySelector('.sky-vertical-tab-count');
    expect(headerCount).toHaveText('(5)');
  });

  it('should not display tab header count when not defined', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // open second group
    clickGroupButton(fixture, 1);

    // click first tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[2].click();

    fixture.detectChanges();

    // check tab header count is not displayed
    const activeTab = el.querySelectorAll('.sky-vertical-tab-active');
    expect(activeTab.length).toBe(1);
    const headerCount = activeTab[0].querySelector('.sky-vertical-tab-count');
    expect(headerCount).toBe(null);

    flush();
  }));

  it('should not activate tab when disabled', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // open second group
    clickGroupButton(fixture, 1);

    // open first tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[2].click();

    fixture.detectChanges();

    // check content is displayed
    let visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 2 Tab 1 content');

    // try clicking disabled third tab in second group
    tabs[4].click();

    fixture.detectChanges();

    // check content of second tab still displayed
    visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 2 Tab 1 content');

    flush();
  }));

  it('should be accessible', async () => {
    const fixture = createTestComponent();

    // Show the tab's panel for the test.
    fixture.componentInstance.showScrollable = true;

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be accessible without active tab', async () => {
    const fixture = createTestComponent();

    // Show the tab's panel for the test.
    fixture.componentInstance.showScrollable = true;
    fixture.componentInstance.active = false;

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be accessible in mobile', async () => {
    const fixture = createTestComponent();

    // Show the tab's panel for the test.
    fixture.componentInstance.showScrollable = true;
    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be accessible in mobile without active tab', async () => {
    const fixture = createTestComponent();

    // Show the tab's panel for the test.
    fixture.componentInstance.showScrollable = true;
    fixture.componentInstance.active = false;
    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('maintainTabContent - tab content remains in same order', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');
    const fixture = createTestComponent();
    fixture.componentInstance.maintainTabContent = true;
    fixture.detectChanges();
    const el = fixture.nativeElement;

    // check order of vertical tab content
    const allTabContentElements = getTabContentPanes(fixture);
    expect(allTabContentElements.length).toBe(7);
    expect(allTabContentElements[0]).toHaveText('Group 1 Tab 1 content');
    expect(allTabContentElements[1]).toHaveText('Group 1 Tab 2 content');
    expect(allTabContentElements[2]).toHaveText('Group 2 Tab 1 content');
    expect(allTabContentElements[3]).toHaveText('Group 2 Tab 2 content');
    expect(allTabContentElements[4]).toHaveText('Group 2 Tab 3 content');
    expect(allTabContentElements[5]).toHaveText('Group 3 Tab 1 content');
    expect(allTabContentElements[6]).toHaveText('Group 3 Tab 2 content');

    // open second group
    clickGroupButton(fixture, 1);

    // check second group open
    expect(getOpenTabGroups(fixture).length).toBe(2);

    // click second tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[3].click();

    fixture.detectChanges();

    // check open tab
    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0]).toHaveText('Group 2 Tab 2 content');

    // check active group
    expectActiveGroup(fixture, 'Group 2');

    fixture.detectChanges();

    // check order of vertical tab content - order should not change
    const allTabContentElements2 = getTabContentPanes(fixture);
    expect(allTabContentElements2.length).toBe(7);
    expect(allTabContentElements2[0]).toHaveText('Group 1 Tab 1 content');
    expect(allTabContentElements2[1]).toHaveText('Group 1 Tab 2 content');
    expect(allTabContentElements2[2]).toHaveText('Group 2 Tab 1 content');
    expect(allTabContentElements2[3]).toHaveText('Group 2 Tab 2 content');
    expect(allTabContentElements2[4]).toHaveText('Group 2 Tab 3 content');
    expect(allTabContentElements2[5]).toHaveText('Group 3 Tab 1 content');
    expect(allTabContentElements2[6]).toHaveText('Group 3 Tab 2 content');
  }));

  function expectResponsiveCssClass(
    el: HTMLElement | undefined,
    breakpoint: SkyBreakpoint,
  ): void {
    if (!el) {
      throw new Error(
        'Cannot determine responsive class because element does not exist.',
      );
    }

    expect(el).toHaveCssClass(`sky-responsive-container-${breakpoint}`);
  }

  it('should add the appropriate responsive container upon initialization', async () => {
    const fixture = createTestComponent();
    fixture.detectChanges();

    const activeTab = fixture.componentInstance.verticalTabs?.find(
      (tab) => !!tab.active,
    );

    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();
    await fixture.whenStable();

    expectResponsiveCssClass(activeTab?.tabContent?.nativeElement, 'xs');

    mediaQueryController.setBreakpoint('sm');
    fixture.detectChanges();
    await fixture.whenStable();

    expectResponsiveCssClass(activeTab?.tabContent?.nativeElement, 'sm');

    mediaQueryController.setBreakpoint('md');
    fixture.detectChanges();
    await fixture.whenStable();

    expectResponsiveCssClass(activeTab?.tabContent?.nativeElement, 'md');

    mediaQueryController.setBreakpoint('lg');
    fixture.detectChanges();
    await fixture.whenStable();

    expectResponsiveCssClass(activeTab?.tabContent?.nativeElement, 'lg');
  });

  it('should scroll back to the top of the content pane when switching tabs', () => {
    const fixture = createTestComponent();
    fixture.detectChanges();

    const el = fixture.nativeElement;
    fixture.componentInstance.showScrollable = true;

    fixture.detectChanges();

    const contentPane = document.querySelector('.sky-vertical-tabset-content');

    if (contentPane) {
      contentPane.scrollTop = 200;
    }

    fixture.detectChanges();

    // click second tab in first group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[1].click();

    fixture.detectChanges();

    expect(contentPane?.scrollTop).toBe(0);
  });

  it('should be accessible when content pane is scrollable', async () => {
    const fixture = createTestComponent();
    fixture.detectChanges();

    fixture.componentInstance.showScrollable = true;

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be accessible when content pane is scrollable in mobile', async () => {
    const fixture = createTestComponent();
    fixture.detectChanges();

    fixture.componentInstance.showScrollable = true;
    mediaQueryController.setBreakpoint('xs');

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('Vertical tabset component - with ngFor', () => {
  let fixture: ComponentFixture<VerticalTabsetWithNgForTestComponent>;
  let component: VerticalTabsetWithNgForTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyVerticalTabsFixturesModule],
      providers: [provideSkyMediaQueryTesting()],
    });
    fixture = TestBed.createComponent(VerticalTabsetWithNgForTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('should dynamically show and hide tabs with structural directives', () => {
    // Baseline: expect test to start with 3 tabs.
    let tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(3);

    let tabContentElements = getTabContentPanes(fixture);
    expect(tabContentElements.length).toBe(3);

    // Remove first tab from array.
    component.tabs.splice(0, 1);
    fixture.detectChanges();

    // Expect tab to be removed from DOM.
    tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(2);

    tabContentElements = getTabContentPanes(fixture);
    expect(tabContentElements.length).toBe(2);

    // Add tab to array.
    component.tabs.push({
      id: '99',
      heading: 'tab 99',
      content: 'Tab 99 content',
    });
    fixture.detectChanges();

    // New tab should be rendered in DOM.
    tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(3);

    tabContentElements = getTabContentPanes(fixture);
    expect(tabContentElements.length).toBe(3);
  });

  it('should update active index when the active tab is removed via structural directives', () => {
    // Activate first tab.
    const tabElements = getTabs(fixture);
    expect(tabElements.length).toEqual(3);
    tabElements[0].click();
    fixture.detectChanges();

    // Remove first tab from array.
    component.tabs.splice(0, 1);
    fixture.detectChanges();

    // Next active tab should be selected.
    let visibleTabContent = getVisibleTabContentPane(fixture);
    expect(visibleTabContent.length).toBe(1);
    let tabContent = visibleTabContent[0];
    expect(tabContent).not.toBeUndefined();
    expect(fixture.componentInstance.activeIndex).toEqual(0);
    expect(tabContent).toHaveText('Tab 2 content');

    // Now, remove last (second) tab from array.
    component.tabs.splice(1, 1);
    fixture.detectChanges();

    // Next active tab should be selected.
    visibleTabContent = getVisibleTabContentPane(fixture);
    expect(visibleTabContent.length).toBe(1);
    tabContent = visibleTabContent[0];
    expect(tabContent).not.toBeUndefined();
    expect(fixture.componentInstance.activeIndex).toEqual(0);
    expect(tabContent).toHaveText('Tab 2 content');
  });
});

// test tab group with no subtabs
describe('Vertical tabset component - no subtabs', () => {
  let fixture: ComponentFixture<VerticalTabsetEmptyGroupTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyVerticalTabsFixturesModule],
      providers: [provideSkyMediaQueryTesting()],
    });
    fixture = TestBed.createComponent(VerticalTabsetEmptyGroupTestComponent);
    fixture.detectChanges();

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('group without tab should load without failing', () => {
    const visibleTabs = getVisibleTabContentPane(fixture);
    expect(visibleTabs.length).toBe(0);
  });
});

describe('Vertical tabset component - no groups', () => {
  let fixture: ComponentFixture<VerticalTabsetNoGroupTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyVerticalTabsFixturesModule],
      providers: [provideSkyMediaQueryTesting()],
    });
    fixture = TestBed.createComponent(VerticalTabsetNoGroupTestComponent);
    fixture.detectChanges();

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('should load tabs without groups', () => {
    expect(getTabs(fixture).length).toBe(3);
    expectVisibleTabContentPane(fixture, 'Tab 2 content');
  });

  it('should switch tabs on clicking without groups', () => {
    expect(fixture.componentInstance.currentIndex).toBe(1);

    // open first tab
    const tabs = fixture.nativeElement.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();
    fixture.detectChanges();

    // check activeChange fires and visible tab content pane
    expect(fixture.componentInstance.currentIndex).toBe(0);
    expectVisibleTabContentPane(fixture, 'Tab 1 content');
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be accessible in mobile', async () => {
    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('Vertical tabset no active tabs', () => {
  let fixture: ComponentFixture<VerticalTabsetNoActiveTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyVerticalTabsFixturesModule],
      providers: [provideSkyMediaQueryTesting()],
    });
    fixture = TestBed.createComponent(VerticalTabsetNoActiveTestComponent);
    fixture.detectChanges();

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('should not fail when trying to move active content when no tabs are active', () => {
    // move content should not fail
    fixture.componentInstance.tabset?.tabService.updateContent();
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be accessible in mobile', async () => {
    mediaQueryController.setBreakpoint('xs');
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
