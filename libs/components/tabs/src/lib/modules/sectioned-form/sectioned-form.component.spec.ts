import { TestBed, async } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { MockSkyMediaQueryService } from '@skyux/core/testing';

import { SkySectionedFormFixturesModule } from './fixtures/sectioned-form-fixtures.module';
import { SkySectionedFormNoActiveFixtureComponent } from './fixtures/sectioned-form-no-active.component.fixture';
import { SkySectionedFormNoSectionsFixtureComponent } from './fixtures/sectioned-form-no-sections.component.fixture';
import { SkySectionedFormFixtureComponent } from './fixtures/sectioned-form.component.fixture';
import { SkySectionedFormComponent } from './sectioned-form.component';

function getVisibleTabs(el: any) {
  return el.querySelectorAll(
    '.sky-sectioned-form-tabs:not(.sky-sectioned-form-tabs-hidden)'
  );
}

function getVisibleContent(el: any) {
  return el.querySelectorAll(
    '.sky-sectioned-form-content:not(.sky-sectioned-form-content-hidden)'
  );
}

function getVisibleTabContent(el: any) {
  return el.querySelectorAll(
    '.sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)'
  );
}

function getActiveSection(el: any) {
  return el.querySelectorAll(
    'sky-sectioned-form-section .sky-vertical-tab-active'
  );
}

