import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyVerticalTabsetComponent
} from '../vertical-tabset/vertical-tabset.component';

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

// #region helpers
let mockQueryService: MockSkyMediaQueryService;

function getVisibleTabContent(fixture: ComponentFixture<any>): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll('.sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)');
}

function getTabsContainer(fixture: ComponentFixture<any>): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll('.sky-vertical-tabset-group-container');
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
        { provide: SkyMediaQueryService, useValue: mockQueryService}
      ]
    });
  });

  function createTestComponent() {
    return TestBed.overrideComponent(SkyVerticalTabsetComponent, {
      add: {
        providers: [
          { provide: SkyMediaQueryService, useValue: mockQueryService }
        ]
      }
    })
    .createComponent(VerticalTabsetTestComponent);
  }

  it('first tab in open group should be selected', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check open tab content
    const content = el.querySelector('.sky-vertical-tabset-content');
    expect(content.textContent.trim()).toBe('Group 1 Tab 1 content');

    // check open group
    const openGroup = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroup.length).toBe(1);
    expect(openGroup[0].textContent.trim()).toBe('Group 1');
  });

  it('open second tab in second group', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
    fixture.detectChanges();
    let el = fixture.nativeElement;

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
  });

  it('should pass through aria inputs, id, and set role', () => {
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    let fixture = createTestComponent();
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
    visibleTabs = getVisibleTabContent(fixture);
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

  it('should be accessible', async(() => {
    let fixture = createTestComponent();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
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

    // Remove first tab from array.
    component.tabs.splice(0, 1);
    fixture.detectChanges();

    // Expect tab to be removed from DOM.
    tabElements = getTabs(fixture);
    expect(tabElements.length).toBe(2);

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
  });

  it('should update active index when the active tab is removed via structural directives', () => {
    // Activate first tab.
    let tabElements = getTabs(fixture);
    tabElements[0].click();
    fixture.detectChanges();

    // Remove first tab from array.
    component.tabs.splice(0, 1);
    fixture.detectChanges();

    // Next active tab should be selected.
    const tabContent = getVisibleTabContent(fixture)[0];
    expect(fixture.componentInstance.activeIndex).toEqual(1);
    expect(tabContent.textContent.trim()).toBe('Tab 2 content');
  });
});

// test tab group with no subtabs
describe('Vertical tabset component - no subtabs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ]
    });
  });

  it('group without tab should load without failing', () => {
    let fixture = TestBed.createComponent(VerticalTabsetEmptyGroupTestComponent);

    fixture.detectChanges();

    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(0);
  });
});

describe('Vertical tabset component - no groups', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ]
    });
  });

  it('should load tabs without groups', () => {
    let fixture = TestBed.createComponent(VerticalTabsetNoGroupTestComponent);
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    let allTabs = el.querySelectorAll('sky-vertical-tab');
    expect(allTabs.length).toBe(3);

    const visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Tab 2 content');
  });

  it('should switch tabs on clicking without groups', () => {
    let fixture = TestBed.createComponent(VerticalTabsetNoGroupTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();

    let indexChangeEl = el.querySelector('.vertical-tabset-test-indexchange');
    expect(indexChangeEl.textContent.trim()).toBe('current index = 1');

    // open first tab
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    //  check activeChange fires
    expect(indexChangeEl.textContent.trim()).toBe('current index = 0');

    let visibleTabs = getVisibleTabContent(fixture);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Tab 1 content');
  });

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(VerticalTabsetNoGroupTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});

describe('Vertical tabset no active tabs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyVerticalTabsFixturesModule
      ]
    });
  });

  it('should not fail when trying to move active content when no tabs are active', () => {
    let fixture = TestBed.createComponent(VerticalTabsetNoActiveTestComponent);

    fixture.detectChanges();

    // move content should not fail
    fixture.componentInstance.tabset.tabService.updateContent();
  });

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(VerticalTabsetNoActiveTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
