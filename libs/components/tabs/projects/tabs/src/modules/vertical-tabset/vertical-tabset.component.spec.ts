import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  expectAsync,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyVerticalTabsFixturesModule
} from './fixtures/vertical-tabs-fixtures.module';

import {
  VerticalTabsetTestComponent
} from './fixtures/vertical-tabset.component.fixture';

import {
  VerticalTabsetEmptyGroupTestComponent
} from './fixtures/vertical-tabset-empty-group.component';

import {
  VerticalTabsetWithNgForTestComponent
} from './fixtures/vertical-tabset-ngfor.component.fixture';

import {
  VerticalTabsetNoActiveTestComponent
} from './fixtures/vertical-tabset-no-active.component.fixture';

import {
  VerticalTabsetNoGroupTestComponent
} from './fixtures/vertical-tabset-no-group.component.fixture';

import {
  SkyVerticalTabMediaQueryService
} from './vertical-tab-media-query.service';

import {
  SkyVerticalTabsetComponent
} from './vertical-tabset.component';

// #region helpers
let mockQueryService: MockSkyMediaQueryService;
const isIE = window.navigator.userAgent.indexOf('rv:11.0') >= 0;

function getVisibleTabContent(fixture: ComponentFixture<any>): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)');
}

function getVisibleTabsetContent(fixture: ComponentFixture<any>): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll('.sky-vertical-tabset-content:not(.sky-vertical-tabset-content-hidden)');
}

function getTabsContainer(fixture: ComponentFixture<any>): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll('.sky-vertical-tabset-group-container:not(.sky-vertical-tabset-hidden)');
}

function getTabs(fixture: ComponentFixture<any>): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll('.sky-vertical-tab');
}
// #endregion