describe('Sectioned form component', () => {
  let mockQueryService: MockSkyMediaQueryService;

  beforeEach(() => {
    mockQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      imports: [SkySectionedFormFixturesModule],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService },
      ],
    });
  });

  function createTestComponent() {
    const fixture = TestBed.overrideComponent(SkySectionedFormComponent, {
      add: {
        providers: [
          { provide: SkyMediaQueryService, useValue: mockQueryService },
        ],
      },
    }).createComponent(SkySectionedFormFixtureComponent);
    return fixture;
  }

  it('active tab should be open', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // check correct section tab is active
    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(1);

    const heading = activeSection[0].querySelector(
      '.sky-vertical-tab-heading-value'
    );
    expect(heading.textContent.trim()).toBe('Information 1a');

    const count = activeSection[0].querySelector('.sky-vertical-tab-count');
    expect(count.textContent.trim()).toBe('(2)');

    // check correct section content is displayed
    const content = getVisibleTabContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');
  });

  it('clicking tab should show content', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check order of vertical tab content
    let allTabContentElements = el.querySelectorAll(
      '.sky-vertical-tab-content-pane'
    );
    expect(allTabContentElements.length).toBe(2);
    expect(allTabContentElements[0].textContent.trim()).toBe(
      'information 1 Mark required  Mark invalid'
    );
    expect(allTabContentElements[1].textContent.trim()).toBe('information 2');

    // click first tab
    const firstTab = el.querySelectorAll('.sky-vertical-tab');
    firstTab[0].click();

    fixture.detectChanges();

    // check correct section tab is active
    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(1);

    const heading = activeSection[0].querySelector('.sky-vertical-tab-heading');
    expect(heading.textContent.trim()).toBe('Information 1');

    const count = activeSection[0].querySelector('.sky-vertical-tab-count');
    // tslint:disable-next-line:no-null-keyword
    expect(count).toBe(null);

    // check correct section content is displayed
    const content = getVisibleContent(el);
    expect(content.length).toBe(1);
    const informationContent = content[0].querySelector('.demo-content');
    expect(informationContent.textContent.trim()).toBe('information 1');

    // check order of vertical tab content - order changes when tabs are clicked
    allTabContentElements = el.querySelectorAll(
      '.sky-vertical-tab-content-pane'
    );
    expect(allTabContentElements.length).toBe(2);
    expect(allTabContentElements[0].textContent.trim()).toBe('information 2');
    expect(allTabContentElements[1].textContent.trim()).toBe(
      'information 1 Mark required  Mark invalid'
    );
  });

  it('section should respect required field change', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check section is not required
    let tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);

    const activeTab = tabs[1];
    expect(activeTab.classList.contains('sky-tab-field-required')).toBe(false);

    // mark required
    const checkbox = el.querySelector('#requiredTestCheckbox input');
    checkbox.click();
    fixture.detectChanges();

    // check section is required
    tabs = el.querySelectorAll('sky-vertical-tab');
    const requiredTab = tabs[0];
    expect(requiredTab.classList.contains('sky-tab-field-required')).toBe(true);
  });

  it('section should respect required field change after switching tabs', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // click first tab
    const firstTab = el.querySelectorAll('.sky-vertical-tab');
    firstTab[0].click();

    fixture.detectChanges();

    // check section is not required
    let tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);

    const activeTab = tabs[0];
    expect(activeTab.classList.contains('sky-tab-field-required')).toBe(false);

    // mark required
    const checkbox = el.querySelector('#requiredTestCheckbox input');
    checkbox.click();
    fixture.detectChanges();

    // check section is required
    tabs = el.querySelectorAll('sky-vertical-tab');
    const requiredTab = tabs[0];
    expect(requiredTab.classList.contains('sky-tab-field-required')).toBe(true);
  });

  it('active index should be raised when tab changed', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const tabs = el.querySelectorAll('.sky-vertical-tab');
    tabs[0].click();

    fixture.detectChanges();

    const activeIndexEl = el.querySelector('#activeIndexDiv');
    expect(activeIndexEl.textContent.trim()).toBe('active index = 0');
  });

  it('should have a visible animation state on load in mobile', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    const fixture = createTestComponent();

    fixture.detectChanges();

    expect(
      fixture.componentInstance.sectionedForm.tabService
        .animationContentVisibleState
    ).toBe('shown');
  });

  it('should hide content and show tabs on mobile after calling showtabs function', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check tabs not visible and content visible
    let tabs = getVisibleTabs(el);
    expect(tabs.length).toBe(0);

    let content = getVisibleTabContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');

    fixture.componentInstance.sectionedForm.showTabs();

    fixture.detectChanges();

    // tabs should now be visible and content not visible
    content = getVisibleContent(el);
    expect(content.length).toBe(0);

    tabs = el.querySelectorAll('.sky-vertical-tab');
    expect(tabs.length).toBe(2);
  });

  it('should not use tab aria-associations and roles in mobile view', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    const fixture = createTestComponent();
    const el = fixture.nativeElement;
    fixture.detectChanges();

    const content = getVisibleContent(el);
    for (const pane of content) {
      expect(pane.getAttribute('aria-labelledby')).toBeFalsy();
      expect(pane.getAttribute('role')).toBeFalsy();
    }

    fixture.componentInstance.sectionedForm.showTabs();
    fixture.detectChanges();

    const tabs = el.querySelectorAll('.sky-vertical-tab');
    for (const tab of tabs) {
      expect(tab.getAttribute('aria-controls')).toBeFalsy();
      expect(tab.getAttribute('role')).toBeFalsy();
    }
  });

  it('section should respect invalid field change', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check section is not invalid
    const tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);

    const firstTab = tabs[0];
    expect(firstTab.querySelector('sky-status-indicator')).toBeNull();

    // mark invalid
    const checkbox = el.querySelector('#invalidTestCheckbox input');
    checkbox.click();
    fixture.detectChanges();

    // check section is required
    expect(firstTab.querySelector('sky-status-indicator')).not.toBeNull();
  });

  it('section should have appropriate aria labels', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check section is not invalid
    const tabs = el.querySelectorAll('sky-vertical-tab a');
    expect(tabs.length).toBe(2);

    const inactiveTab = tabs[0];
    const inactiveTabContent = el.querySelector(
      '#' + inactiveTab.getAttribute('aria-controls')
    );
    expect(inactiveTab.getAttribute('aria-selected')).toEqual('false');
    expect(inactiveTab.getAttribute('aria-controls')).toBe(
      inactiveTabContent.id
    );
    expect(inactiveTabContent.getAttribute('aria-labelledby')).toBe(
      inactiveTab.id
    );

    const activeTab = tabs[1];
    const activeTabContent = el.querySelector(
      '#' + activeTab.getAttribute('aria-controls')
    );
    expect(activeTab.getAttribute('aria-selected')).toBe('true');
    expect(activeTab.getAttribute('aria-controls')).toBe(activeTabContent.id);
    expect(activeTabContent.getAttribute('aria-labelledby')).toBe(activeTab.id);
  });

  it('should show content after resizing screen', () => {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // show tabs to hide content
    fixture.componentInstance.sectionedForm.showTabs();
    fixture.detectChanges();

    // resize screen out of mobile
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    fixture.componentInstance.sectionedForm.tabService.updateContent();
    fixture.detectChanges();

    // content should be visible
    let content = getVisibleTabContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');

    // resize back to mobile
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    fixture.componentInstance.sectionedForm.tabService.updateContent();
    fixture.detectChanges();

    // content should be hidden
    content = getVisibleContent(el);
    expect(content.length).toBe(0);

    // resize to widescreen
    mockQueryService.fire(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    fixture.componentInstance.sectionedForm.tabService.updateContent();
    fixture.detectChanges();

    // content should be visible
    content = getVisibleTabContent(el);
    expect(content.length).toBe(1);
    expect(content[0].textContent.trim()).toBe('information 2');
  });

  it('should be accessible', async () => {
    const fixture = createTestComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('maintainSectionContent - tab content remains in same order', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.maintainSectionContent = true;
    const el = fixture.nativeElement;

    fixture.detectChanges();

    // check order of vertical tab content
    let allTabContentElements = el.querySelectorAll(
      '.sky-vertical-tab-content-pane'
    );
    expect(allTabContentElements.length).toBe(2);
    expect(allTabContentElements[0].textContent.trim()).toBe(
      'information 1 Mark required  Mark invalid'
    );
    expect(allTabContentElements[1].textContent.trim()).toBe('information 2');

    // click first tab
    const firstTab = el.querySelectorAll('.sky-vertical-tab');
    firstTab[0].click();

    fixture.detectChanges();

    // check correct section tab is active
    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(1);

    const heading = activeSection[0].querySelector('.sky-vertical-tab-heading');
    expect(heading.textContent.trim()).toBe('Information 1');

    const count = activeSection[0].querySelector('.sky-vertical-tab-count');
    // tslint:disable-next-line:no-null-keyword
    expect(count).toBe(null);

    // check correct section content is displayed
    const content = getVisibleContent(el);
    expect(content.length).toBe(1);
    const informationContent = content[0].querySelector('.demo-content');
    expect(informationContent.textContent.trim()).toBe('information 1');

    // check order of vertical tab content - order should not change
    allTabContentElements = el.querySelectorAll(
      '.sky-vertical-tab-content-pane'
    );
    expect(allTabContentElements.length).toBe(2);
    expect(allTabContentElements[0].textContent.trim()).toBe(
      'information 1 Mark required  Mark invalid'
    );
    expect(allTabContentElements[1].textContent.trim()).toBe('information 2');
  });
});

describe('Sectioned form component - no sections', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkySectionedFormFixturesModule],
    });
  });

  function createTestComponent() {
    const fixture = TestBed.createComponent(
      SkySectionedFormNoSectionsFixtureComponent
    );
    return fixture;
  }

  it('should not fail to load when no sections exist', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const allTabs = el.querySelectorAll('.sky-sectioned-form-tabs');
    expect(allTabs.length).toBe(1);
    expect(allTabs[0].textContent.trim()).toBe('');
  });
});

describe('Sectioned form component - no active sections', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkySectionedFormFixturesModule],
    });
  });

  function createTestComponent() {
    const fixture = TestBed.createComponent(
      SkySectionedFormNoActiveFixtureComponent
    );
    return fixture;
  }

  it('should not fail to load when no active sections exist', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const activeSection = getActiveSection(el);
    expect(activeSection.length).toBe(0);

    const tabs = el.querySelectorAll('sky-vertical-tab');
    expect(tabs.length).toBe(2);
  });

  it('should be accessible', async () => {
    const fixture = createTestComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
