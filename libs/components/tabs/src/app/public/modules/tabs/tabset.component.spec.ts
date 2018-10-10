import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  async
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import { SkyTabsetComponent } from './tabset.component';
import { SkyTabsetAdapterService } from './tabset-adapter.service';
import { SkyTabsetService } from './tabset.service';
import { SkyTabsFixturesModule } from './fixtures/tabs-fixtures.module';
import { TabsetTestComponent } from './fixtures/tabset.component.fixture';
import { TabsetActiveTestComponent } from './fixtures/tabset-active.component.fixture';
import { MockTabsetAdapterService } from './fixtures/tabset-adapter.service.mock';

import {
  DebugElement
} from '@angular/core';

import { By } from '@angular/platform-browser';

describe('Tabset component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyTabsFixturesModule
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

      expect(buttonEl.classList.contains(selectedCls)).toBe(expectedHasClass);
      expect(panelDisplay).toBe(expectedDisplay);

      if (!inDropDownMode) {
        expect(buttonEl.getAttribute('aria-selected')).toBe(expectedHasClass.toString());
      }
    }
    if (content) {
      expect(contentEls[tabIndex]).toHaveText(content);
    }
  }

  it('should initialize tabs in proper order', fakeAsync(() => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    fixture.detectChanges();
    tick();
    let tabsetService: SkyTabsetService = (fixture.componentInstance.tabsetComponent as any).tabsetService;

    fixture.componentInstance.tabsetComponent.tabs.forEach((item, index) => {
      expect(item).toBe(tabsetService.tabs.getValue()[index]);
    });
  }));

  it('should initialize tabs that are added to the tabset after init', async(() => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    fixture.componentInstance.tab3Content = 'test content';
    fixture.componentInstance.tab3Available = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      let tabsetService: SkyTabsetService = (fixture.componentInstance.tabsetComponent as any).tabsetService;
      expect(tabsetService.tabs.getValue().length).toBe(2);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.componentInstance.tab3Available = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.nativeElement.querySelectorAll('.sky-btn-tab')[2].click();

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            validateTabSelected(fixture.nativeElement, 2, fixture.componentInstance.tab3Content);

            expect(tabsetService.tabs.getValue().length).toBe(3);
            fixture.componentInstance.tabsetComponent.tabs.forEach((item, index) => {
              expect(item).toBe(tabsetService.tabs.value[index]);
            });
          });
        });
      });
    });
  }));

  describe('tabs with active attribute', () => {
    it('should change the active tab when tab active is set to true', fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

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

      el.querySelectorAll('.sky-btn-tab')[1].click();

      fixture.detectChanges();
      tick();

      validateTabSelected(el, 1);
    }));

    it('should not change the active tab when a disabled tab is clicked', () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let el = fixture.nativeElement;

      fixture.componentInstance.tab2Disabled = true;
      fixture.detectChanges();

      let tab = el.querySelectorAll('.sky-btn-tab')[1];
      let closeBtn = tab.querySelector('.sky-btn-tab-close');
      expect(closeBtn.getAttribute('disabled')).toBe('');
      expect(closeBtn).toHaveCssClass('sky-btn-tab-close-disabled');

      tab.click();
      fixture.detectChanges();
      validateTabSelected(el, 0);
    });

    it('should initialize the tabs properly when active is set to true', () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.activeTab = 1;

      fixture.detectChanges();

      validateTabSelected(el, 1);
    });
  });

  describe('Xs tab heading', () => {
    xit('should add a tab heading that is visible at xs breakpoints', () => {
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

  it('should notify the consumer when a tab\'s close button is clicked', () => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    let cmp: TabsetTestComponent = fixture.componentInstance;
    let el = fixture.nativeElement;

    fixture.detectChanges();

    let closeTabSpy = spyOn(cmp, 'closeTab2');

    el.querySelectorAll('.sky-btn-tab')[1].querySelector('.sky-btn-tab-close').click();

    expect(closeTabSpy).toHaveBeenCalled();
  });

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

      cmp.activeTab = 2;
      fixture.detectChanges();
      tick();
      validateTabSelected(el, 2, 'tab 3 content');

      cmp.tab2Available = false;
      fixture.detectChanges();
      tick();

      expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
      validateTabSelected(el, 1, 'tab 3 content');
    }
    ));

  it(
    'should display count in tab when tabHeaderCount is defined',
    () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      let count = 99;
      cmp.tab3HeaderCount = count;
      fixture.detectChanges();
      let tabEl = el.querySelectorAll('.sky-btn-tab')[2].querySelector('.sky-tab-header-count');

      expect(tabEl.innerText.trim()).toBe(count.toString());
    }
  );

  it(
    'tabHeaderCount span element should not exist when tabHeaderCount is undefined',
    () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      let count: number = undefined;
      cmp.tab3HeaderCount = count;
      fixture.detectChanges();
      let tabEl = el.querySelectorAll('.sky-btn-tab')[2].querySelector('.sky-tab-header-count');

      expect(!tabEl);
    }
  );

  it(
    'should display zero in tab when tabHeaderCount is set to zero',
    () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);
      let cmp: TabsetTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      let count = 0;
      cmp.tab3HeaderCount = count;
      fixture.detectChanges();
      let tabEl = el.querySelectorAll('.sky-btn-tab')[2].querySelector('.sky-tab-header-count');

      expect(tabEl.innerText.trim()).toBe(count.toString());
    }
  );

  it('should add no buttons if add and open are not defined', () => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();

    expect(el.querySelector('.sky-tabset-btn-new')).toBeNull();
    expect(el.querySelector('.sky-tabset-btn-open')).toBeNull();
  });

  it(
    'should collapse into a dropdown when the width of the tabs is greater than its container',
    () => {
      let fixture = TestBed.createComponent(TabsetTestComponent);

      function fireResizeEvent() {
        SkyAppTestUtility.fireDomEvent(window, 'resize');
        fixture.detectChanges();
      }

      let el = fixture.nativeElement;

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
  );

  it(
    'should collapse into a dropdown  on initialization',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(TabsetTestComponent);

      fixture.componentInstance.tabMaxWidth = 20;

      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      expect(tabEl).not.toBeNull();
    }
    ));

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(TabsetTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
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
            }
          ]
        }
      }).createComponent(TabsetTestComponent);
    });

    it(
      'should display the selected tab in the collapsed tab dropdown button',
      () => {
        let el = fixture.nativeElement;
        let cmp: TabsetTestComponent = fixture.componentInstance;

        fixture.detectChanges();

        mockAdapterService.fakeOverflowChange(true);

        fixture.detectChanges();

        let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

        expect(tabEl.innerText.trim()).toBe('Tab 1');

        cmp.activeTab = 2;
        fixture.detectChanges();

        expect(tabEl.innerText.trim()).toBe('Tab 3');
      }
    );

    it('should allow another tab to be selected from the dropdown', fakeAsync(() => {
      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();

      mockAdapterService.fakeOverflowChange(true);

      fixture.detectChanges();
      tick();

      let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

      tabEl.click();
      tick();
      fixture.detectChanges();
      tick();

      let dropdownTabButtons = el.querySelectorAll('.sky-tab-dropdown-item-btn');
      expect(dropdownTabButtons[1]).toHaveText('Tab 2');

      dropdownTabButtons[1].click();
      tick();
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
        tick();
        fixture.detectChanges();
        tick();

        let dropdownTabButtons = el.querySelectorAll('.sky-tab-dropdown-item-btn');

        dropdownTabButtons[0].click();
        tick();
        fixture.detectChanges();
        tick();

        tabEl.click();
        tick();
        fixture.detectChanges();
        tick();

        expect(dropdownTabButtons[1]).toHaveText('Tab 2');
        expect(dropdownTabButtons[1]).toHaveCssClass('sky-btn-disabled');

        dropdownTabButtons[1].click();
        tick();
        fixture.detectChanges();
        tick();

        validateTabSelected(el, 0);
      }
      ));

    it(
      'should notify the consumer when a tab\'s close button is clicked',
      () => {
        let el = fixture.nativeElement;

        fixture.detectChanges();

        mockAdapterService.fakeOverflowChange(true);

        fixture.detectChanges();

        let tabEl = el.querySelector('.sky-dropdown-button-type-tab');

        tabEl.click();
        el.querySelectorAll('.sky-tab-dropdown-item-close')[0].click();

        fixture.detectChanges();

        mockAdapterService.fakeOverflowChange(false);

        fixture.detectChanges();

        expect(el.querySelectorAll('.sky-btn-tab').length).toBe(2);
      }
    );

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
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

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(TabsetActiveTestComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

  });

  describe('collapsible tabs', () => {

    xit('collapses in xs when there are no add or open buttons', () => {
    });

    xit('collapses in xs when tabs are specifically defined', () => {
    });

    xit('works correctly when starting in extra small mode', () => {
    });

    xit('works correctly when starting in extra small mode with 1 tab', () => {
    });

    xit(
      'has the correct dropdown title in extra small mode when title changes using heading',
      () => {
      }
    );

    xit('can add and remove tabs', () => {

    });

    xit('can remove tabs while collapsed', () => {
    });

    describe('dropdown max width', () => {
      xit('adds max width when changing to collapsed mode', () => {
      });

      xit('adds max width when window size changes', () => {
      });
    });
  });

  describe('keyboard accessibility', () => {
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

    it('should have aria-controls and aria-labelledby references between tabs and panels', () => {
      fixture.detectChanges();
      let tabs = debugElement.queryAll(By.css('.sky-tab'));
      tabs.forEach((value) => {
        let tab = value.nativeElement;
        let tabBtn = debugElement.query(By.css('#' + tab.getAttribute('id') + '-nav-btn')).nativeElement;

        expect(tab.getAttribute('aria-labelledby')).toBe(tabBtn.getAttribute('id'));
        expect(tabBtn.getAttribute('aria-controls')).toBe(tab.getAttribute('id'));
      });
    });

    it('should switch aria-controls and aria-labelledby references between tabs and dropdown buttons', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      /// Switch to mobile display
      fixture.componentInstance.tabsetComponent.tabDisplayMode = 'dropdown';
      fixture.detectChanges();

      let tabs = debugElement.queryAll(By.css('.sky-tab'));
      tabs.forEach((value) => {
        let tab = value.nativeElement;
        let dropBtn = debugElement.query(By.css('#' + tab.getAttribute('id') + '-nav-btn')).nativeElement;
        let tabBtn = debugElement.query(By.css('#' + tab.getAttribute('id') + '-hidden-nav-btn')).nativeElement;

        expect(tab.getAttribute('aria-labelledby')).toBe(dropBtn.getAttribute('id'));
        expect(dropBtn.getAttribute('aria-controls')).toBe(tab.getAttribute('id'));
        expect(dropBtn).toHaveCssClass('sky-tab-dropdown-item-btn');
        expect(tabBtn.tagName.toLowerCase()).toBe('sky-tab-button');
      });
    }));

    it('should emit a click event on enter press', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      let el = debugElement.queryAll(By.css('.sky-btn-tab'))[1];

      el.triggerEventHandler('keydown', { keyCode: 15 });
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 0);

      el.triggerEventHandler('keydown', { keyCode: 13 });
      fixture.detectChanges();
      tick();
      validateTabSelected(fixture.nativeElement, 1);
    }
    ));
  });
});