describe('Vertical tabset component', () => {
  beforeEach(() => {
    mockQueryService  = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ],
      providers: [
        {
          provide: SkyMediaQueryService,
          useValue: mockQueryService
        }
      ]
    });
  });

  function createTestComponent() {
    let fixture = TestBed.overrideComponent(SkyVerticalTabsetComponent, {
      add: {
        providers: [
          { provide: SkyMediaQueryService, useValue: mockQueryService }
        ]
      }
    })
    .createComponent(VerticalTabsetTestComponent);
    return fixture;
  }

  it('first tab in open group should be selected', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check open group
    const openGroup = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroup.length).toBe(1);
    expect(openGroup[0].textContent.trim()).toBe('Group 1');

    // check open group tab content
    const content = getVisibleTabContent(fixture)[0];
    expect(content.textContent.trim()).toBe('Group 1 Tab 1 content');
  });

  it('open second tab in second group', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    fixture.detectChanges();
    let el = fixture.nativeElement;

    // check open tab
    let visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check order of vertical tab content
    let allTabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(allTabContentElements.length).toBe(2);
    expect(allTabContentElements[0].textContent.trim()).toBe('Group 1 Tab 2 content');
    expect(allTabContentElements[1].textContent.trim()).toBe('Group 1 Tab 1 content');

    // open second group
    const group = el.querySelectorAll('.sky-vertical-tabset-group-header');
    group[1].click();

    fixture.detectChanges();

    // check open tab
    visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check order of vertical tab content
    allTabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(allTabContentElements.length).toBe(5);
    expect(allTabContentElements[0].textContent.trim()).toBe('Group 1 Tab 2 content');
    expect(allTabContentElements[1].textContent.trim()).toBe('Group 2 Tab 1 content');
    expect(allTabContentElements[2].textContent.trim()).toBe('Group 2 Tab 2 content');
    expect(allTabContentElements[3].textContent.trim()).toBe('Group 2 Tab 3 content');
    expect(allTabContentElements[4].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check second group open
    const openedGroups = el.querySelectorAll('.sky-chevron-up');
    expect(openedGroups.length).toBe(2);

    // click second tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[3].click();

    fixture.detectChanges();

    // check open tab
    visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 2 Tab 2 content');

    // check open group
    const openGroup = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroup.length).toBe(1);
    expect(openGroup[0].textContent.trim()).toBe('Group 2');

    // check order of vertical tab content
    allTabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(allTabContentElements.length).toBe(5);
    expect(allTabContentElements[0].textContent.trim()).toBe('Group 1 Tab 2 content');
    expect(allTabContentElements[1].textContent.trim()).toBe('Group 2 Tab 1 content');
    expect(allTabContentElements[2].textContent.trim()).toBe('Group 2 Tab 3 content');
    expect(allTabContentElements[3].textContent.trim()).toBe('Group 1 Tab 1 content');
    expect(allTabContentElements[4].textContent.trim()).toBe('Group 2 Tab 2 content');
  });

  it('should pass through aria inputs, id, and set role', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    fixture.componentInstance.tab1Required = true;
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check open tab content
    const tab = el.querySelector('sky-vertical-tab a');
    expect(tab.id).toBe('some-tab');
    expect(tab.getAttribute('aria-controls')).toBe('some-div');
    expect(tab.getAttribute('aria-invalid')).toBe('true');
    expect(tab.getAttribute('aria-required')).toBe('true');
    expect(tab.getAttribute('role')).toBe('tab');
  });

  it('check closing of group', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // close first group
    const group = el.querySelectorAll('.sky-vertical-tabset-group-header');
    group[0].click();

    fixture.detectChanges();

    // check group is closed
    const openedGroups = el.querySelectorAll('.sky-chevron-up');
    expect(openedGroups.length).toBe(0);
  });

  it('disabled group should not open when clicked', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // click disabled group
    const group = el.querySelectorAll('.sky-vertical-tabset-group-header');
    group[2].click();

    fixture.detectChanges();

    // check group is still closed (only first group still open)
    const openedGroups = el.querySelectorAll('.sky-chevron-up');
    expect(openedGroups.length).toBe(1);
  });

  it('mobile button should not be visible on wide screen', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check show tabs button is not visible
    const showTabsButton = el.querySelectorAll('.sky-vertical-tabset-show-tabs-btn');
    expect(showTabsButton.length).toBe(0);
  });

  it('mobile button should be visible on small screen', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check show tabs button is visible
    const showTabsButton = el.querySelectorAll('.sky-vertical-tabset-show-tabs-btn');
    expect(showTabsButton.length).toBe(1);
    expect(showTabsButton[0].textContent.trim()).toBe('Tab list');

    // check content is visible
    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs.length).toBe(0);
  });

  it('show tabs button should show tabs on mobile', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs.length).toBe(0);

    // check content is visible
    let visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // click show tabs
    const showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();

    fixture.detectChanges();

    // check tabs are visible
    const tabsUpdated = getTabsContainer(fixture);
    expect(tabsUpdated.length).toBe(1);

    // check content is not visible
    visibleTabs = getVisibleTabsetContent(fixture);
    expect(visibleTabs.length).toBe(0);
  });

  it('clicking a tab in mobile should show content and hides tabs', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // click show tabs
    const showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();

    fixture.detectChanges();

    // click second tab in first group
    const allTabs = el.querySelectorAll('.sky-vertical-tab');
    allTabs[1].click();

    fixture.detectChanges();

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs.length).toBe(0);

    // check content is visible
    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 2 content');
  });

  it('tabs should not have tab aria associations and roles in mobile view', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // click show tabs
    const showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();

    fixture.detectChanges();

    const visibleTab = el.querySelector('.sky-vertical-tab');
    expect(visibleTab.getAttribute('aria-controls')).toBeFalsy();
    expect(visibleTab.getAttribute('role')).toBeFalsy();
  });

  it('should hide tabs when switching from widescreen to mobile', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // simulate screensize change switching to mobile
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.componentInstance.tabset.tabService.updateContent();
    fixture.detectChanges();

    // check tabs are not visible
    const tabs = getTabsContainer(fixture);
    expect(tabs.length).toBe(0);

    // check content is visible
    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check show tabs button is visible
    const showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();
  });

  it('should show tabs and hide tab list button when switching from mobile to widescreen', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // simulate screensize change switching to widescreen
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    fixture.componentInstance.tabset.tabService.updateContent();
    fixture.detectChanges();

    // check tabs are visible
    const tabs = getTabsContainer(fixture);
    expect(tabs.length).toBe(1);

    // check content is visible
    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check show tabs button is not visible
    const showTabsButton = el.querySelectorAll('.sky-vertical-tabset-show-tabs-btn');
    expect(showTabsButton.length).toBe(0);
  });

  it('should deactivate active tab when another tab is clicked', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    fixture.detectChanges();
    let el = fixture.nativeElement;

    // click first tab in first group
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    // check open tab
    let visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check open group
    let openGroups = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroups.length).toBe(1);
    expect(openGroups[0].textContent.trim()).toBe('Group 1');

    // click second tab in first group
    tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[1].click();

    fixture.detectChanges();

    // check open tab
    visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 2 content');

    // check open group
    openGroups = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroups.length).toBe(1);
    expect(openGroups[0].textContent.trim()).toBe('Group 1');
  });

  it('should display tab header count when defined', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check open tab content
    const activeTab = el.querySelectorAll('.sky-vertical-tab-active');
    expect(activeTab.length).toBe(1);
    const headerCount = activeTab[0].querySelector('.sky-vertical-tab-count');
    expect(headerCount.textContent.trim()).toBe('(5)');
  });

  it('should not display tab header count when not defined', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // open second group
    const group = el.querySelectorAll('.sky-vertical-tabset-group-header');
    group[1].click();

    fixture.detectChanges();

    // click first tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[2].click();

    fixture.detectChanges();

    // check tab header count is not displayed
    const activeTab = el.querySelectorAll('.sky-vertical-tab-active');
    expect(activeTab.length).toBe(1);
    const headerCount = activeTab[0].querySelector('.sky-vertical-tab-count');
    // tslint:disable-next-line:no-null-keyword
    expect(headerCount).toBe(null);
  });

  it('should not activate tab when disabled', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // open second group
    const groups = el.querySelectorAll('.sky-vertical-tabset-group-header');
    groups[1].click();

    fixture.detectChanges();

    // open first tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[2].click();

    fixture.detectChanges();

    // check content is displayed
    let visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 2 Tab 1 content');

    // try clicking disabled third tab in second group
    tabs[4].click();

    fixture.detectChanges();

    // check content of second tab still displayed
    visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 2 Tab 1 content');
  });

  it('should be accessible', async () => {
    let fixture = createTestComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('maintainTabContent - tab content remains in same order', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    fixture.componentInstance.maintainTabContent = true;
    fixture.detectChanges();
    let el = fixture.nativeElement;

    // check order of vertical tab content
    const allTabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(allTabContentElements.length).toBe(7);
    expect(allTabContentElements[0].textContent.trim()).toBe('Group 1 Tab 1 content');
    expect(allTabContentElements[1].textContent.trim()).toBe('Group 1 Tab 2 content');
    expect(allTabContentElements[2].textContent.trim()).toBe('Group 2 Tab 1 content');
    expect(allTabContentElements[3].textContent.trim()).toBe('Group 2 Tab 2 content');
    expect(allTabContentElements[4].textContent.trim()).toBe('Group 2 Tab 3 content');
    expect(allTabContentElements[5].textContent.trim()).toBe('Group 3 Tab 1 content');
    expect(allTabContentElements[6].textContent.trim()).toBe('Group 3 Tab 2 content');

    // open second group
    const group = el.querySelectorAll('.sky-vertical-tabset-group-header');
    group[1].click();

    fixture.detectChanges();

    // check second group open
    const openedGroups = el.querySelectorAll('.sky-chevron-up');
    expect(openedGroups.length).toBe(2);

    // click second tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[3].click();

    fixture.detectChanges();

    // check open tab
    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 2 Tab 2 content');

    // check open group
    const openGroup = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroup.length).toBe(1);
    expect(openGroup[0].textContent.trim()).toBe('Group 2');

    fixture.detectChanges();

    // check order of vertical tab content - order should not change
    const allTabContentElements2 = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(allTabContentElements2.length).toBe(7);
    expect(allTabContentElements2[0].textContent.trim()).toBe('Group 1 Tab 1 content');
    expect(allTabContentElements2[1].textContent.trim()).toBe('Group 1 Tab 2 content');
    expect(allTabContentElements2[2].textContent.trim()).toBe('Group 2 Tab 1 content');
    expect(allTabContentElements2[3].textContent.trim()).toBe('Group 2 Tab 2 content');
    expect(allTabContentElements2[4].textContent.trim()).toBe('Group 2 Tab 3 content');
    expect(allTabContentElements2[5].textContent.trim()).toBe('Group 3 Tab 1 content');
    expect(allTabContentElements2[6].textContent.trim()).toBe('Group 3 Tab 2 content');
  });

  it('should add the appropriate responsive container upon initialization', async () => {
    spyOnProperty(Element.prototype, 'clientWidth', 'get').and.returnValue(640);
    const mediaQuerySpy = spyOn(SkyVerticalTabMediaQueryService.prototype, 'setBreakpointForWidth').and.callThrough();

    const fixture = createTestComponent();
    fixture.detectChanges();

    const activeTab = fixture.componentInstance.verticalTabs.find(tab => tab.active);
    fixture.detectChanges();
    await fixture.whenStable();

    const tabContentPane: HTMLElement = activeTab.tabContent.nativeElement;
    expect(mediaQuerySpy).toHaveBeenCalledWith(640);
    expect(tabContentPane.classList.contains('sky-responsive-container-xs')).toBeTruthy();
  });

  it('should add the appropriate responsive container upon window resize', async () => {
    let fixture = createTestComponent();
    const widthSpy = spyOnProperty(Element.prototype, 'clientWidth', 'get').and.returnValue(1500);
    fixture.detectChanges();

    const activeTab = fixture.componentInstance.verticalTabs.find(tab => tab.active);
    fixture.detectChanges();
    await fixture.whenStable();

    let tabContentPane: HTMLElement = activeTab.tabContent.nativeElement;

    expect(tabContentPane.classList.contains('sky-responsive-container-lg')).toBeTruthy();
    widthSpy.and.returnValue(1100);
    const mediaQuerySpy = spyOn(SkyVerticalTabMediaQueryService.prototype, 'setBreakpointForWidth').and.callThrough();

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    tabContentPane = activeTab.tabContent.nativeElement;
    expect(mediaQuerySpy).toHaveBeenCalledWith(1100);
    expect(tabContentPane.classList.contains('sky-responsive-container-md')).toBeTruthy();
  });

  it('should add the appropriate responsive container upon a tab being activated', async () => {
    let fixture = createTestComponent();
    fixture.detectChanges();
    let el = fixture.nativeElement;

    spyOnProperty(Element.prototype, 'clientWidth', 'get').and.returnValue(800);
    const mediaQuerySpy = spyOn(SkyVerticalTabMediaQueryService.prototype, 'setBreakpointForWidth').and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();

    // open second group
    const groups = el.querySelectorAll('.sky-vertical-tabset-group-header');
    groups[1].click();

    fixture.detectChanges();
    await fixture.whenStable();

    // open first tab in second group
    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[2].click();
    fixture.detectChanges();

    const activeTab = fixture.componentInstance.verticalTabs.find(tab => tab.active);
    fixture.detectChanges();
    await fixture.whenStable();

    let tabContentPane: HTMLElement = activeTab.tabContent.nativeElement;

    expect(mediaQuerySpy).toHaveBeenCalledWith(800);
    expect(tabContentPane.classList.contains('sky-responsive-container-sm')).toBeTruthy();
  });

  it('should scroll back to the top of the content pane when switching tabs', () => {
    let fixture = createTestComponent();
    fixture.detectChanges();

    let el = fixture.nativeElement;
    fixture.componentInstance.showScrollable = true;

    fixture.detectChanges();

    let contentPane = document.querySelector('.sky-vertical-tabset-content');

    contentPane.scrollTop = 200;

    fixture.detectChanges();

    // click second tab in first group
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[1].click();

    fixture.detectChanges();

    expect(contentPane.scrollTop).toBe(0);
  });
});

