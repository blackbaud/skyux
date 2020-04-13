import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyInlineFormButtonLayout
} from '@skyux/inline-form';

import {
  SkyLogService
} from '@skyux/core';

import {
  DragulaService
} from 'ng2-dragula';

import {
  MockDragulaService
} from './fixtures/mock-dragula.service';

import {
  RepeaterAsyncItemsTestComponent
} from './fixtures/repeater-async-items.component.fixture';

import {
  RepeaterTestComponent
} from './fixtures/repeater.component.fixture';

import {
  SkyRepeaterFixturesModule
} from './fixtures/repeater-fixtures.module';

import {
  RepeaterInlineFormFixtureComponent
} from './fixtures/repeater-inline-form.component.fixture';

import {
  RepeaterWithMissingTagsFixtureComponent
} from './fixtures/repeater-missing-tag.fixture';

import {
  SkyRepeaterComponent
} from './repeater.component';

import {
  SkyRepeaterService
} from './repeater.service';

describe('Repeater item component', () => {
  class MockLogService {
    public warn(message: any) { }
  }

  // #region helpers
  function flushDropdownTimer() {
    flush();
  }

  function detectChangesAndTick(fixture: ComponentFixture<any>) {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getRepeaterItems(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('.sky-repeater-item');
  }

  function getDropdowns(el: HTMLElement): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.sky-dropdown-button') as NodeListOf<HTMLElement>;
  }

  function getChevrons(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('sky-chevron button') as NodeListOf<HTMLElement>;
  }

  function getLinks(el: HTMLElement): NodeListOf<HTMLElement> {
    return document.querySelectorAll('a') as NodeListOf<HTMLElement>;
  }

  function getReorderHandles(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('.sky-repeater-item-grab-handle');
  }

  function reorderItemWithKey(
    fixture: ComponentFixture<any>,
    itemIndex: number,
    direction: 'up' | 'down',
    activationKey: string = ' '
  ): void {
    let key: string;
    if (direction === 'up') {
      key = 'arrowUp';
    } else if (direction === 'down') {
      key = 'arrowDown';
    }
    const itemDragHandle = getReorderHandles(fixture.nativeElement)[itemIndex];
    SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
      keyboardEventInit: { key: activationKey }
    });
    fixture.detectChanges();
    SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
      keyboardEventInit: { key: key }
    });
    fixture.detectChanges();
    SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
      keyboardEventInit: { key: activationKey }
    });
    fixture.detectChanges();
  }
  // #endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyRepeaterFixturesModule
      ],
      providers: [SkyRepeaterService]
    });
  });

  it(
    'should default expand mode to "none" when no expand mode is specified',
    fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = undefined;

      fixture.detectChanges();

      tick();

      expect(cmp.repeater.expandMode).toBe('none');

      flushDropdownTimer();
    })
  );

  it('should allow removing all items dynamically', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    let el = fixture.nativeElement;
    let cmp: RepeaterTestComponent = fixture.componentInstance;
    cmp.showRepeaterWithNgFor = true;

    fixture.detectChanges();

    tick();

    cmp.items = [];
    fixture.detectChanges();
    tick();

    expect(el.querySelectorAll('sky-repeater-item').length).toBe(0);
    flushDropdownTimer();
  }));

  it('should have aria-control set pointed at content', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    expect(el.querySelector('sky-chevron').getAttribute('aria-controls'))
      .toBe(el.querySelector('.sky-repeater-item-content').getAttribute('id'));

    flushDropdownTimer();
  }));

  it('should hide the chevron and disable expand/collapse for items with no content', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showItemWithNoContent = true;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const itemWithNoContent = fixture.nativeElement.querySelectorAll('sky-repeater-item')[3];
    expect(itemWithNoContent.querySelector('sky-chevron')).not.toExist();
  }));

  it('should show/hide the chevron for dynamically added and removed content', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showItemWithNoContent = true;
    fixture.componentInstance.showDynamicContent = true;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const itemWithNoContent = fixture.nativeElement.querySelectorAll('sky-repeater-item')[3];
    expect(itemWithNoContent.querySelector('sky-chevron')).toExist();

    fixture.componentInstance.showDynamicContent = false;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(itemWithNoContent.querySelector('sky-chevron')).not.toExist();
  }));

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('keyboard controls', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);
      cmp = fixture.componentInstance;
      cmp.showContextMenu = true;
      el = fixture.nativeElement;
      fixture.detectChanges();
      tick(); // Allow repeater-item.component to set tabindexes & render context dropdown.
      fixture.detectChanges();
    }));

    it('should initialize with only the first repeater item being tabbable', () => {
      const items = getRepeaterItems(el);

      expect(items[0].tabIndex).toEqual(0);
      expect(items[1].tabIndex).toEqual(-1);
      expect(items[2].tabIndex).toEqual(-1);
    });

    it('should give the focused repeater item a tabIndex of 0, and the rest a tabIndex of -1', () => {
      const items = getRepeaterItems(el);

      items[1].click();
      fixture.detectChanges();

      expect(items[0].tabIndex).toEqual(-1);
      expect(items[1].tabIndex).toEqual(0);
      expect(items[2].tabIndex).toEqual(-1);
    });

    it('should disable tabbing for all node children', () => {
      const links = getLinks(el);
      const dropdowns = getDropdowns(el);
      const chevrons = getChevrons(el);

      Array.from(links).forEach(link => {
        expect(link.tabIndex).toEqual(-1);
      });
      Array.from(dropdowns).forEach(dropdown => {
        expect(dropdown.tabIndex).toEqual(-1);
      });
      Array.from(chevrons).forEach(chevron => {
        expect(chevron.tabIndex).toEqual(-1);
      });
    });

    it('should move between focusable children elements with left/right arrows', () => {
      const links = getLinks(el);
      const dropdowns = getDropdowns(el);
      const chevrons = getChevrons(el);
      const items = getRepeaterItems(el);

      // Press right arrow key on first node.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      // Expect first interactive child element to be selected (dropdown).
      expect(document.activeElement).toEqual(dropdowns[0]);

      // Press right arrow one more time.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      // Expect second interactive child element to be selected (chevron).
      expect(document.activeElement).toEqual(chevrons[0]);

      // Press right arrow one more time.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      // Expect third interactive child element to be selected (link).
      expect(document.activeElement).toEqual(links[0]);

      // Press left arrow key three times to go back.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });

      // Active focus should move back to first repeater item.
      expect(document.activeElement).toEqual(items[0]);
    });

    it('should move between nodes with up/down arrows', () => {
      const items = getRepeaterItems(el);

      // Focus on repeater and press down arrow twice.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowDown'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[1], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowDown'
        }
      });

      // Expect focus to be on third repeater item.
      expect(document.activeElement).toBe(items[2]);

      // Press up arrow key.
      SkyAppTestUtility.fireDomEvent(items[2], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowUp'
        }
      });

      // Expect focus to be on second repeater item.
      expect(document.activeElement).toBe(items[1]);
    });

    it('should select item with space and enter keys when selectable is set to true', () => {
      cmp.selectable = true;
      fixture.detectChanges();

      const items = getRepeaterItems(el);

      const isSelectedChangeSpy = spyOn(cmp, 'onIsSelectedChange').and.callThrough();

      // Expect first item NOT to be selected.
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-selected');

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'Enter'
        }
      });
      fixture.detectChanges();

      // Expect first item to be selected.
      expect(items[0]).toHaveCssClass('sky-repeater-item-selected');
      // Expect the isSelectedChange event to have been called with 'true'.
      expect(isSelectedChangeSpy).toHaveBeenCalledWith(true);
      // Expect the isSelectedChange event to have occurred once.
      expect(isSelectedChangeSpy).toHaveBeenCalledTimes(1);

      isSelectedChangeSpy.calls.reset();
      // Press space key.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: ' '
        }
      });
      fixture.detectChanges();

      // Expect first item NOT to be selected.
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-selected');
      // Expect the isSelectedChange event to have been called with 'false'.
      expect(isSelectedChangeSpy).toHaveBeenCalledWith(false);
      // Expect the event to have occurred twice.
      expect(isSelectedChangeSpy).toHaveBeenCalledTimes(1);

      // Verify that selection via keyboard only happens on the parent item element.
      SkyAppTestUtility.fireDomEvent(
        items[1].querySelector('.sky-repeater-item-header'), 'keydown', {
        keyboardEventInit: {
          key: ' '
        }
      });
      fixture.detectChanges();
      expect(items[1]).not.toHaveCssClass('sky-repeater-item-selected');
    });
  });

  it('should properly get an item\'s index from the service', fakeAsync(() => {

    let repeaterService = new SkyRepeaterService();
    let fixture = TestBed
      .overrideComponent(SkyRepeaterComponent, {
        add: {
          viewProviders: [
            { provide: SkyRepeaterService, useValue: repeaterService }
          ]
        }
      }).createComponent(RepeaterTestComponent);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(repeaterService.getItemIndex(fixture.componentInstance.repeater.items.toArray()[2]))
      .toBe(2);

    flushDropdownTimer();
  }));

  it('should not error when a non-reorderable repeater is interacted with', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);

    fixture.detectChanges();
    tick();

    // NOTE: This complicated setup is to ensure that we get to the portion of dragula's grab
    // function which can throw the error
    expect(() => {
      SkyAppTestUtility.fireDomEvent(document.querySelector('.sky-repeater-item-title'), 'mousedown', {
        customEventInit: {
        touches: ['foo']
      }});
      fixture.detectChanges();
      tick();
    }).not.toThrow();

    flushDropdownTimer();
  }));

  describe('with expand mode of "single"', () => {
    it('should collapse other items when an item is expanded', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBeFalsy();
      expect(repeaterItems[2].isExpanded).toBeFalsy();

      repeaterItems[1].isExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBeFalsy();
      expect(repeaterItems[1].isExpanded).toBe(true);
      expect(repeaterItems[2].isExpanded).toBeFalsy();

      flushDropdownTimer();
    }));

    it('should collapse other items when a new expanded item is added', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      cmp.removeLastItem = true;

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBe(false);

      cmp.removeLastItem = false;
      cmp.lastItemExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);
      expect(repeaterItems[1].isExpanded).toBe(false);
      expect(repeaterItems[2].isExpanded).toBe(true);

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'single';
      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(el.querySelector('sky-chevron').getAttribute('aria-expanded')).toBe('true');

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();
      fixture.detectChanges();
      tick();

      repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(false);
      expect(el.querySelector('sky-chevron').getAttribute('aria-expanded')).toBe('false');

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s chevron is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'single';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-chevron').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'single';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'single';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should emit events when item is expanded/collapsed', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp = fixture.componentInstance;
      cmp.expandMode = 'single';

      const collapseSpy = spyOn(cmp, 'onCollapse').and.callThrough();
      const expandSpy = spyOn(cmp, 'onExpand').and.callThrough();

      fixture.detectChanges();
      tick();

      collapseSpy.calls.reset();
      expandSpy.calls.reset();

      let repeaterItems = cmp.repeater.items.toArray();
      expect(repeaterItems[0].isExpanded).toBe(true);

      fixture.nativeElement.querySelectorAll('.sky-chevron').item(0).click();
      fixture.detectChanges();
      tick();

      expect(collapseSpy).toHaveBeenCalled();

      collapseSpy.calls.reset();
      expandSpy.calls.reset();

      fixture.nativeElement.querySelectorAll('.sky-chevron').item(0).click();
      fixture.detectChanges();
      tick();

      expect(expandSpy).toHaveBeenCalled();

      flushDropdownTimer();
    }));
  });

  describe('with expand mode of "multiple"', () => {
    it('should not collapse other items when an item is expanded', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      repeaterItems[0].isExpanded = true;
      repeaterItems[1].isExpanded = false;
      repeaterItems[2].isExpanded = false;

      fixture.detectChanges();

      repeaterItems[1].isExpanded = true;

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);
      expect(repeaterItems[1].isExpanded).toBe(true);
      expect(repeaterItems[2].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should toggle its collapsed state when an item\'s chevron is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-chevron').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'multiple';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'multiple';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with expand mode of "none"', () => {
    it(
      'should not allow items to be collapsed',
      fakeAsync(
        inject([SkyLogService], (mockLogService: MockLogService) => {
          let fixture = TestBed.createComponent(RepeaterTestComponent);
          let cmp: RepeaterTestComponent = fixture.componentInstance;

          cmp.expandMode = 'none';

          fixture.detectChanges();
          tick();

          let item = cmp.repeater.items.first;

          expect(item.isExpanded).toBe(true);

          let warnSpy = spyOn(mockLogService, 'warn');

          item.isExpanded = false;

          fixture.detectChanges();
          tick();

          item = cmp.repeater.items.first;

          expect(warnSpy).toHaveBeenCalled();

          expect(item.isExpanded).toBe(true);

          flushDropdownTimer();
        })
      ));

    it('should hide each item\'s chevron button', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement as Element;

      fixture.detectChanges();

      let chevronEls = el.querySelectorAll('.sky-repeater-item-chevron');
      expect(chevronEls.length).toBe(3);

      cmp.expandMode = 'none';
      fixture.detectChanges();

      tick();

      chevronEls = el.querySelectorAll('.sky-repeater-item-chevron');

      expect(chevronEls.length).toBe(0);

      flushDropdownTimer();
    }));

    it(
      'should expand all items when mode was previously set to "single" or "multiple"',
      fakeAsync(() => {
        let fixture = TestBed.createComponent(RepeaterTestComponent);
        let cmp: RepeaterTestComponent = fixture.componentInstance;

        cmp.expandMode = 'multiple';

        fixture.detectChanges();
        tick();

        let repeaterItems = cmp.repeater.items.toArray();

        for (let repeaterItem of repeaterItems) {
          repeaterItem.isExpanded = false;
        }

        fixture.detectChanges();
        tick();

        cmp.expandMode = 'none';

        fixture.detectChanges();
        tick();

        repeaterItems = cmp.repeater.items.toArray();

        for (let repeaterItem of repeaterItems) {
          expect(repeaterItem.isExpanded).toBe(true);
        }

        flushDropdownTimer();
      })
    );

    it('should not toggle its collapsed state when an item\'s header is clicked', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      cmp.expandMode = 'none';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isExpanded).toBe(true);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.expandMode = 'none';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'none';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with selectability "true"', () => {
    it('should add selected css class when selected', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      let el = fixture.nativeElement;

      fixture.detectChanges();
      tick();

      cmp.repeater.items.forEach(item => item.selectable = true);

      fixture.detectChanges();
      tick();

      let selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected') as NodeList;
      expect(selectedItemsEl.length).toBe(0);

      const repeaterItems = cmp.repeater.items.toArray();

      // Click to select first item.
      const items = getRepeaterItems(el);
      items[0].querySelector('input').click();

      fixture.detectChanges();
      tick();

      expect(repeaterItems[0].isSelected).toBe(true);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(false);

      selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected');
      expect(selectedItemsEl.length).toBe(1);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.repeater.items.forEach(item => item.selectable = true);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should update the isSelected property when the user clicks the checkbox', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let el = fixture.nativeElement;
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      // Make each repeater item selectable.
      cmp.repeater.items.toArray().forEach(item => item.selectable = true);
      fixture.detectChanges();
      const repeaterItems = cmp.repeater.items.toArray();
      const repeaterCheckboxes = el.querySelectorAll('sky-checkbox');

      // Click on last repeater item.
      repeaterCheckboxes[2].querySelector('input').click();
      fixture.detectChanges();
      tick();

      // Expect only last item to be selected, and input property (isSelected) to recieve new value.
      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);
      expect(cmp.lastItemSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should update the isSelected property when the user uses keyboard controls', fakeAsync(() => {
      let fixture = TestBed.createComponent(RepeaterTestComponent);
      let el = fixture.nativeElement;
      let cmp: RepeaterTestComponent = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      // Make each repeater item selectable.
      cmp.repeater.items.toArray().forEach(item => item.selectable = true);
      fixture.detectChanges();
      const repeaterItems = cmp.repeater.items.toArray();
      const itemElements = getRepeaterItems(el);

      // Click on last repeater item.
      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(itemElements[2], 'focus');
      SkyAppTestUtility.fireDomEvent(itemElements[2], 'keydown', {
        keyboardEventInit: {
          key: 'Enter'
        }
      });
      fixture.detectChanges();
      fixture.detectChanges();
      tick();

      // Expect only last item to be selected, and input property (isSelected) to recieve new value.
      expect(repeaterItems[0].isSelected).toBe(false);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(true);
      expect(cmp.lastItemSelected).toBe(true);

      flushDropdownTimer();
    }));
  });

  describe('with active index', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);
      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    it('should NOT show active item if activeIndex is set to undefined', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      detectChangesAndTick(fixture);

      const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toEqual(0);

      flushDropdownTimer();
    }));

    it('should update active item if activeIndex is programatically set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.activeIndex = 0;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      let activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      cmp.activeIndex = 2;
      fixture.detectChanges();

      activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);
      expect(items[2]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should deactivate all items if activeIndex is set to undefined', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.activeIndex = 2;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      let activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);
      expect(items[2]).toHaveCssClass('sky-repeater-item-active');

      cmp.activeIndex = undefined;
      fixture.detectChanges();

      activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(0);

      flushDropdownTimer();
    }));

    it('should update active item on click if activeIndex is set to undefined', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      items[0].click();
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should update active item on click if activeIndex is set to a number', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.activeIndex = 2;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      items[0].click();
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should update active item on enter key if activeIndex has been set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'Enter'
        }
      });
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should update active item on space key if activeIndex has been set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: ' '
        }
      });
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should NOT update active item on click if activeIndex has not been set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = false;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      items[0].click();
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toEqual(0);

      flushDropdownTimer();
    }));

    it('should emit activeIndex values as active index is changed', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);
      const emitterSpy = spyOnProperty(cmp, 'activeIndex', 'set').and.callThrough();

      items[0].click();
      fixture.detectChanges();

      expect(emitterSpy).toHaveBeenCalledTimes(1);
      expect(cmp.activeIndex).toEqual(0);

      flushDropdownTimer();
    }));

    it('should NOT emit activeIndex if new value is the same', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);
      const emitterSpy = spyOnProperty(cmp, 'activeIndex', 'set').and.callThrough();

      items[0].click();
      fixture.detectChanges();

      items[0].click();
      fixture.detectChanges();

      expect(emitterSpy).toHaveBeenCalledTimes(1);

      flushDropdownTimer();
    }));
  });

  describe('with inline-form', () => {
    let fixture: ComponentFixture<RepeaterInlineFormFixtureComponent>;
    let el: HTMLElement;
    let component: RepeaterInlineFormFixtureComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(RepeaterInlineFormFixtureComponent);
      el = fixture.nativeElement;
      component = fixture.componentInstance;
    });

    function showInlineForm(): void {
      component.showInlineForm = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }

    function getInlineForm(): HTMLElement {
      return el.querySelector('#inline-form-template') as HTMLElement;
    }

    it('should not add inline-form to the DOM by default', () => {
      const inlineForm = el.querySelector('#repeater-item-without-inline-form sky-inline-form');

      expect(inlineForm).toBeNull();
    });

    it('should not show inline-form template if showInlineForm is false', () => {
      const inlineForm = getInlineForm();

      expect(inlineForm).toBeNull();
    });

    it('should show inline-form template if showInlineForm is true', fakeAsync(() => {
      showInlineForm();
      const inlineForm = getInlineForm();

      expect(inlineForm).not.toBeNull();

      flushDropdownTimer();
    }));

    it('should show inline-form with custom buttons', async(() => {
      component.inlineFormConfig = {
        buttonLayout: SkyInlineFormButtonLayout.Custom,
        buttons: [
          { action: 'save', text: 'Foo', styleType: 'primary' },
          { action: 'delete', text: 'Bar', styleType: 'default' }
        ]
      };

      component.showInlineForm = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const buttons = el.querySelectorAll('.sky-inline-form-footer button') as NodeListOf<HTMLElement>;

        expect(buttons[0].innerText.trim()).toEqual('Foo');
        expect(buttons[1].innerText.trim()).toEqual('Bar');
      });
    }));

    it('should emit SkyInlineFormCloseArgs when inline form template is closed', async(() => {
      fixture.detectChanges();
      component.showInlineForm = true;
      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(component.inlineFormCloseArgs).toBeUndefined();
        const button = el.querySelector('.sky-inline-form-footer .sky-btn-primary') as HTMLElement;
        button.click();

        expect(component.inlineFormCloseArgs).not.toBeUndefined();
        expect(component.inlineFormCloseArgs.reason).toBe('done');
      });
    }));
  });

  it('with reorderability should show a console warning not all item tags are defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterWithMissingTagsFixtureComponent);
    const consoleSpy = spyOn(console, 'warn');
    detectChangesAndTick(fixture);
    expect(consoleSpy).toHaveBeenCalled();
  }));

  describe('dragula integration', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);
    });

    it('should set the repeater item\'s grab handle as the drag handle', fakeAsync(inject(
      [DragulaService],
      (dragulaService: DragulaService) => {
        let movesCallback: Function;
        let setOptionsSpy = spyOn(dragulaService, 'setOptions').and.callFake(
          (bagId: any, options: any) => {
            movesCallback = options.moves;
          }
        );

        fixture.componentInstance.reorderable = true;
        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        tick();

        const nativeElement = fixture.elementRef.nativeElement;
        const repeaterItem = nativeElement.querySelectorAll('sky-repeater-item')[1];
        const handle = getReorderHandles(nativeElement)[1];

        const result = movesCallback(
          repeaterItem,
          undefined,
          handle
        );

        expect(result).toBe(true);

        expect(setOptionsSpy).toHaveBeenCalled();

        flushDropdownTimer();
      }
    )));
  });

  describe('with reorderability', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;
    let mockDragulaService: DragulaService;
    let consoleSpy: jasmine.Spy;

    beforeEach(fakeAsync(() => {
      mockDragulaService = new MockDragulaService();

      fixture = TestBed
        .overrideComponent(SkyRepeaterComponent, {
          add: {
            viewProviders: [
              { provide: DragulaService, useValue: mockDragulaService }
            ]
          }
        }).createComponent(RepeaterTestComponent);
      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
      consoleSpy = spyOn(console, 'warn');

      fixture.detectChanges();
      cmp.reorderable = true;
      tick(); // Allow repeater-item.component to set tabindexes & render context dropdown.
      fixture.detectChanges();
    }));

    it('should not show a console warning if all item tags are defined', fakeAsync(() => {
      detectChangesAndTick(fixture);
      expect(consoleSpy).not.toHaveBeenCalled();
    }));

    it('should set newly added items to reorderable if repeater is reorderable', fakeAsync(() => {
      cmp.removeLastItem = true;

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems.length).toBe(2);
      repeaterItems.forEach(item => {
        expect(item.reorderable).toBe(true);
      });

      cmp.removeLastItem = false;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater.items.toArray();

      expect(repeaterItems.length).toBe(3);
      repeaterItems.forEach(item => {
        expect(item.reorderable).toBe(true);
      });
    }));

    it('should move an item to the top via the "Top" button', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      el.querySelectorAll('.sky-repeater-item-reorder-top')[1].click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should not move the top item via the "Top" button', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[0];
      el.querySelectorAll('.sky-repeater-item-reorder-top')[0].click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should update css classes correctly while dragging', fakeAsync(() => {
      const groupName = fixture.componentInstance.repeater.dragulaGroupName;
      let repeaterItem = el.querySelectorAll('sky-repeater-item')[1];
      mockDragulaService.drag.emit([groupName, repeaterItem]);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      repeaterItem = el.querySelectorAll('sky-repeater-item')[1];
      expect(repeaterItem.classList.contains('sky-repeater-item-dragging')).toBeTruthy();
      mockDragulaService.dragend.emit([groupName, repeaterItem]);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      repeaterItem = el.querySelectorAll('sky-repeater-item')[1];
      expect(repeaterItem.classList.contains('sky-repeater-item-dragging')).toBeFalsy();
    }));

    it('should move an item up via keyboard controls using "Space" to activate', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      reorderItemWithKey(fixture, 1, 'up');
      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should move an item up via keyboard controls using "Enter" to activate', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      reorderItemWithKey(fixture, 1, 'up', 'Enter');

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should move an item down via keyboard controls', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      reorderItemWithKey(fixture, 1, 'down');

      expect(el.querySelectorAll('sky-repeater-item')[2]).toBe(itemToTest);
    }));

    it('should not move an item down via keyboard controls if it is the last item', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[2];
      reorderItemWithKey(fixture, 2, 'down');
      expect(el.querySelectorAll('sky-repeater-item')[2]).toBe(itemToTest);
    }));

    it('should not move an item when the left and right arrows are received keyboard controls', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowLeft' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowRight' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should not move an item up via keyboard controls if the blur event is received', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'blur');
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowUp' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should turn off reordering when escape is hit', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'Escape' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowUp' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should revert any reordering up when escape is hit', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowUp' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'Escape' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should revert any reordering down when escape is hit', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowDown' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'Escape' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[2]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it(`should set focus on the next item when the arrowDown key is pressed
      on the reorder handle while reording is not enabled`, fakeAsync(() => {
      let items = getRepeaterItems(el);
      const dragHandles = getReorderHandles(el);

      // Focus on first item, and press right key. Expect focus to be on the first drag handle.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });
      fixture.detectChanges();
      tick();
      expect(document.activeElement).toBe(dragHandles[0]);

      // Press down key. Expect focus to go to next item.
      SkyAppTestUtility.fireDomEvent(dragHandles[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowDown'
        }
      });
      fixture.detectChanges();
      tick();
      expect(document.activeElement).toBe(items[1]);

      // Press down key on last item. Expect focus to remain.
      const lastDragHandle = dragHandles[dragHandles.length - 1];
      SkyAppTestUtility.fireDomEvent(lastDragHandle, 'keydown', {
        keyboardEventInit: {
          key: 'DOWN' // IE 11
        }
      });
      lastDragHandle.focus();
      fixture.detectChanges();
      tick();
      expect(document.activeElement).toBe(lastDragHandle);
    }));

    it(`should set focus on the previous item when the arrowUp key is pressed
      on the reorder handle while reording is not enabled`, fakeAsync(() => {
      let items = getRepeaterItems(el);
      const dragHandles = getReorderHandles(el);

      // Focus on second item. Press right key. Expect focus to go to drag handle.
      SkyAppTestUtility.fireDomEvent(items[1], 'focus');
      SkyAppTestUtility.fireDomEvent(items[1], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });
      expect(document.activeElement).toBe(dragHandles[1]);

      // Press up key. Expect focus to go back to first item.
      SkyAppTestUtility.fireDomEvent(dragHandles[1], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowUp'
        }
      });
      expect(document.activeElement).toBe(items[0]);

      // Press up key on first item. Expect focus to remain.
      const firstDragHandle = dragHandles[0];
      SkyAppTestUtility.fireDomEvent(firstDragHandle, 'keydown', {
        keyboardEventInit: {
          key: 'UP' // IE 11
        }
      });
      firstDragHandle.focus();
      fixture.detectChanges();
      tick();
      expect(document.activeElement).toBe(firstDragHandle);
    }));

    it(`should set focus on the next child item when the arrowRight key is pressed
      on the reorder handle while reording is not enabled`, fakeAsync(() => {
      let items = getRepeaterItems(el);
      const dragHandles = getReorderHandles(el);
      const topLinks = el.querySelectorAll('.sky-repeater-item-reorder-top');

      // Focus on first item, and press right key. Expect focus to be on the first drag handle.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });
      expect(document.activeElement).toBe(dragHandles[0]);

      // Press right key. Expect focus to be on next child item.
      SkyAppTestUtility.fireDomEvent(dragHandles[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });

      expect(document.activeElement).toBe(topLinks[0]);
    }));

    it(`should set focus on the parent item when the arrowLeft key is pressed
      on the reorder handle while reording is not enabled`, fakeAsync(() => {
      let items = getRepeaterItems(el);
      const dragHandles = getReorderHandles(el);

      // Focus on first item, and press right key. Expect focus to be on the first drag handle.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });
      expect(document.activeElement).toBe(dragHandles[0]);

      // Press right key. Expect focus to be on next child item.
      SkyAppTestUtility.fireDomEvent(dragHandles[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });

      expect(document.activeElement).toBe(items[0]);
    }));

    it(`should retain focus on child item when a repeater item is clicked and
    keyboard navigation should start from there`, fakeAsync(() => {
      const topLinks = el.querySelectorAll('.sky-repeater-item-reorder-top');
      const items = getRepeaterItems(el);
      const dragHandles = getReorderHandles(el);

      // Focus on first item, and press right key. Expect focus to be on the first drag handle.
      dragHandles[0].click();
      dragHandles[0].focus();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(document.activeElement).toBe(dragHandles[0]);
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowRight'
        }
      });
      expect(document.activeElement).toBe(topLinks[0]);

      // Press right key. Expect focus to be on next child item.
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'ArrowLeft'
        }
      });

      expect(document.activeElement).toBe(items[0]);
    }));

    it('should emit tags when "move to top" is clicked', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      el.querySelectorAll('.sky-repeater-item-reorder-top')[2].click();
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toEqual([ 'item3', 'item1', 'item2' ]);

      flushDropdownTimer();
    }));

    it('should emit tags when keyboard controls are used to reorder', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      reorderItemWithKey(fixture, 1, 'down');
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toEqual([ 'item1', 'item3', 'item2' ]);

      reorderItemWithKey(fixture, 2, 'up');

      expect(cmp.sortedItemTags).toEqual([ 'item1', 'item2', 'item3' ]);

      flushDropdownTimer();
    }));

    it('should emit tags when item is dragged to reorder', fakeAsync(() => {
      cmp.reorderable = true;
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      const groupName = fixture.componentInstance.repeater.dragulaGroupName;
      let repeaterItem: HTMLElement = el.querySelectorAll('sky-repeater-item')[0];
      mockDragulaService.drag.emit([groupName, repeaterItem]);
      detectChangesAndTick(fixture);
      const repeaterDiv: HTMLElement = fixture.nativeElement.querySelector('.sky-repeater');

      repeaterDiv.removeChild(repeaterItem);
      const nextSibling = repeaterDiv.querySelectorAll('sky-repeater-item')[2];

      repeaterDiv.insertBefore(repeaterItem, nextSibling);
      mockDragulaService.dragend.emit([groupName, repeaterItem]);
      detectChangesAndTick(fixture);
      expect(cmp.sortedItemTags).toEqual(['item2', 'item3', 'item1']);
    }));

    xit('should add new items to the bottom of the repeater after reordering', fakeAsync(() => {
      detectChangesAndTick(fixture);
      // let repeaterItems = cmp.repeater.items.toArray();

      expect(cmp.sortedItemTags).toBeUndefined();

      // Reorder items and add a new one.
      el.querySelectorAll('.sky-repeater-item-reorder-top')[2].click();
      cmp.addItem();
      detectChangesAndTick(fixture);

      // Expect new item to be added to the bottom.
      expect(cmp.sortedItemTags).toEqual([ 'item2', 'item1', 'item3' ]);

      flushDropdownTimer();
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('with async repeater items', () => {
    let fixture: ComponentFixture<RepeaterAsyncItemsTestComponent>;
    let cmp: RepeaterAsyncItemsTestComponent;
    let el: any;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(RepeaterAsyncItemsTestComponent);
      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
    }));

    it('should show active repeater item when activeIndex is set', fakeAsync(() => {
      cmp.activeIndex = 1;
      fixture.detectChanges();
      tick(1000); // Wait for async items to load.
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      setTimeout(() => {
        const activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
        expect(activeRepeaterItem.length).toEqual(1);
      });

      fixture.destroy();
      flush();
    }));
  });
});
