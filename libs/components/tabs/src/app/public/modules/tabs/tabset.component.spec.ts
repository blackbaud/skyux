import {
  Location
} from '@angular/common';

import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  ActivatedRoute,
  NavigationExtras,
  Router
} from '@angular/router';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange
} from '@skyux/theme';

import {
  expect,
  expectAsync,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyTabsetAdapterService
} from './tabset-adapter.service';

import {
  SkyTabsetComponent
} from './tabset.component';

import {
  SkyTabsetService
} from './tabset.service';

import {
  SkyTabsFixturesModule
} from './fixtures/tabs-fixtures.module';

import {
  TabsetTestComponent
} from './fixtures/tabset.component.fixture';

import {
  TabsetActiveTestComponent
} from './fixtures/tabset-active.component.fixture';

import {
  TabsetActiveTwoWayBindingTestComponent
} from './fixtures/tabset-active-two-way.component.fixture';

import {
  MockTabsetAdapterService
} from './fixtures/tabset-adapter.service.mock';

import {
  TabsetLoopTestComponent
} from './fixtures/tabset-loop.component.fixture';

import {
  SkyTabsetPermalinksFixtureComponent
} from './fixtures/tabset-permalinks.component.fixture';

import {
  SkyTabsetPermalinkService
} from './tabset-permalink.service';

// #region helpers
function getTabs(fixture: ComponentFixture<any>): NodeListOf<HTMLElement> {
  return fixture.nativeElement.querySelectorAll('.sky-tab');
}

function getTabset(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-tabset');
}
// #endregion