describe('Vertical tabset component - with ngFor', () => {
  let fixture: ComponentFixture<VerticalTabsetWithNgForTestComponent>;
  let component: VerticalTabsetWithNgForTestComponent;

  beforeEach(() => {
    mockQueryService  = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService}
      ]
    });
    fixture = TestBed.createComponent(VerticalTabsetWithNgForTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dynamically show and hide tabs with structural directives', () => {
    // Baseline: expect test to start with 3 tabs.
    let tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(3);

    let tabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(tabContentElements.length).toBe(3);

    // Remove first tab from array.
    component.tabs.splice(0, 1);
    fixture.detectChanges();

    // Expect tab to be removed from DOM.
    tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(2);

    tabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(tabContentElements.length).toBe(2);

    // Add tab to array.
    component.tabs.push({
      id: '99',
      heading: 'tab 99',
      content: 'Tab 99 content'
    });
    fixture.detectChanges();

    // New tab should be redered in DOM.
    tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(3);

    tabContentElements = fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane');
    expect(tabContentElements.length).toBe(3);
  });

  it('should update active index when the active tab is removed via structural directives', () => {
    // Activate first tab.
    let tabElements = getTabs(fixture);
    expect(tabElements.length).toEqual(3);
    tabElements[0].click();
    fixture.detectChanges();

    // Remove first tab from array.
    component.tabs.splice(0, 1);
    fixture.detectChanges();

    // Next active tab should be selected.
    let visibleTabContent = getVisibleTabContent(fixture);
    expect(visibleTabContent.length).toBe(1);
    let tabContent = visibleTabContent[0];
    expect(tabContent).not.toBeUndefined();
    expect(fixture.componentInstance.activeIndex).toEqual(0);
    expect(tabContent.textContent.trim()).toBe('Tab 2 content');

    // Now, remove last (second) tab from array.
    component.tabs.splice(1, 1);
    fixture.detectChanges();

    // Next active tab should be selected.
    visibleTabContent = getVisibleTabContent(fixture);
    expect(visibleTabContent.length).toBe(1);
    tabContent = visibleTabContent[0];
    expect(tabContent).not.toBeUndefined();
    expect(fixture.componentInstance.activeIndex).toEqual(0);
    expect(tabContent.textContent.trim()).toBe('Tab 2 content');
  });
});

