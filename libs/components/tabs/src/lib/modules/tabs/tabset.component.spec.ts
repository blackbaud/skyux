import { ViewportRuler } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService, SkyLayoutHostService } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject, Subject } from 'rxjs';

import { SkyTabsFixturesModule } from './fixtures/tabs-fixtures.module';
import { TabsetActiveTwoWayBindingTestComponent } from './fixtures/tabset-active-two-way.component.fixture';
import { TabsetActiveTestComponent } from './fixtures/tabset-active.component.fixture';
import { MockTabsetAdapterService } from './fixtures/tabset-adapter.service.mock';
import { TabsetLoopTestComponent } from './fixtures/tabset-loop.component.fixture';
import { TabsetOtherPageComponent } from './fixtures/tabset-other-page.component.fixture';
import { SkyTabsetPermalinksFixtureComponent } from './fixtures/tabset-permalinks.component.fixture';
import { SkyWizardTestFormComponent } from './fixtures/tabset-wizard.component.fixture';
import { TabsetTestComponent } from './fixtures/tabset.component.fixture';
import { SkyTabLayoutType } from './tab-layout-type';
import { SkyTabsetAdapterService } from './tabset-adapter.service';
import { SkyTabsetPermalinkService } from './tabset-permalink.service';
import { SkyTabsetComponent } from './tabset.component';
import { SkyTabsetService } from './tabset.service';

// #region helpers
function getTabs(fixture: ComponentFixture<unknown>): NodeListOf<HTMLElement> {
  return fixture.nativeElement.querySelectorAll('.sky-tab');
}

function getTabset(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-tabset');
}
// #endregion