describe('Tabset component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
        {
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
          ),
          previousSettings: undefined
        }
      )
    };

    TestBed.configureTestingModule({
      imports: [
        SkyTabsFixturesModule
      ],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc
        }
      ]
    });
  });

  function validateTabSelected(el: Element, tabIndex: number, content?: string) {
    let selectedCls: string;
    let buttonEls: NodeListOf<Element>;
    let inDropDownMode = el.querySelector('.sky-tabset-mode-dropdown');

    if (inDropDownMode) {
      selectedCls = 'sky-tab-dropdown-item-selected';
      buttonEls = el.querySelectorAll('.sky-tab-dropdown-item');
    } else {
      selectedCls = 'sky-btn-tab-selected';
      buttonEls = el.querySelectorAll('.sky-btn-tab');
    }

    let contentEls = el.querySelectorAll('.sky-tab');

    for (let i = 0, n = buttonEls.length; i < n; i++) {
      let buttonEl = buttonEls[i];
      let panelDisplay = getComputedStyle(contentEls[i]).display;
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
        `The tab button at array index ${tabIndex} was expected to have the CSS class ${selectedCls}.`
      );
      expect(panelDisplay).toBe(
        expectedDisplay,
        `The tab panel at array index ${tabIndex} was expected to have the CSS display of ${expectedDisplay}.`
      );

      if (!inDropDownMode) {
        expect(buttonEl.getAttribute('aria-selected')).toBe(
          expectedHasClass.toString(),
          `Expected tab button ${buttonEl.innerHTML} to set "aria-selected".`
        );
      }
    }
    if (content) {
      expect(contentEls[tabIndex]).toHaveText(content);
    }
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

  it('should update the tab button margin class when the theme is modern', () => {
    function validateMargins(theme: string): void {
      for (const btnEl of btnEls) {
        if (theme === 'modern') {
          expect(btnEl).toHaveCssClass('sky-margin-inline-sm');
        } else {
          expect(btnEl).not.toHaveCssClass('sky-margin-inline-sm');
        }
      }
    }

    let template = `<sky-tabset (newTab)="newTab()" (openTab)="openTab()">
  <sky-tab
    tabHeading="Tab 1"
  >
    Tab content
  </sky-tab>
</sky-tabset>`;

    let fixture = TestBed
      .overrideComponent(
        TabsetTestComponent,
        {
          set: {
            template: template
          }
        }
      )
      .createComponent(TabsetTestComponent);

    fixture.detectChanges();

    const btnEls = [
      ...Array.from(fixture.nativeElement.querySelectorAll('.sky-btn-tab')),
      fixture.nativeElement.querySelector('.sky-tabset-btn-new'),
      fixture.nativeElement.querySelector('.sky-tabset-btn-open')
    ];

    validateMargins('default');

    mockThemeSvc.settingsChange.next(
      {
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        )
      }
    );

    fixture.detectChanges();

    validateMargins('modern');
  });

  describe('tabs with active attribute', () => {
    it('should change the active tab when tab active is set to true', fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

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
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let el = fixture.nativeElement;

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
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let el = fixture.nativeElement;

      fixture.componentInstance.tab2Disabled = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let tab = el.querySelectorAll('.sky-btn-tab')[1];
      let closeBtn = tab.querySelector('.sky-btn-tab-close');
      expect(closeBtn.getAttribute('disabled')).toBe('');
      expect(closeBtn).toHaveCssClass('sky-btn-tab-close-disabled');

      tab.click();
      fixture.detectChanges();
      validateTabSelected(el, 0);
    }));

    it('should initialize the tabs properly when active is set to true', () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.activeTab = 1;

      fixture.detectChanges();

      validateTabSelected(el, 1);
    });
  });

  it('should notify the consumer when the add tab button is clicked', () => {
    let template = `<sky-tabset (newTab)="newTab()"></sky-tabset>`;

    let fixture = TestBed
      .overrideComponent(
        TabsetTestComponent,
        {
          set: {
            template: template
          }
        }
      )
      .createComponent(TabsetTestComponent);

    let cmp: TabsetTestComponent = fixture.componentInstance;
    let el = fixture.nativeElement;

    fixture.detectChanges();

    let newTabSpy = spyOn(cmp, 'newTab');

    el.querySelector('.sky-tabset-btn-new').click();

    expect(newTabSpy).toHaveBeenCalled();
  });

  it('should notify the consumer when the new tab button is clicked', () => {
    let template = `<sky-tabset (openTab)="openTab()"></sky-tabset>`;

    let fixture = TestBed
      .overrideComponent(
        TabsetTestComponent,
        {
          set: {
            template: template
          }
        }
      )
      .createComponent(TabsetTestComponent);

    let cmp: TabsetTestComponent = fixture.componentInstance;
    let el = fixture.nativeElement;

    fixture.detectChanges();

    let openTabSpy = spyOn(cmp, 'openTab');

    el.querySelector('.sky-tabset-btn-open').click();

    expect(openTabSpy).toHaveBeenCalled();
  });

  it('should notify the consumer when a tab\'s close button is clicked', fakeAsync(() => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    let cmp: TabsetTestComponent = fixture.componentInstance;
    let el = fixture.nativeElement;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    let closeTabSpy = spyOn(cmp, 'closeTab2');

    el.querySelectorAll('.sky-btn-tab')[1].querySelector('.sky-btn-tab-close').click();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(closeTabSpy).toHaveBeenCalled();
  }));

  it('should notify the consumer when a tab\'s tabIndex changes', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetLoopTestComponent);
    const spy = spyOn(fixture.componentInstance, 'onTabIndexesChange').and.callThrough();

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
        { tabHeading: 'Tab 2', tabIndex: 'foobar' }
      ]
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
        { tabHeading: 'Tab 3', tabIndex: 2 }
      ]
    });
    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should create unique tab indexes automatically', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsetLoopTestComponent);
    const spy = spyOn(fixture.componentInstance, 'onTabIndexesChange').and.callThrough();

    fixture.componentInstance.tabArray = [
      {
        tabHeading: 'Tab 1',
        tabContent: 'Tab 1 content'
      },
      {
        tabHeading: 'Tab 2',
        tabContent: 'Tab 2 content'
      }
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
      tabs: [
        { tabHeading: 'Tab 1', tabIndex: 0 }
      ]
    });
    spy.calls.reset();

    // Add a new one.
    fixture.componentInstance.tabArray.push({
      tabHeading: 'New tab',
      tabContent: 'New tab content'
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith({
      tabs: [
        { tabHeading: 'Tab 1', tabIndex: 0 },
        { tabHeading: 'New tab', tabIndex: 2 }
      ]
    });
  }));

  it('should select the next tab when the active tab is closed', fakeAsync(() => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    let cmp: TabsetTestComponent = fixture.componentInstance;
    let el = fixture.nativeElement;
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

  it(
    'should select the previous tab when the last tab is closed and the last tab was active',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;
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
    }
    ));

  it(
    'should maintain the currently active tab when a non-active tab is closed',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;
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
    }
    ));

  it(
    'should display count in tab when tabHeaderCount is defined',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      let count = 99;
      cmp.tab3HeaderCount = count;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      let tabEl = el.querySelectorAll('.sky-btn-tab')[2].querySelector('.sky-tab-header-count');

      expect(tabEl.innerText.trim()).toBe(count.toString());
    }
  ));

  it(
    'tabHeaderCount span element should not exist when tabHeaderCount is undefined',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      let count: number = undefined;
      cmp.tab3HeaderCount = count;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      let tabEl = el.querySelectorAll('.sky-btn-tab')[2].querySelector('.sky-tab-header-count');

      expect(!tabEl);
    }
  ));

  it(
    'should display zero in tab when tabHeaderCount is set to zero',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      let count = 0;
      cmp.tab3HeaderCount = count;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      let tabEl = el.querySelectorAll('.sky-btn-tab')[2].querySelector('.sky-tab-header-count');

      expect(tabEl.innerText.trim()).toBe(count.toString());
    }
  ));

  it('should add no buttons if add and open are not defined', () => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();

    expect(el.querySelector('.sky-tabset-btn-new')).toBeNull();
    expect(el.querySelector('.sky-tabset-btn-open')).toBeNull();
  });

  it(
    'should collapse into a dropdown when the width of the tabs is greater than its container',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);

      function fireResizeEvent() {
        SkyAppTestUtility.fireDomEvent(window, 'resize');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }

      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      el.style.width = (el.querySelector('.sky-tabset-tabs').offsetWidth - 1) + 'px';

      fireResizeEvent();

      let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      expect(tabEl).not.toBeNull();

      el.style.width = 'auto';

      fireResizeEvent();

      tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      expect(tabEl).toBeNull();
    }
  ));

  it(
    'should collapse into a dropdown  on initialization',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      fixture.componentInstance.tabMaxWidth = 20;

      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      expect(tabEl).not.toBeNull();
    }
    ));

  it('should be accessible', async(async () => {
    const fixture = TestBed.createComponent(TabsetTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  }));

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
              useValue: mockAdapterService
            },
            SkyTabsetPermalinkService
          ]
        }
      }).createComponent(TabsetTestComponent);
    });

    it(
      'should display the selected tab in the collapsed tab dropdown button',
      fakeAsync(() => {
        let el = fixture.nativeElement;
        let cmp: TabsetTestComponent = fixture.componentInstance;

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
      }
    ));

    it('should allow another tab to be selected from the dropdown', fakeAsync(() => {
      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(true);

      fixture.detectChanges();
      tick();

      let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      tabEl.click();
      fixture.detectChanges();
      tick();

      let dropdownTabButtons = document.querySelectorAll('.sky-tab-dropdown-item .sky-btn-tab');
      expect(dropdownTabButtons[1]).toHaveText('Tab 2');

      (dropdownTabButtons[1] as HTMLElement).click();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 1);
    }
    ));

    it(
      'should allow another not allow tab to be selected from the dropdown when disabled',
      fakeAsync(() => {
        let el = fixture.nativeElement;

        fixture.componentInstance.tab2Disabled = true;

        fixture.detectChanges();
        tick();

        mockAdapterService.fakeOverflowChange(true);

        fixture.detectChanges();
        tick();

        let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

        tabEl.click();
        fixture.detectChanges();
        tick();

        let dropdownTabButtons = document.querySelectorAll('.sky-tab-dropdown-item .sky-btn-tab');

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
      }
      ));

    it(
      'should notify the consumer when a tab\'s close button is clicked',
      fakeAsync(() => {
        fixture.detectChanges();
        tick();

        let el = fixture.nativeElement;

        const closeSpy = spyOn(fixture.componentInstance, 'closeTab2').and.callThrough();

        fixture.detectChanges();
        tick();

        mockAdapterService.fakeOverflowChange(true);

        fixture.detectChanges();
        tick();

        let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

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
      }
    ));

    it(
      'should notify the consumer when a dropdown tab\'s close button is clicked',
      fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        let el = fixture.nativeElement;

        const closeSpy = spyOn(fixture.componentInstance, 'closeTab2').and.callThrough();

        fixture.componentInstance.tabsetComponent.tabDisplayMode = 'dropdown';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        let tabEl: HTMLElement = document.querySelector('.sky-dropdown-button');
        tabEl.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        // Verify number of tabs before closing one.
        expect(el.querySelectorAll('.sky-btn-tab').length).toBe(3);

        const closeButton = document.querySelectorAll(
          '.sky-dropdown-item .sky-btn-tab-close'
        )[0] as HTMLElement;

        closeButton.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
        expect(closeSpy).toHaveBeenCalled();
      }
    ));

    it('should be accessible', async(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    }));
  });

  describe('active state on tabset', () => {
    it('should initialize active state based on active', fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 0);

    }));

    it('should activate the first tab if active is set to invalid index', fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let el = fixture.nativeElement;

      fixture.componentInstance.activeIndex = 'invalid';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 0);
    }));

    it('should initialize active state based on string tabIndex values', fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let el = fixture.nativeElement;

      fixture.componentInstance.activeIndex = 'something';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      validateTabSelected(el, 2);
    }));

    it('should listen for changes in active state', fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let cmp: TabsetActiveTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

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
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let cmp: TabsetActiveTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

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
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let cmp: TabsetActiveTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;
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
      fixture.componentInstance.tabArray = fixture.componentInstance.createTabArray();

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
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      let cmp: TabsetActiveTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;
      cmp.activeIndex = 1;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 1);
    }));

    it('should handle two-way binding on `active` input', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabsetActiveTwoWayBindingTestComponent);
      const component = fixture.componentInstance;
      const activeSpy = spyOn(component, 'onActiveChange').and.callThrough();

      component.activeTab = '1';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 1);
      expect(activeSpy).toHaveBeenCalledTimes(0);

      component.activeTab = '0';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 0);

      expect(activeSpy).toHaveBeenCalledWith('0');
      expect(activeSpy).toHaveBeenCalledTimes(1);
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

    it('should set active index after tabset is initialized without tabs and active index',
      fakeAsync(() => {
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
      })
    );

    it('should be accessible', async(async () => {
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    }));

  });

  describe('general accessibility', () => {
    let debugElement: DebugElement;
    let fixture: ComponentFixture<TabsetTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SkyTabsFixturesModule
        ]
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
        expect(tabButton.getAttribute('role')).toBe('tab');
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

      expect(tabSet.getAttribute('aria-labelledby')).toEqual(myAriaLabelledById);
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

        expect(tab.getAttribute('aria-labelledby')).toBe(tabButton.getAttribute('id'));
        expect(tabButton.getAttribute('aria-controls')).toBe(tabId);
      }
    }));

    it('should switch aria-controls and aria-labelledby references between tabs and dropdown buttons', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      /// Switch to mobile display
      fixture.componentInstance.tabsetComponent.tabDisplayMode = 'dropdown';
      fixture.detectChanges();

      const button = document.querySelector('.sky-dropdown-button') as HTMLElement;
      button.click();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const tabs = getTabs(fixture);
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs.item(i);
        const tabId = tab.getAttribute('id');
        const tabButton = document.getElementById(`${tabId}-nav-btn`);

        expect(tab.getAttribute('aria-labelledby')).toBe(tabButton.getAttribute('id'));
        expect(tabButton.getAttribute('aria-controls')).toBe(tabId);
      }
    }));

    it('should have tabindex of 0', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let butEl = debugElement.queryAll(By.css('.sky-btn-tab'))[1].nativeElement;
      expect(butEl.getAttribute('tabindex')).toBe('0');
      expect(butEl.getAttribute('aria-disabled')).toBe('false');
    }));

    it('should have tabindex of -1 and aria-disabled when disabled', fakeAsync(() => {
      fixture.componentInstance.tab2Available = true;
      fixture.componentInstance.tab2Disabled = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let butEl = debugElement.queryAll(By.css('.sky-btn-tab'))[1].nativeElement;
      expect(butEl.getAttribute('tabindex')).toBe('-1');
      expect(butEl.getAttribute('aria-disabled')).toBe('true');
    }));

    it('should emit a click event on enter press', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      let el = debugElement.queryAll(By.css('.sky-btn-tab'))[1];

      SkyAppTestUtility.fireDomEvent(el.nativeElement, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 1);

      el = debugElement.queryAll(By.css('.sky-btn-tab'))[2];
      SkyAppTestUtility.fireDomEvent(el.nativeElement, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });
      fixture.detectChanges();
      tick();

      validateTabSelected(fixture.nativeElement, 2);
    }
    ));
  });

  describe('Permalinks', () => {
    let fixture: ComponentFixture<SkyTabsetPermalinksFixtureComponent>;
    let location: Location;
    let router: Router;
    let createUrlTreeSpy: jasmine.Spy;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyTabsetPermalinksFixtureComponent);
    });

    beforeEach(inject(
      [Location, Router, ActivatedRoute],
      (_location: Location, _router: Router) => {
        location = _location;
        router = _router;

        createUrlTreeSpy = spyOn(router as any, 'createUrlTree').and
          .callFake((commands: any[], extras: NavigationExtras) => {
            const params = Object.keys(extras.queryParams)
              .map(k => `${k}=${extras.queryParams[k]}`)
              .join('&');
            return `?${params}`;
          });
      }
    ));

    afterEach(() => {
      fixture.destroy();
      expect(createUrlTreeSpy.calls.mostRecent().args[1].queryParams['foobar-active-tab'])
        .toBeUndefined('The permalink param should be cleared when the tabset is destroyed.');
    });

    it('should activate a tab based on a query param', fakeAsync(() => {
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';
      spyOn(location, 'path').and.returnValue('?foobar-active-tab=design-guidelines');

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

    it('should set a query param when a tab is selected', fakeAsync(() => {
      fixture.componentInstance.permalinkId = 'foobar';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.activeIndex).toEqual(0);

      const buttonElement = fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
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

      const buttonElement = fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      buttonElement.click();

      fixture.detectChanges();
      tick();

      expect(location.path()).toEqual('/?foobar-active-tab=baz');
      expect(fixture.componentInstance.activeIndex).toEqual(1);
    }));

    it('should handle special characters in query param value', fakeAsync(() => {
      fixture.componentInstance.permalinkId = 'foobar';
      fixture.componentInstance.permalinkValue = '!@#$%a ^&*()_-+b ={}[]\\|/:-c;"\'<>,.?~ d`';

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.activeIndex).toEqual(0);

      const buttonElement = fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      // Prevent the anchor's href attribute from being visited,
      // otherwise it will trigger a page reload.
      // See: https://github.com/dfederm/karma-jasmine-html-reporter/issues/26#issuecomment-608582845
      buttonElement.onclick = function () {
        return false;
      };
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
        '/?foobar-active-tab=片仮名'
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
      fixture.componentInstance.activeIndex = 0;
      fixture.componentInstance.permalinkId = 'foobar';
      spyOn(location, 'path').and.returnValue('?foobar-active-tab=design-guidelines&bar=baz');

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Confirm the correct tab is selected.
      validateTabSelected(fixture.nativeElement, 1);

      const buttonElement = fixture.nativeElement.querySelectorAll('.sky-btn-tab')[1];
      // Prevent the anchor's href attribute from being visited,
      // otherwise it will trigger a page reload.
      // See: https://github.com/dfederm/karma-jasmine-html-reporter/issues/26#issuecomment-608582845
      buttonElement.onclick = function () {
        return false;
      };
      SkyAppTestUtility.fireDomEvent(buttonElement, 'click');

      fixture.detectChanges();
      tick();

      const actualNavigationExtras = createUrlTreeSpy.calls.argsFor(0)[1];
      expect(actualNavigationExtras.queryParams).toEqual(
        jasmine.objectContaining({
          bar: 'baz'
        }),
        'Existing query params should be unaffected.'
      );
      expect(actualNavigationExtras.queryParamsHandling).toEqual(
        'merge',
        'The router was not called with `queryParamsHandling: \'merge\'`!'
      );
    }));
  });
});