// test tab group with no subtabs
describe('Vertical tabset component - no subtabs', () => {
  let fixture: ComponentFixture<VerticalTabsetEmptyGroupTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ]
    });
    fixture = TestBed.createComponent(VerticalTabsetEmptyGroupTestComponent);
    fixture.detectChanges();
  });

  it('group without tab should load without failing', () => {
    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(0);
  });
});

describe('Vertical tabset component - no groups', () => {
  let fixture: ComponentFixture<VerticalTabsetNoGroupTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ]
    });
    fixture = TestBed.createComponent(VerticalTabsetNoGroupTestComponent);
  });

  it('should load tabs without groups', () => {
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    let allTabs = el.querySelectorAll('sky-vertical-tab');
    expect(allTabs.length).toBe(3);

    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Tab 2 content');
  });

  it('should switch tabs on clicking without groups', () => {
    let el = fixture.nativeElement;

    fixture.detectChanges();

    expect(fixture.componentInstance.currentIndex).toBe(1);

    // open first tab
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    //  check activeChange fires
    expect(fixture.componentInstance.currentIndex).toBe(0);

    let visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Tab 1 content');
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('Vertical tabset no active tabs', () => {
  let fixture: ComponentFixture<VerticalTabsetNoActiveTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ]
    });
    fixture = TestBed.createComponent(VerticalTabsetNoActiveTestComponent);
    fixture.detectChanges();
  });

  it('should not fail when trying to move active content when no tabs are active', () => {
    // move content should not fail
    fixture.componentInstance.tabset.tabService.updateContent();
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