describe('Tabset component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  let viewportRulerChange: Subject<Event>;

  beforeEach(() => {
    viewportRulerChange = new Subject();
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
      imports: [SkyTabsFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        provideRouter([
          {
            path: 'example-path',
            children: [
              {
                path: 'example-child-path',
                children: [
                  {
                    path: '',
                    component: SkyTabsetPermalinksFixtureComponent,
                  },
                ],
              },
            ],
          },
          {
            path: 'other-page',
            component: TabsetOtherPageComponent,
          },
        ]),
        provideLocationMocks(),
      ],
    });

    spyOn(ViewportRuler.prototype, 'change').and.returnValue(
      viewportRulerChange,
    );
  });

  afterEach(() => {
    viewportRulerChange.complete();
  });

  function validateTabSelected(
    el: Element,
    tabIndex: number,
    content?: string,
  ): void {
    let selectedCls: string;
    let buttonEls: NodeListOf<Element>;
    const inDropDownMode = el.querySelector('.sky-tabset-mode-dropdown');

    if (inDropDownMode) {
      selectedCls = 'sky-tab-dropdown-item-selected';
      buttonEls = el.querySelectorAll('.sky-tab-dropdown-item');
    } else {
      selectedCls = 'sky-btn-tab-selected';
      buttonEls = el.querySelectorAll('.sky-btn-tab');
    }

    const contentEls = el.querySelectorAll('.sky-tab');

    for (let i = 0, n = buttonEls.length; i < n; i++) {
      const buttonEl = buttonEls[i];
      const panelDisplay = getComputedStyle(contentEls[i]).display;
      let expectedHasClass: boolean;
      let expectedDisplay: string;

      if (i === tabIndex) {
        expectedHasClass = true;
        expectedDisplay = 'block';
      } else {
        expectedHasClass = false;
        expectedDisplay = 'none';
      }

      expect(buttonEl.classList.contains(selectedCls)).toBe(
        expectedHasClass,
        `The tab button at array index ${tabIndex} was expected to have the CSS class ${selectedCls}.`,
      );
      expect(panelDisplay).toBe(
        expectedDisplay,
        `The tab panel at array index ${tabIndex} was expected to have the CSS display of ${expectedDisplay}.`,
      );

      if (!inDropDownMode) {
        expect(buttonEl.getAttribute('aria-selected')).toBe(
          expectedHasClass.toString(),
          `Expected tab button ${buttonEl.innerHTML} to set "aria-selected".`,
        );
      }
    }
    if (content) {
      expect(contentEls[tabIndex]).toHaveText(content);
    }
  }

  function validateElFocused(el: Element): void {
    expect(el.contains(document.activeElement)).toBeTrue();
  }

  it('should not attempt to remove the query param if permalinkId is not set', () => {
    const location = TestBed.inject(Location);

    const fixture = TestBed.createComponent(TabsetTestComponent);

    fixture.detectChanges();

    spyOn(location, 'path').and.returnValue('');

    const goSpy = spyOn(location, 'go');

    fixture.destroy();

    expect(goSpy).not.toHaveBeenCalled();
  });

  it('should set the tabs style correctly', () => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    fixture.detectChanges();
    const tabset = getTabset(fixture);

    expect(tabset.classList).toContain('sky-tabset-style-tabs');

    cmp.tabStyle = undefined;
    fixture.detectChanges();
    expect(tabset.classList).toContain('sky-tabset-style-tabs');

    cmp.tabStyle = 'wizard';
    fixture.detectChanges();
    expect(tabset.classList).toContain('sky-tabset-style-wizard');
  });

  describe('tabs with active attribute', () => {
    it('should change the active tab when tab active is set to true', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetTestComponent);
      const cmp: TabsetTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 0);
      cmp.activeTab = 1;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 1);
      cmp.activeTab = 2;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 2);
    }));

    it('should change the active tab when the tab is clicked manually', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetTestComponent);
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      el.querySelectorAll('.sky-btn-tab')[1].click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      validateTabSelected(el, 1);
    }));

    it('should not change the active tab when a disabled tab is clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetTestComponent);
      const el = fixture.nativeElement;

      fixture.componentInstance.tab2Disabled = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tab = el.querySelectorAll('.sky-btn-tab')[1];
      const closeBtn = el.querySelector('.sky-btn-tab-close');
      expect(closeBtn).toHaveCssClass('sky-btn-tab-close-disabled');

      tab.click();
      fixture.detectChanges();
      validateTabSelected(el, 0);
    }));

    it('should initialize the tabs properly when active is set to true', () => {
      const fixture = TestBed.createComponent(TabsetTestComponent);
      const cmp: TabsetTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.activeTab = 1;

      fixture.detectChanges();

      validateTabSelected(el, 1);
    });
  });

  it('should notify the consumer when the add tab button is clicked', () => {
    const template = `<sky-tabset (newTab)="newTab()"></sky-tabset>`;

    const fixture = TestBed.overrideComponent(TabsetTestComponent, {
      set: {
        template: template,
      },
    }).createComponent(TabsetTestComponent);

    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const newTabSpy = spyOn(cmp, 'newTab');

    el.querySelector('.sky-tabset-btn-new').click();

    expect(newTabSpy).toHaveBeenCalled();
  });

  it('should notify the consumer when the new tab button is clicked', () => {
    const template = `<sky-tabset (openTab)="openTab()"></sky-tabset>`;

    const fixture = TestBed.overrideComponent(TabsetTestComponent, {
      set: {
        template: template,
      },
    }).createComponent(TabsetTestComponent);

    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const openTabSpy = spyOn(cmp, 'openTab');

    el.querySelector('.sky-tabset-btn-open').click();

    expect(openTabSpy).toHaveBeenCalled();
  });

  it("should notify the consumer when a tab's close button is clicked", fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    const closeTabSpy = spyOn(cmp, 'closeTab2');

    el.querySelector('.sky-btn-tab-close').click();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(closeTabSpy).toHaveBeenCalled();
  }));

  it("should notify the consumer when a tab's tabIndex changes", fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetLoopTestComponent);
    const spy = spyOn(
      fixture.componentInstance,
      'onTabIndexesChange',
    ).and.callThrough();

    fixture.componentInstance.activeIndex = 0;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    validateTabSelected(fixture.elementRef.nativeElement, 0);

    fixture.componentInstance.tabArray[1].tabIndex = 'foobar';

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith({
      tabs: [
        { tabHeading: 'Tab 1', tabIndex: 0 },
        { tabHeading: 'Tab 2', tabIndex: 'foobar' },
      ],
    });
    expect(spy).toHaveBeenCalledTimes(1);

    // Add a new tab.
    fixture.componentInstance.addTabAndActivate();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith({
      tabs: [
        { tabHeading: 'Tab 1', tabIndex: 0 },
        { tabHeading: 'Tab 2', tabIndex: 'foobar' },
        { tabHeading: 'Tab 3', tabIndex: 2 },
      ],
    });
    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should create unique tab indexes automatically', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetLoopTestComponent);
    const spy = spyOn(
      fixture.componentInstance,
      'onTabIndexesChange',
    ).and.callThrough();

    fixture.componentInstance.tabArray = [
      {
        tabHeading: 'Tab 1',
        tabContent: 'Tab 1 content',
      },
      {
        tabHeading: 'Tab 2',
        tabContent: 'Tab 2 content',
      },
    ];

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    // Delete a tab.
    fixture.componentInstance.tabArray.splice(1, 1);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith({
      tabs: [{ tabHeading: 'Tab 1', tabIndex: 0 }],
    });
    spy.calls.reset();

    // Add a new one.
    fixture.componentInstance.tabArray.push({
      tabHeading: 'New tab',
      tabContent: 'New tab content',
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith({
      tabs: [
        { tabHeading: 'Tab 1', tabIndex: 0 },
        { tabHeading: 'New tab', tabIndex: 2 },
      ],
    });
  }));

  it('should select the next tab when the active tab is closed', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;
    fixture.detectChanges();
    tick();

    cmp.activeTab = 1;
    fixture.detectChanges();
    tick();

    cmp.tab2Available = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
    validateTabSelected(el, 1);
  }));

  it('should select the previous tab when the last tab is closed and the last tab was active', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;
    fixture.detectChanges();
    tick();

    cmp.activeTab = 2;
    fixture.detectChanges();
    tick();

    cmp.tab3Available = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
    validateTabSelected(el, 1);
  }));

  // This test was added due to a real life error when `skyAuthIf` was causing things to load
  // after initialization of the tabset but before the `ngAfterViewInit`'s `setTimeout`.
  it('should handle a quick addition of a tab on initialization', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    cmp.tab3Available = false;
    fixture.detectChanges();

    cmp.tab3Available = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    cmp.tab3Available = false;
    expect(() => {
      fixture.detectChanges();
    }).not.toThrowError();
    tick();
  }));

  it('should maintain the currently active tab when a non-active tab is closed', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;
    cmp.tab3Content = 'tab 3 content';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    cmp.activeTab = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    validateTabSelected(el, 2, 'tab 3 content');

    cmp.tab2Available = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
    validateTabSelected(el, 1, 'tab 3 content');
  }));

  it('should display count in tab when tabHeaderCount is defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;

    const count = '99';
    cmp.tab3HeaderCount = count;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const tabEl = el
      .querySelectorAll('.sky-btn-tab')[2]
      .querySelector('.sky-tab-header-count');

    expect(tabEl.innerText.trim()).toBe(count.toString());
  }));

  it('tabHeaderCount span element should not exist when tabHeaderCount is undefined', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;

    cmp.tab3HeaderCount = undefined;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const tabEl = el
      .querySelectorAll('.sky-btn-tab')[2]
      .querySelector('.sky-tab-header-count');

    expect(!tabEl);
  }));

  it('should display zero in tab when tabHeaderCount is set to zero', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const cmp: TabsetTestComponent = fixture.componentInstance;
    const el = fixture.nativeElement;

    const count = '0';
    cmp.tab3HeaderCount = count;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const tabEl = el
      .querySelectorAll('.sky-btn-tab')[2]
      .querySelector('.sky-tab-header-count');

    expect(tabEl.innerText.trim()).toBe(count.toString());
  }));

  it('should add no buttons if add and open are not defined', () => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    const el = fixture.nativeElement;

    fixture.detectChanges();

    expect(el.querySelector('.sky-tabset-btn-new')).toBeNull();
    expect(el.querySelector('.sky-tabset-btn-open')).toBeNull();
  });

  it('should collapse into a dropdown when the width of the tabs is greater than its container', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);

    function fireResizeEvent(): void {
      SkyAppTestUtility.fireDomEvent(window, 'resize');
      viewportRulerChange.next(new Event('resize'));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }

    const el = fixture.nativeElement;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    el.style.width =
      el.querySelector('.sky-tabset-tabs').offsetWidth - 1 + 'px';

    fireResizeEvent();

    let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

    expect(tabEl).not.toBeNull();

    el.style.width = 'auto';

    fireResizeEvent();

    tabEl = el.querySelector('.sky-dropdown-button-type-tab');

    expect(tabEl).toBeNull();
  }));

  it('should collapse into a dropdown on initialization', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    fixture.componentInstance.tabMaxWidth = 20;

    const el = fixture.nativeElement;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    const tabEl = el.querySelector('.sky-dropdown-button-type-tab');

    expect(tabEl).not.toBeNull();
  }));

  it('should be accessible', async () => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('when collapsed', () => {
    let fixture: ComponentFixture<TabsetTestComponent>;
    let mockAdapterService: MockTabsetAdapterService;

    beforeEach(() => {
      mockAdapterService = new MockTabsetAdapterService();
      mockAdapterService.disableDetectOverflow = true;

      fixture = TestBed.overrideComponent(SkyTabsetComponent, {
        set: {
          providers: [
            SkyTabsetService,
            {
              provide: SkyTabsetAdapterService,
              useValue: mockAdapterService,
            },
            SkyTabsetPermalinkService,
          ],
        },
      }).createComponent(TabsetTestComponent);
    });

    it('should display the selected tab in the collapsed tab dropdown button', fakeAsync(() => {
      const el = fixture.nativeElement;
      const cmp: TabsetTestComponent = fixture.componentInstance;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(true);

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      expect(tabEl.innerText.trim()).toBe('Tab 1');

      cmp.activeTab = 2;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(tabEl.innerText.trim()).toBe('Tab 3');
    }));

    it('should allow another tab to be selected from the dropdown', fakeAsync(() => {
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(true);

      fixture.detectChanges();
      tick();

      const tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      tabEl.click();
      fixture.detectChanges();
      tick();

      const dropdownTabButtons = document.querySelectorAll(
        '.sky-tab-dropdown-item .sky-btn-tab',
      );
      expect(dropdownTabButtons[1]).toHaveText('Tab 2');

      (dropdownTabButtons[1] as HTMLElement).click();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 1);
    }));

    it('should allow another not allow tab to be selected from the dropdown when disabled', fakeAsync(() => {
      const el = fixture.nativeElement;

      fixture.componentInstance.tab2Disabled = true;

      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(true);

      fixture.detectChanges();
      tick();

      const tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      tabEl.click();
      fixture.detectChanges();
      tick();

      const dropdownTabButtons = document.querySelectorAll(
        '.sky-tab-dropdown-item .sky-btn-tab',
      );

      (dropdownTabButtons[0] as HTMLElement).click();
      fixture.detectChanges();
      tick();

      tabEl.click();
      fixture.detectChanges();
      tick();

      expect(dropdownTabButtons[1]).toHaveText('Tab 2');
      expect(dropdownTabButtons[1]).toHaveCssClass('sky-btn-tab-disabled');

      (dropdownTabButtons[1] as HTMLElement).click();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 0);
    }));

    it("should notify the consumer when a tab's close button is clicked", fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const el = fixture.nativeElement;

      const closeSpy = spyOn(
        fixture.componentInstance,
        'closeTab2',
      ).and.callThrough();

      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(true);

      fixture.detectChanges();
      tick();

      const tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      tabEl.click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      el.querySelectorAll('.sky-btn-tab-close')[0].click();

      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(false);

      fixture.detectChanges();
      tick();

      expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
      expect(closeSpy).toHaveBeenCalled();
    }));

    it("should notify the consumer when a dropdown tab's close button is clicked", fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const el = fixture.nativeElement;

      const closeSpy = spyOn(
        fixture.componentInstance,
        'closeTab2',
      ).and.callThrough();

      if (fixture.componentInstance.tabsetComponent) {
        fixture.componentInstance.tabsetComponent.tabDisplayMode = 'dropdown';
      }
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const tabEl: HTMLElement | null = document.querySelector(
        '.sky-dropdown-button',
      );
      tabEl?.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Verify number of tabs before closing one.
      expect(el.querySelectorAll('.sky-btn-tab').length).toBe(3);

      const closeButton = document.querySelectorAll(
        '.sky-dropdown-item .sky-btn-tab-close',
      )[0] as HTMLElement;

      closeButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
      expect(closeSpy).toHaveBeenCalled();
    }));

    it('should be accessible', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('active state on tabset', () => {
    it('should initialize active state based on active', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const el = fixture.nativeElement;

      // Set to something other than first tab.
      fixture.componentInstance.activeIndex = 1;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 1);
    }));

    it('should activate the first tab if active is set to invalid index', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const el = fixture.nativeElement;

      fixture.componentInstance.activeIndex = 'invalid';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 0);
    }));

    it('should initialize active state based on string tabIndex values', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const el = fixture.nativeElement;

      fixture.componentInstance.activeIndex = 'something';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 2);
    }));

    it('should listen for changes in active state', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const cmp: TabsetActiveTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      cmp.activeIndex = 1;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 1);

      cmp.activeIndex = 'something';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 2);
    }));

    it('should emit an event on tab change', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const cmp: TabsetActiveTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      el.querySelectorAll('.sky-btn-tab')[2].click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      expect(cmp.activeIndex).toBe('something');
      validateTabSelected(el, 2);

      el.querySelectorAll('.sky-btn-tab')[0].click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      expect(cmp.activeIndex).toBe(0);
      validateTabSelected(el, 0);
    }));

    it('handles removing and then changing tabs', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const cmp: TabsetActiveTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;
      cmp.tab1Content = 'tab 1 content';
      cmp.tab3Content = 'tab 3 content';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      el.querySelectorAll('.sky-btn-tab')[1].click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      cmp.tab2Available = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 1, 'tab 3 content');

      el.querySelectorAll('.sky-btn-tab')[0].click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      expect(cmp.activeIndex).toBe(0);
      validateTabSelected(el, 0, 'tab 1 content');
    }));

    it('should handle activating a tab immediately after being created in an array of tabs', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetLoopTestComponent);
      fixture.componentInstance.activeIndex = 0;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.elementRef.nativeElement, 0);

      // Set the active index to the tab that is about to be created.
      fixture.componentInstance.addTabAndActivate();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.elementRef.nativeElement, 2);
    }));

    it('should handle active index when entire tab array is rebuilt', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetLoopTestComponent);
      fixture.componentInstance.activeIndex = 0;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.elementRef.nativeElement, 0);

      // Regenerate the tab array.
      fixture.componentInstance.tabArray =
        fixture.componentInstance.createTabArray();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.elementRef.nativeElement, 0);
    }));

    it('should handle an empty tabset', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetLoopTestComponent);
      fixture.componentInstance.activeIndex = undefined;
      fixture.componentInstance.tabArray = [];

      expect(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
      }).not.toThrowError();

      // Set the active index to an invalid value;
      fixture.componentInstance.activeIndex = 999;

      expect(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
      }).not.toThrowError();
    }));

    it('handles initialized tabs', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      const cmp: TabsetActiveTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;
      cmp.activeIndex = 1;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 1);
    }));

    it('should handle two-way binding on `active` input', fakeAsync(() => {
      const fixture = TestBed.createComponent(
        TabsetActiveTwoWayBindingTestComponent,
      );
      const component = fixture.componentInstance;
      const activeSpy = spyOn(component, 'onActiveChange').and.callThrough();

      component.activeTab = '1';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 1);
      expect(activeSpy).toHaveBeenCalledWith('1');
      expect(activeSpy).toHaveBeenCalledTimes(1);

      component.activeTab = '0';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 0);

      expect(activeSpy).toHaveBeenCalledWith('0');
      expect(activeSpy).toHaveBeenCalledTimes(2);
    }));

    it('should handle removing all tabs after init', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 0);

      fixture.componentInstance.tab1Available = false;
      fixture.componentInstance.tab2Available = false;
      fixture.componentInstance.tab3Available = false;
      fixture.componentInstance.tab4Available = false;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const tabs = getTabs(fixture);
      expect(tabs.length).toEqual(0);
    }));

    it('should set active index after tabset is initialized without tabs and active index', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);

      // Remove all tabs on init.
      fixture.componentInstance.tab1Available = false;
      fixture.componentInstance.tab2Available = false;
      fixture.componentInstance.tab3Available = false;
      fixture.componentInstance.tab4Available = false;
      fixture.componentInstance.activeIndex = 0;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Create a new tab and unset the active index.
      fixture.componentInstance.tab1Available = true;
      fixture.componentInstance.activeIndex = undefined;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 0);
    }));

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(TabsetActiveTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('general accessibility', () => {
    let debugElement: DebugElement;
    let fixture: ComponentFixture<TabsetTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyTabsFixturesModule],
      });
      fixture = TestBed.createComponent(TabsetTestComponent);
      debugElement = fixture.debugElement;
    });

    it('should apply proper role attributes', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const tabSet = getTabset(fixture);

      // Tabset should have role="tablist".
      expect(tabSet.getAttribute('role')).toEqual('tablist');

      const tabs = getTabs(fixture);
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs.item(i);
        const tabId = tab.getAttribute('id');
        const tabButton = document.getElementById(`${tabId}-nav-btn`);

        // Each tab should have role="tabpanel".
        expect(tab.getAttribute('role')).toBe('tabpanel');

        // Each tab button have role="tab".
        expect(tabButton?.getAttribute('role')).toBe('tab');
      }
    }));

    it('should apply tablist role and aria-label', () => {
      const myAriaLabel = 'my aria label';
      fixture.componentInstance.ariaLabel = myAriaLabel;
      fixture.detectChanges();

      const tabSet = getTabset(fixture);

      expect(tabSet.getAttribute('aria-label')).toEqual(myAriaLabel);
    });

    it('should apply tablist role and aria-labelledby', () => {
      const myAriaLabelledById = 'foo';
      fixture.componentInstance.ariaLabelledBy = myAriaLabelledById;
      fixture.detectChanges();

      const tabSet = getTabset(fixture);

      expect(tabSet.getAttribute('aria-labelledby')).toEqual(
        myAriaLabelledById,
      );
    });

    it('should have aria-controls and aria-labelledby references between tabs and panels', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const tabs = getTabs(fixture);
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs.item(i);
        const tabId = tab.getAttribute('id');
        const tabButton = document.getElementById(`${tabId}-nav-btn`);

        expect(tab.getAttribute('aria-labelledby')).toBe(
          tabButton?.getAttribute('id') ?? null,
        );
        expect(tabButton?.getAttribute('aria-controls')).toBe(tabId);
      }
    }));

    it('should switch aria-controls and aria-labelledby references between tabs and dropdown buttons', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      /// Switch to mobile display
      if (fixture.componentInstance.tabsetComponent) {
        fixture.componentInstance.tabsetComponent.tabDisplayMode = 'dropdown';
      }
      fixture.detectChanges();

      const button = document.querySelector(
        '.sky-dropdown-button',
      ) as HTMLElement;
      button.click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const tabs = getTabs(fixture);
      for (let i = 0; i < tabs.length; i++) {
        const tab: HTMLElement = tabs.item(i);
        const tabId = tab.getAttribute('id');
        const tabButton = document.getElementById(`${tabId}-nav-btn`);

        expect(tab.getAttribute('aria-labelledby')).toBe(
          tabButton?.getAttribute('id') ?? null,
        );
        expect(tabButton?.getAttribute('aria-controls')).toBe(tabId);
      }
    }));

    it('should have tabindex of 0 when active', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const butEl = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
        .nativeElement;
      expect(butEl.getAttribute('tabindex')).toBe('0');
    }));

    it('should have tabindex of -1 when not active', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const butEl = debugElement.queryAll(By.css('.sky-btn-tab'))[1]
        .nativeElement;
      expect(butEl.getAttribute('tabindex')).toBe('-1');
      expect(butEl.getAttribute('aria-disabled')).toBe('false');
    }));

    it('should have tabindex of -1 and aria-disabled when disabled', fakeAsync(() => {
      fixture.componentInstance.tab2Available = true;
      fixture.componentInstance.tab2Disabled = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const butEl = debugElement.queryAll(By.css('.sky-btn-tab'))[1]
        .nativeElement;
      expect(butEl.getAttribute('tabindex')).toBe('-1');
      expect(butEl.getAttribute('aria-disabled')).toBe('true');
    }));

    describe('keyboard navigation', () => {
      it('should emit a click event on enter press', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        let el = debugElement.queryAll(By.css('.sky-btn-tab'))[1];

        SkyAppTestUtility.fireDomEvent(el.nativeElement, 'keydown', {
          keyboardEventInit: {
            key: 'enter',
          },
        });
        fixture.detectChanges();
        tick();

        validateTabSelected(fixture.nativeElement, 1);

        el = debugElement.queryAll(By.css('.sky-btn-tab'))[2];
        SkyAppTestUtility.fireDomEvent(el.nativeElement, 'keydown', {
          keyboardEventInit: {
            key: 'enter',
          },
        });
        fixture.detectChanges();
        tick();

        validateTabSelected(fixture.nativeElement, 2);
      }));

      it('should emit a click event on spacebar press', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        let el = debugElement.queryAll(By.css('.sky-btn-tab'))[1];

        SkyAppTestUtility.fireDomEvent(el.nativeElement, 'keydown', {
          keyboardEventInit: {
            key: ' ',
          },
        });
        fixture.detectChanges();
        tick();

        validateTabSelected(fixture.nativeElement, 1);

        el = debugElement.queryAll(By.css('.sky-btn-tab'))[2];
        SkyAppTestUtility.fireDomEvent(el.nativeElement, 'keydown', {
          keyboardEventInit: {
            key: ' ',
          },
        });
        fixture.detectChanges();
        tick();

        validateTabSelected(fixture.nativeElement, 2);
      }));

      it('should navigate to the next tab when the right arrow key is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn1, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowRight',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn2 = debugElement.queryAll(By.css('.sky-btn-tab'))[1]
          .nativeElement;
        validateElFocused(tabBtn2);
      }));

      it('should navigate to the next tab and skip the disabled one when the right arrow key is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        fixture.componentInstance.tab2Disabled = true;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn1, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowLeft',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn3 = debugElement.queryAll(By.css('.sky-btn-tab'))[2]
          .nativeElement;
        validateElFocused(tabBtn3);
      }));

      it('should navigate to the first tab when the right arrow key is pressed on the last tab', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        if (fixture.componentInstance.tabsetComponent) {
          fixture.componentInstance.tabsetComponent.active = '3';
        }

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const tabBtn3 = debugElement.queryAll(By.css('.sky-btn-tab'))[2]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn3, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowRight',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;
        validateElFocused(tabBtn1);
      }));

      it('should navigate to the previous tab when the left arrow key is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        if (fixture.componentInstance.tabsetComponent) {
          fixture.componentInstance.tabsetComponent.active = 1;
        }

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const tabBtn2 = debugElement.queryAll(By.css('.sky-btn-tab'))[1]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn2, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowLeft',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;
        validateElFocused(tabBtn1);
      }));

      it('should navigate to the previous tab and skip the disabled one when the left arrow key is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        if (fixture.componentInstance.tabsetComponent) {
          fixture.componentInstance.tabsetComponent.active = '3';
        }
        fixture.componentInstance.tab2Disabled = true;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const tabBtn3 = debugElement.queryAll(By.css('.sky-btn-tab'))[2]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn3, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowLeft',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;
        validateElFocused(tabBtn1);
      }));

      it('should navigate to the last tab when the left arrow key is pressed on the first tab', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn1, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowLeft',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn3 = debugElement.queryAll(By.css('.sky-btn-tab'))[2]
          .nativeElement;
        validateElFocused(tabBtn3);
      }));

      it('should navigate to the first tab when the home key is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        if (fixture.componentInstance.tabsetComponent) {
          fixture.componentInstance.tabsetComponent.active = 1;
        }

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        const tabBtn2 = debugElement.queryAll(By.css('.sky-btn-tab'))[1]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn2, 'keydown', {
          keyboardEventInit: {
            key: 'home',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;
        validateElFocused(tabBtn1);
      }));

      it('should navigate to the last tab when the end key is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn1, 'keydown', {
          keyboardEventInit: {
            key: 'end',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn3 = debugElement.queryAll(By.css('.sky-btn-tab'))[2]
          .nativeElement;
        validateElFocused(tabBtn3);
      }));

      it('should reset the focus order when shift + tab navigates back to the active tab', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        const tabBtn1 = debugElement.queryAll(By.css('.sky-btn-tab'))[0]
          .nativeElement;

        SkyAppTestUtility.fireDomEvent(tabBtn1, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowRight',
          },
        });

        fixture.detectChanges();
        tick();

        const tabBtn2 = debugElement.queryAll(By.css('.sky-btn-tab'))[1]
          .nativeElement;
        validateElFocused(tabBtn2);

        SkyAppTestUtility.fireDomEvent(tabBtn1, 'keydown', {
          keyboardEventInit: {
            key: 'Tab',
            shiftKey: true,
          },
        });

        fixture.detectChanges();
        tick();

        validateElFocused(tabBtn2);
      }));
    });

    describe('button aria label', () => {
      beforeEach(() => {
        let uniqueId = 0;
        const idSvc = TestBed.inject(SkyIdService);
        spyOn(idSvc, 'generateId').and.callFake(() => `MOCK_ID_${++uniqueId}`);
      });

      it('should indicate the current state of a wizard step', fakeAsync(() => {
        const wizardFixture = TestBed.createComponent(
          SkyWizardTestFormComponent,
        );

        wizardFixture.detectChanges();
        tick();
        wizardFixture.detectChanges();
        tick();

        wizardFixture.componentInstance.requiredValue1 = 'test';
        wizardFixture.componentInstance.selectedTab = 1;
        wizardFixture.componentInstance.step3Disabled = true;

        wizardFixture.detectChanges();
        tick();
        wizardFixture.detectChanges();
        tick();

        const tabBtns = wizardFixture.debugElement.queryAll(
          By.css('.sky-btn-tab'),
        );
        const tabBtn1 = tabBtns[0]?.nativeElement;
        const tabBtn2 = tabBtns[1]?.nativeElement;
        const tabBtn3 = tabBtns[2]?.nativeElement;

        expect(tabBtn1?.ariaLabel).toEqual('Step 1 of 3, completed: Step 1');
        expect(tabBtn2?.ariaLabel).toEqual('Step 2 of 3, current: Step 2');
        expect(tabBtn3?.ariaLabel).toEqual('Step 3 of 3, unavailable: Step 3');
      }));

      it('should indicate the current tab number out of the total tabs', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const tabBtns = debugElement.queryAll(By.css('.sky-btn-tab'));
        const tabBtn1 = tabBtns[0]?.nativeElement;

        expect(tabBtn1?.ariaLabel).toBeNull();
        expect(tabBtn1?.getAttribute('aria-labelledby')).toEqual(
          jasmine.stringMatching(/MOCK_ID_[0-9]/),
        );
      }));
    });
  });

  describe('Permalinks', () => {
    let fixture: ComponentFixture<SkyTabsetPermalinksFixtureComponent>;
    let location: Location;

    beforeEach(() => {
      location = TestBed.inject(Location);
      fixture = TestBed.createComponent(SkyTabsetPermalinksFixtureComponent);
    });

    it('should activate a tab based on a query param on init', fakeAsync(() => {
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';
      spyOn(location, 'path').and.returnValue(
        '?foobar-active-tab=design-guidelines',
      );

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 1);
    }));

    it('should handle unrecognized query param', fakeAsync(() => {
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';
      spyOn(location, 'path').and.returnValue('?foobar-active-tab=invalid-tab');

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 0);
    }));

    it('should not add to browser history when setting a query param on init', fakeAsync(() => {
      const goSpy = spyOn(location, 'go');
      const replaceStateSpy = spyOn(location, 'replaceState').and.callFake(
        (path) => {
          // Fake the location after `replaceState()` is called so subsequent calls to the
          // permalink service's setParam() method don't try to navigate again.
          spyOn(location, 'path').and.returnValue(path);
        },
      );

      fixture.componentInstance.permalinkId = 'foobar';
      fixture.componentInstance.activeIndex = 1;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(replaceStateSpy).toHaveBeenCalledOnceWith(
        '/?foobar-active-tab=design-guidelines',
        '',
        jasmine.any(Object),
      );

      expect(goSpy).not.toHaveBeenCalled();
    }));

    it('should not add to browser history when setting a query param on init and active index is not specified', fakeAsync(() => {
      const goSpy = spyOn(location, 'go');
      const replaceStateSpy = spyOn(location, 'replaceState').and.callFake(
        (path) => {
          // Fake the location after `replaceState()` is called so subsequent calls to the
          // permalink service's setParam() method don't try to navigate again.
          spyOn(location, 'path').and.returnValue(path);
        },
      );

      fixture.componentInstance.permalinkId = 'foobar';
      fixture.componentInstance.activeIndex = undefined;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(replaceStateSpy).toHaveBeenCalledOnceWith(
        '/?foobar-active-tab=api',
        '',
        jasmine.any(Object),
      );

      expect(goSpy).not.toHaveBeenCalled();
    }));

    it('should set a query param when a tab is selected', fakeAsync(() => {
      fixture.componentInstance.permalinkId = 'foobar';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.activeIndex).toEqual(0);

      const buttonElement =
        fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      buttonElement.click();

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual('/?foobar-active-tab=design-guidelines');
      expect(fixture.componentInstance.activeIndex).toEqual(1);
    }));

    it('should allow custom query param value for each tab', fakeAsync(() => {
      fixture.componentInstance.permalinkId = 'foobar';
      fixture.componentInstance.permalinkValue = 'baz';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.activeIndex).toEqual(0);

      const buttonElement =
        fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      buttonElement.click();

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual('/?foobar-active-tab=baz');
      expect(fixture.componentInstance.activeIndex).toEqual(1);
    }));

    it('should handle special characters in query param value', fakeAsync(() => {
      fixture.componentInstance.permalinkId = 'foobar';
      fixture.componentInstance.permalinkValue =
        '!@#$%a ^&*()_-+b ={}[]\\|/:-c;"\'<>,.?~ d`';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.activeIndex).toEqual(0);

      const buttonElement =
        fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      SkyAppTestUtility.fireDomEvent(buttonElement, 'click');

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual('/?foobar-active-tab=a-b-c-d');
      expect(fixture.componentInstance.activeIndex).toEqual(1);

      // Make sure non-English special characters still work!
      fixture.componentInstance.permalinkValue = '片仮名';

      fixture.detectChanges();
      tick();

      buttonElement.click();

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual(
        `/?foobar-active-tab=${encodeURIComponent('片仮名')}`,
      );
    }));

    it('should fall back to `active` if query param value does not match a tab', fakeAsync(() => {
      fixture.componentInstance.activeIndex = 0;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 0);

      fixture.componentInstance.activeIndex = 2;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 2);

      fixture.componentInstance.permalinkId = 'foobar';
      spyOn(location, 'path').and.returnValue('?foobar-active-tab=invalid-tab');
      SkyAppTestUtility.fireDomEvent(window, 'popstate');

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 2);
    }));

    it('should not affect existing query params', fakeAsync(() => {
      fixture.componentInstance.activeIndex = 1;
      fixture.componentInstance.permalinkId = 'foobar';
      void TestBed.inject(Router).navigate([], {
        queryParams: {
          'foobar-active-tab': 'design-guidelines',
          bar: 'baz',
        },
      });
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Confirm the correct tab is selected.
      validateTabSelected(fixture.nativeElement, 1);

      const buttonElement =
        fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      SkyAppTestUtility.fireDomEvent(buttonElement, 'focus');
      SkyAppTestUtility.fireDomEvent(buttonElement, 'click');

      fixture.detectChanges();
      tick();

      expect(location.path())
        .withContext('Existing query params should be unaffected.')
        .toBe('/?foobar-active-tab=design-guidelines&bar=baz');
    }));

    it('should activate tabs when popstate changes', fakeAsync(() => {
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 0);

      const tabButtons = fixture.nativeElement.querySelectorAll('.sky-btn-tab');
      tabButtons[1].click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 1);

      // Trigger "back" button in browser.
      location.back();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 0);
    }));

    it('should not affect the current route when a tab is opened for the first time or destroyed', fakeAsync(async () => {
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';
      await fixture.componentInstance.router.navigate([
        'example-path',
        'example-child-path',
      ]);

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual(
        '/example-path/example-child-path?foobar-active-tab=api',
      );

      fixture.detectChanges();
      tick();

      fixture.componentInstance.removeFromExistence();

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual('/example-path/example-child-path');
    }));

    it('should not remove query params when the tabset component is destroyed due to navigation', fakeAsync(async () => {
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';
      await fixture.componentInstance.router.navigate([
        'example-path',
        'example-child-path',
      ]);

      fixture.detectChanges();
      tick();

      const goSpy = spyOn(location, 'go');

      // Navigate, but destroy the component before the navigation completes.
      void fixture.componentInstance.router.navigate(['other-page']);
      fixture.destroy();

      expect(goSpy).not.toHaveBeenCalled();
    }));
  });

  describe('with layout host', () => {
    let layoutHostSvc: SkyLayoutHostService;

    function validateTabsetLayoutChange(
      fixture: ComponentFixture<TabsetTestComponent>,
      layoutForChildHandler: jasmine.Spy,
      expectedLayout: SkyTabLayoutType,
      newActiveTabIndex?: number,
    ): void {
      if (newActiveTabIndex !== undefined) {
        fixture.componentInstance.activeTab = newActiveTabIndex;
      }

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(layoutForChildHandler).toHaveBeenCalledOnceWith({
        layout: expectedLayout,
      });

      expect(fixture.nativeElement.querySelector('sky-tabset')).toHaveCssClass(
        `sky-tabset-layout-${expectedLayout}`,
      );

      layoutForChildHandler.calls.reset();
    }

    beforeEach(() => {
      TestBed.overrideProvider(SkyLayoutHostService, {
        useValue: layoutHostSvc,
      });

      layoutHostSvc = TestBed.inject(SkyLayoutHostService);
    });

    it('should update the tabset layout for the selected tab', fakeAsync(() => {
      const layoutForChildHandler = jasmine.createSpy('layoutForChildHandler');
      layoutHostSvc.hostLayoutForChild.subscribe(layoutForChildHandler);

      const fixture = TestBed.createComponent(TabsetTestComponent);

      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'none');
      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'fit', 1);
      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'blocks', 2);
      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'none', 0);
    }));

    it('should update the tabset layout when the active tab layout changes', fakeAsync(() => {
      const layoutForChildHandler = jasmine.createSpy('layoutForChildHandler');
      layoutHostSvc.hostLayoutForChild.subscribe(layoutForChildHandler);

      const fixture = TestBed.createComponent(TabsetTestComponent);

      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'blocks', 2);

      fixture.componentInstance.tab3Layout = 'list';

      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'list');

      fixture.componentInstance.tab3Layout = 'none';

      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'none');
    }));

    it('should default tab layout to "none" when set to undefined', fakeAsync(() => {
      const layoutForChildHandler = jasmine.createSpy('layoutForChildHandler');
      layoutHostSvc.hostLayoutForChild.subscribe(layoutForChildHandler);

      const fixture = TestBed.createComponent(TabsetTestComponent);

      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'blocks', 2);

      fixture.componentInstance.tab3Layout = undefined;

      validateTabsetLayoutChange(fixture, layoutForChildHandler, 'none');
    }));
  });
});
