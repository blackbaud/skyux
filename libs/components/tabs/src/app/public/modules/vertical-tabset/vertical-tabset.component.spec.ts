import {
  TestBed, async
} from '@angular/core/testing';

import {
  SkyVerticalTabsetComponent
} from '../vertical-tabset/vertical-tabset.component';
import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '@skyux/core/modules/media-query';

import {
  SkyVerticalTabsFixturesModule
} from './fixtures/vertical-tabs-fixtures.module';
import {
  VerticalTabsetTestComponent
} from './fixtures/vertical-tabset.component.fixture';
import {
  VerticalTabsetNoActiveTestComponent
} from './fixtures/vertical-tabset-no-active.component.fixture';
import {
  VerticalTabsetEmptyGroupTestComponent
} from './fixtures/vertical-tabset-empty-group.component';
import {
  VerticalTabsetNoGroupTestComponent
} from './fixtures/vertical-tabset-no-group.component.fixture';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing/mock-media-query.service';

import {
  expect
} from '@skyux-sdk/testing';

let mockQueryService = new MockSkyMediaQueryService();

function getVisibleVerticalTabs(el: any) {
  return el.querySelectorAll('.sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)');
}

describe('Vertical tabset component', () => {
  beforeEach(() => {
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    const visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 2 Tab 2 content');

    // check open group
    const openGroup = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroup.length).toBe(1);
    expect(openGroup[0].textContent.trim()).toBe('Group 2');
  });

  it('should pass through aria inputs, id, and set role', () => {
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check show tabs button is not visible
    const showTabsButton = el.querySelectorAll('.sky-vertical-tabset-show-tabs-btn');
    expect(showTabsButton.length).toBe(0);
  });

  it('mobile button should be visible on small screen', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check show tabs button is visible
    const showTabsButton = el.querySelectorAll('.sky-vertical-tabset-show-tabs-btn');
    expect(showTabsButton.length).toBe(1);
    expect(showTabsButton[0].textContent.trim()).toBe('Tab list');

    // check content is visible
    const visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check tabs are not visible
    const tabs = el.querySelectorAll('.sky-vertical-tabset-group-container');
    expect(tabs.length).toBe(0);
  });

  it('show tabs button should show tabs on mobile', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check tabs are not visible
    const tabs = el.querySelectorAll('.sky-vertical-tabset-group-container');
    expect(tabs.length).toBe(0);

    // check content is visible
    let visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // click show tabs
    const showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();

    fixture.detectChanges();

    // check tabs are visible
    const tabsUpdated = el.querySelectorAll('.sky-vertical-tabset-group-container');
    expect(tabsUpdated.length).toBe(1);

    // check content is not visible
    visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(0);
  });

  it('clicking a tab in mobile should show content and hides tabs', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
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
    const tabs = el.querySelectorAll('.sky-vertical-tabset-group-container');
    expect(tabs.length).toBe(0);

    // check content is visible
    const visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 2 content');
  });

  it('tabs should not have tab aria associations and roles in mobile view', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // simulate screensize change switching to mobile
    mockQueryService.current = SkyMediaBreakpoints.xs;
    fixture.componentInstance.tabset.tabService.updateContent();
    fixture.detectChanges();

    // check tabs are not visible
    const tabs = el.querySelectorAll('.sky-vertical-tabset-group-container');
    expect(tabs.length).toBe(0);

    // check content is visible
    const visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check show tabs button is visible
    const showTabsButton = el.querySelector('.sky-vertical-tabset-show-tabs-btn');
    showTabsButton.click();
  });

  it('should show tabs and hide tab list button when switching from mobile to widescreen', () => {
    mockQueryService.current = SkyMediaBreakpoints.xs;
    let fixture = createTestComponent();
    let el = fixture.nativeElement;

    fixture.detectChanges();

    // simulate screensize change switching to widescreen
    mockQueryService.current = SkyMediaBreakpoints.lg;
    fixture.componentInstance.tabset.tabService.updateContent();
    fixture.detectChanges();

    // check tabs are visible
    const tabs = el.querySelectorAll('.sky-vertical-tabset-group-container');
    expect(tabs.length).toBe(1);

    // check content is visible
    const visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 1 content');

    // check show tabs button is not visible
    const showTabsButton = el.querySelectorAll('.sky-vertical-tabset-show-tabs-btn');
    expect(showTabsButton.length).toBe(0);
  });

  it('should deactivate active tab when another tab is clicked', () => {
    mockQueryService.current = SkyMediaBreakpoints.lg;
    let fixture = createTestComponent();
    fixture.detectChanges();
    let el = fixture.nativeElement;

    // click first tab in first group
    let tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    // check open tab
    let visibleTabs = getVisibleVerticalTabs(el);
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
    visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 1 Tab 2 content');

    // check open group
    openGroups = el.querySelectorAll('.sky-vertical-tabset-group-header-sub-open');
    expect(openGroups.length).toBe(1);
    expect(openGroups[0].textContent.trim()).toBe('Group 1');
  });

  it('should display tab header count when defined', () => {
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    mockQueryService.current = SkyMediaBreakpoints.lg;
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
    let visibleTabs = getVisibleVerticalTabs(el);
    expect(visibleTabs.length).toBe(1);
    expect(visibleTabs[0].textContent.trim()).toBe('Group 2 Tab 1 content');

    // try clicking disabled third tab in second group
    tabs[4].click();

    fixture.detectChanges();

    // check content of second tab still displayed
    visibleTabs = getVisibleVerticalTabs(el);
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
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    const visibleTabs = getVisibleVerticalTabs(el);
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

    const visibleTabs = getVisibleVerticalTabs(el);
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

    let visibleTabs = getVisibleVerticalTabs(el);
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
