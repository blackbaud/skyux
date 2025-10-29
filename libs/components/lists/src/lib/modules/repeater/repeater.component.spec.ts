import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService, SkyScrollableHostService } from '@skyux/core';
import { SkyInlineFormButtonLayout } from '@skyux/inline-form';

import { DragulaService, Group } from 'ng2-dragula';

import { A11yRepeaterItem } from './fixtures/a11y-repeater-item';
import { A11yRepeaterTestComponent } from './fixtures/a11y-repeater.component.fixture';
import { MockDragulaService } from './fixtures/mock-dragula.service';
import { NestedRepeaterTestComponent } from './fixtures/nested-repeater.component.fixture';
import { RepeaterAsyncItemsTestComponent } from './fixtures/repeater-async-items.component.fixture';
import { SkyRepeaterFixturesModule } from './fixtures/repeater-fixtures.module';
import { RepeaterInlineFormFixtureComponent } from './fixtures/repeater-inline-form.component.fixture';
import { RepeaterWithMissingTagsFixtureComponent } from './fixtures/repeater-missing-tag.fixture';
import { RepeaterTestComponent } from './fixtures/repeater.component.fixture';
import { SkyRepeaterAutoScrollService } from './repeater-auto-scroll.service';
import { SkyRepeaterExpandModeType } from './repeater-expand-mode-type';
import { SkyRepeaterComponent } from './repeater.component';
import { SkyRepeaterService } from './repeater.service';

describe('Repeater item component', () => {
  // #region helpers
  function flushDropdownTimer(): void {
    flush();
  }

  function detectChangesAndTick(fixture: ComponentFixture<any>): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getRepeaterItems(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll('.sky-repeater-item');
  }

  function getContextMenuButtons(
    el: HTMLElement,
  ): NodeListOf<HTMLButtonElement> {
    return el.querySelectorAll('.sky-dropdown-button');
  }

  function getReorderHandles(el: HTMLElement): NodeListOf<HTMLElement> {
    return el.querySelectorAll(
      '.sky-repeater-item .sky-repeater-item-grab-handle',
    );
  }

  function getChevronButtons(el: HTMLElement): NodeListOf<HTMLButtonElement> {
    return el.querySelectorAll('.sky-repeater-item sky-chevron button');
  }

  function getReorderTopButtons(
    el: HTMLElement,
  ): NodeListOf<HTMLButtonElement> {
    return el.querySelectorAll(
      '.sky-repeater-item .sky-repeater-item-reorder-top',
    );
  }

  function getCheckboxes(el: HTMLElement): NodeListOf<HTMLButtonElement> {
    return el.querySelectorAll('.sky-repeater-item .sky-checkbox-input');
  }

  function reorderItemWithKey(
    fixture: ComponentFixture<any>,
    itemIndex: number,
    direction: 'up' | 'down',
    activationKey = ' ',
  ): void {
    let key: string | undefined;
    if (direction === 'up') {
      key = 'arrowUp';
    } else if (direction === 'down') {
      key = 'arrowDown';
    }
    const itemDragHandle = getReorderHandles(fixture.nativeElement)[itemIndex];
    SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
      keyboardEventInit: { key: activationKey },
    });
    fixture.detectChanges();
    SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
      keyboardEventInit: { key: key },
    });
    fixture.detectChanges();
    SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
      keyboardEventInit: { key: activationKey },
    });
    fixture.detectChanges();
  }

  function getItems(fixture: ComponentFixture<any>): HTMLElement[] {
    return fixture.nativeElement.querySelectorAll('.sky-repeater-item');
  }

  function validateDeprecatedCalled(
    deprecatedSpy: jasmine.Spy,
    expected: boolean,
  ): void {
    if (expected) {
      expect(deprecatedSpy).toHaveBeenCalledWith(
        'SkyRepeaterItemComponent without `itemName`',
        {
          deprecationMajorVersion: 8,
          replacementRecommendation: 'Always specify an `itemName` property.',
        },
      );
    } else {
      expect(deprecatedSpy).not.toHaveBeenCalledWith(
        'SkyRepeaterItemComponent without `itemName`',
        {
          deprecationMajorVersion: 8,
          replacementRecommendation: 'Always specify an `itemName` property.',
        },
      );
    }
  }

  function validateRepeaterItemOrder(
    fixture: ComponentFixture<RepeaterTestComponent>,
    firstItemTag: string,
  ): void {
    const cmp = fixture.componentInstance;
    const repeaterSvc = fixture.debugElement
      .query(By.css('sky-repeater'))
      .injector.get(SkyRepeaterService);

    const repeaterItems = cmp.repeater?.items?.toArray();

    expect(repeaterItems).not.toBeUndefined();

    if (repeaterItems) {
      expect(repeaterSvc.items).toEqual(repeaterItems);
      expect(repeaterItems[0].tag).toEqual(firstItemTag);
      expect(repeaterSvc.items[0].tag).toEqual(firstItemTag);
    }
  }
  // #endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyRepeaterFixturesModule],
    });
  });

  it('should default expand mode to "none" when no expand mode is specified', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    const cmp: RepeaterTestComponent = fixture.componentInstance;
    cmp.expandMode = undefined;

    fixture.detectChanges();

    tick();

    expect(cmp.repeater?.expandMode).toBe('none');

    flushDropdownTimer();
  }));

  it('should allow removing all items dynamically', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    const el = fixture.nativeElement;
    const cmp: RepeaterTestComponent = fixture.componentInstance;
    cmp.showRepeaterWithNgFor = true;
    cmp.expandMode = 'none';

    fixture.detectChanges();

    tick();

    cmp.items = [];
    fixture.detectChanges();
    tick();

    expect(el.querySelectorAll('sky-repeater-item').length).toBe(0);
    flushDropdownTimer();
  }));

  it('should update the repeater service items and their order items dynamically changed', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    const cmp = fixture.componentInstance;

    cmp.showRepeaterWithNgFor = true;
    detectChangesAndTick(fixture);

    validateRepeaterItemOrder(fixture, 'item1');

    cmp.items = [
      {
        id: 'item3',
        title: 'Item 3',
      },
      {
        id: 'item2',
        title: 'Item 2',
      },
      {
        id: 'item1',
        title: 'Item 1',
      },
    ];

    detectChangesAndTick(fixture);

    validateRepeaterItemOrder(fixture, 'item3');
  }));

  it('should have aria-control set pointed at content', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    const el = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    const repeaterItemContent = el.querySelector('.sky-repeater-item-content');

    expect(getChevronButtons(el)[0].getAttribute('aria-controls')).toBe(
      repeaterItemContent.getAttribute('id'),
    );

    flushDropdownTimer();
  }));

  it('should create default aria labels when itemName is not defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.selectable = true;
    fixture.componentInstance.reorderable = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    const el = fixture.nativeElement;

    const reorderHandles = getReorderHandles(el);
    const checkboxes = getCheckboxes(el);
    const reorderTopButtons = getReorderTopButtons(el);
    const expandButtons = getChevronButtons(el);

    expect(reorderHandles[0].getAttribute('aria-label')).toEqual('Reorder');
    expect(checkboxes[0].getAttribute('aria-label')).toEqual('Select row');
    expect(reorderTopButtons[0].getAttribute('aria-label')).toEqual(
      'Move to top',
    );
    expect(expandButtons[0].getAttribute('aria-label')).toEqual('Expand');
    expect(expandButtons[1].getAttribute('aria-label')).toEqual('Collapse');
  }));

  it('should warn when itemName is not defined', fakeAsync(() => {
    const logSvc = TestBed.inject(SkyLogService);
    const deprecatedSpy = spyOn(logSvc, 'deprecated');
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.selectable = true;
    fixture.componentInstance.reorderable = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    validateDeprecatedCalled(deprecatedSpy, true);
  }));

  it('should warn when itemName is unset after initial render', fakeAsync(() => {
    const logSvc = TestBed.inject(SkyLogService);
    const deprecatedSpy = spyOn(logSvc, 'deprecated');
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showItemName = true; // Show item name to remove default labels
    fixture.componentInstance.selectable = true;
    fixture.componentInstance.reorderable = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    validateDeprecatedCalled(deprecatedSpy, false);

    fixture.componentInstance.showItemName = false;

    fixture.detectChanges();
    tick();

    validateDeprecatedCalled(deprecatedSpy, true);
  }));

  it('should create aria labels when itemName is defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showItemName = true; // Show item name to remove default labels
    fixture.componentInstance.selectable = true;
    fixture.componentInstance.reorderable = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    const el = fixture.nativeElement;

    const reorderHandles = getReorderHandles(el);
    const checkboxes = getCheckboxes(el);
    const reorderTopButtons = getReorderTopButtons(el);
    const expandButtons = getChevronButtons(el);

    expect(reorderHandles[0].getAttribute('aria-label')).toEqual(
      'Reorder Item 1',
    );
    expect(checkboxes[0].getAttribute('aria-label')).toEqual('Select Item 1');
    expect(reorderTopButtons[0].getAttribute('aria-label')).toEqual(
      'Move Item 1 to top',
    );
    expect(expandButtons[0].getAttribute('aria-label')).toEqual(
      'Expand Item 1',
    );
    expect(expandButtons[1].getAttribute('aria-label')).toEqual(
      'Collapse Item 2',
    );
  }));

  it('should set the context menu aria label to the default with itemName when given', async () => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showContextMenu = true;
    fixture.componentInstance.showItemName = true; // Show item name to remove default labels
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement;

    const contextMenus = getContextMenuButtons(el);

    expect(contextMenus[0].getAttribute('aria-label')).toEqual(
      'Context menu for Item 1',
    );
    expect(contextMenus[1].getAttribute('aria-label')).toEqual(
      'Context menu for Item 2',
    );
  });

  it('should set the context menu aria label to the default with the item title when no itemName is given', async () => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showContextMenu = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement;

    const contextMenus = getContextMenuButtons(el);

    expect(contextMenus[0].getAttribute('aria-label')).toBeNull();
    expect(contextMenus[1].getAttribute('aria-label')).toBeNull();
    expect(contextMenus[0].getAttribute('aria-labelledby')).toMatch(
      /(sky-id-gen__[0-9]{13}__[0-9]+\s*){2}/,
    );
    expect(contextMenus[1].getAttribute('aria-labelledby')).toMatch(
      /(sky-id-gen__[0-9]{13}__[0-9]+\s*){2}/,
    );
  });

  it('should set the context menu aria label to the default with no other information if no title or itemName are given', async () => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showContextMenu = true;
    fixture.componentInstance.showItemWithNoTitle = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;

    const contextMenus = getContextMenuButtons(el);

    expect(contextMenus[3].getAttribute('aria-label')).toEqual('Context menu');
  });

  it('should not have aria-selected attribute when item is not selectable', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.selectable = undefined;
    fixture.detectChanges();
    tick();

    const repeaterEls = getRepeaterItems(fixture.nativeElement);

    expect(repeaterEls[0].getAttribute('aria-selected')).toBeNull();
    expect(repeaterEls[1].getAttribute('aria-selected')).toBeNull();
    expect(repeaterEls[2].getAttribute('aria-selected')).toBeNull();
  }));

  it('should set aria-selected when items are selected', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.selectable = true;
    fixture.componentInstance.lastItemSelected = true;

    fixture.detectChanges();
    tick();

    const repeaterEls = getRepeaterItems(fixture.nativeElement);

    expect(repeaterEls[0].getAttribute('aria-selected')).toBe('false');
    expect(repeaterEls[1].getAttribute('aria-selected')).toBe('false');
    expect(repeaterEls[2].getAttribute('aria-selected')).toBe('true');
  }));

  it('should blur item when item is disabled', async () => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);

    fixture.detectChanges();

    await fixture.whenStable();

    fixture.nativeElement.querySelector('sky-repeater-item-content a').focus();

    expect(
      fixture.nativeElement
        .querySelector('sky-repeater')
        .matches(':focus-within'),
    ).toBeTruthy();

    fixture.componentInstance.disableFirstItem = true;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      fixture.nativeElement
        .querySelector('sky-repeater')
        .matches(':focus-within'),
    ).toBeFalsy();
  });

  it('should hide the chevron and disable expand/collapse for items with no content', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showItemWithNoContent = true;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const itemWithNoContent =
      fixture.nativeElement.querySelectorAll('sky-repeater-item')[3];
    expect(getChevronButtons(itemWithNoContent)[0]).not.toExist();
  }));

  it('should show/hide the chevron for dynamically added and removed content', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.componentInstance.showItemWithNoContent = true;
    fixture.componentInstance.showDynamicContent = true;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const itemWithNoContent =
      fixture.nativeElement.querySelectorAll('sky-repeater-item')[3];
    expect(getChevronButtons(itemWithNoContent)[0]).toExist();

    fixture.componentInstance.showDynamicContent = false;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(getChevronButtons(itemWithNoContent)[0]).not.toExist();
  }));

  it('should be accessible', async () => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should not error when a non-reorderable repeater is interacted with', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);

    fixture.detectChanges();
    tick();

    // NOTE: This complicated setup is to ensure that we get to the portion of dragula's grab
    // function which can throw the error
    expect(() => {
      SkyAppTestUtility.fireDomEvent(
        document.querySelector('.sky-repeater-item-title'),
        'mousedown',
        {
          customEventInit: {
            touches: ['foo'],
          },
        },
      );
      fixture.detectChanges();
      tick();
    }).not.toThrow();

    flushDropdownTimer();
  }));

  it('should remove repeater item from tab order when not selectable', fakeAsync(() => {
    const fixture = TestBed.createComponent(RepeaterTestComponent);
    const component = fixture.componentInstance;
    component.selectable = false;

    fixture.detectChanges();
    tick();

    const repeaterItems = component.repeater?.items?.toArray() || [];
    for (const item of repeaterItems) {
      expect(item.tabindex).toBe(-1);
    }
  }));

  describe('with expand mode of "single"', () => {
    it('should disabled collapse animations on initial render', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      fixture.detectChanges();

      tick();

      const repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].animationDisabled).toBeTrue();
      expect(repeaterItems?.[1].animationDisabled).toBeTrue();
      expect(repeaterItems?.[2].animationDisabled).toBeTrue();

      flushDropdownTimer();
    }));

    it('should collapse other items when an item is expanded', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);
      expect(repeaterItems?.[1].isExpanded).toBeFalsy();
      expect(repeaterItems?.[2].isExpanded).toBeFalsy();

      if (repeaterItems) {
        repeaterItems[1].isExpanded = true;
      }

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBeFalsy();
      expect(repeaterItems?.[1].isExpanded).toBe(true);
      expect(repeaterItems?.[2].isExpanded).toBeFalsy();

      flushDropdownTimer();
    }));

    it('should collapse other items when a new expanded item is added', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'single';
      cmp.removeLastItem = true;

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);
      expect(repeaterItems?.[1].isExpanded).toBe(false);

      cmp.removeLastItem = false;
      cmp.lastItemExpanded = true;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(false);
      expect(repeaterItems?.[1].isExpanded).toBe(false);
      expect(repeaterItems?.[2].isExpanded).toBe(true);

      // Validate that animation was enabled on the item that was collapsed.
      expect(repeaterItems?.[0].animationDisabled).toBeFalse();

      flushDropdownTimer();
    }));

    it("should toggle its collapsed state when an item's header is clicked", fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.expandMode = 'single';
      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();
      const chevronButton = getChevronButtons(el)[0];
      expect(repeaterItems?.[0].isExpanded).toBe(true);
      expect(chevronButton.getAttribute('aria-expanded')).toBe('true');

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();
      fixture.detectChanges();
      tick();

      repeaterItems = cmp.repeater?.items?.toArray();
      expect(repeaterItems?.[0].isExpanded).toBe(false);
      expect(chevronButton.getAttribute('aria-expanded')).toBe('false');

      flushDropdownTimer();
    }));

    it("should toggle its collapsed state when an item's chevron is clicked", fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.expandMode = 'single';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);

      getChevronButtons(el)[0].click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.selectable = true;
      cmp.expandMode = 'single';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      const repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isSelected).toBeFalsy();
      expect(repeaterItems?.[1].isSelected).toBeFalsy();
      expect(repeaterItems?.[2].isSelected).toBeTrue();

      flushDropdownTimer();
    }));

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'single';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should emit events when item is expanded/collapsed', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp = fixture.componentInstance;
      const el = fixture.debugElement.nativeElement;
      cmp.expandMode = 'single';

      const collapseSpy = spyOn(cmp, 'onCollapse').and.callThrough();
      const expandSpy = spyOn(cmp, 'onExpand').and.callThrough();

      fixture.detectChanges();
      tick();

      collapseSpy.calls.reset();
      expandSpy.calls.reset();

      const repeaterItems = cmp.repeater?.items?.toArray();
      expect(repeaterItems?.[0].isExpanded).toBe(true);

      getChevronButtons(el).item(0).click();
      fixture.detectChanges();
      tick();

      expect(collapseSpy).toHaveBeenCalled();

      collapseSpy.calls.reset();
      expandSpy.calls.reset();

      getChevronButtons(el).item(0).click();
      fixture.detectChanges();
      tick();

      expect(expandSpy).toHaveBeenCalled();

      flushDropdownTimer();
    }));
  });

  describe('with expand mode of "multiple"', () => {
    it('should not collapse other items when an item is expanded', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();
      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      if (repeaterItems) {
        repeaterItems[0].isExpanded = true;
        repeaterItems[1].isExpanded = false;
        repeaterItems[2].isExpanded = false;
      }

      fixture.detectChanges();

      if (repeaterItems) {
        repeaterItems[1].isExpanded = true;
      }

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);
      expect(repeaterItems?.[1].isExpanded).toBe(true);
      expect(repeaterItems?.[2].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it("should toggle its collapsed state when an item's header is clicked", fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it("should toggle its collapsed state when an item's chevron is clicked", fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);

      getChevronButtons(el).item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(false);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.selectable = true;
      cmp.expandMode = 'multiple';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      const repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isSelected).toBeFalsy();
      expect(repeaterItems?.[1].isSelected).toBeFalsy();
      expect(repeaterItems?.[2].isSelected).toBeTrue();

      flushDropdownTimer();
    }));

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.expandMode = 'multiple';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('with expand mode of "none"', () => {
    it('should not allow items to be collapsed', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'none';

      fixture.detectChanges();
      tick();

      let item = cmp.repeater?.items?.first;

      expect(item?.isExpanded).toBe(true);

      const warnSpy = spyOn(console, 'warn');

      if (item) {
        item.isExpanded = false;
      }

      fixture.detectChanges();
      tick();

      item = cmp.repeater?.items?.first;

      expect(warnSpy).toHaveBeenCalled();

      expect(item?.isExpanded).toBe(true);

      flushDropdownTimer();
    }));

    it("should hide each item's chevron button", fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      fixture.detectChanges();

      let chevronEls = getChevronButtons(el);
      expect(chevronEls.length).toBe(3);

      cmp.expandMode = 'none';
      fixture.detectChanges();

      tick();

      chevronEls = getChevronButtons(el);

      expect(chevronEls.length).toBe(0);

      flushDropdownTimer();
    }));

    it('should expand all items when mode was previously set to "single" or "multiple"', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;

      cmp.expandMode = 'multiple';

      fixture.detectChanges();
      tick();

      cmp.repeater?.items?.forEach((item) => (item.isExpanded = false));

      fixture.detectChanges();
      tick();

      cmp.expandMode = 'none';

      fixture.detectChanges();
      tick();

      const repeaterItems = cmp.repeater?.items?.toArray();

      if (repeaterItems) {
        for (const repeaterItem of repeaterItems) {
          expect(repeaterItem.isExpanded).toBe(true);
        }
      } else {
        fail('Repeater items did not exist.');
      }

      flushDropdownTimer();
    }));

    it("should not toggle its collapsed state when an item's header is clicked", fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.expandMode = 'none';

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);

      el.querySelectorAll('.sky-repeater-item-title').item(0).click();

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isExpanded).toBe(true);

      flushDropdownTimer();
    }));

    it('should select items based on input', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      cmp.selectable = true;
      cmp.expandMode = 'none';
      cmp.lastItemSelected = true;

      fixture.detectChanges();
      tick();

      const repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.[0].isSelected).toBeFalsy();
      expect(repeaterItems?.[1].isSelected).toBeFalsy();
      expect(repeaterItems?.[2].isSelected).toBeTrue();

      flushDropdownTimer();
    }));

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.componentInstance.expandMode = 'none';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('with selectable "true"', () => {
    it('should add selected css class when selected', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();

      cmp.repeater?.items?.forEach((item) => (item.selectable = true));

      fixture.detectChanges();
      tick();

      let selectedItemsEl = el.querySelectorAll(
        '.sky-repeater-item-selected',
      ) as NodeList;
      expect(selectedItemsEl.length).toBe(0);

      const repeaterItems = cmp.repeater?.items?.toArray();

      // Click to select first item.
      const items = getRepeaterItems(el);
      items[0].querySelector('input')?.click();

      fixture.detectChanges();
      tick();

      expect(repeaterItems?.[0].isSelected).toBeTrue();
      expect(repeaterItems?.[1].isSelected).toBeFalsy();
      expect(repeaterItems?.[2].isSelected).toBeFalsy();

      selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected');
      expect(selectedItemsEl.length).toBe(1);

      flushDropdownTimer();
    }));

    it('should be accessible', async () => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.componentInstance.showRepeaterWithNgFor = true;
      fixture.componentInstance.selectable = true;
      fixture.componentInstance.expandMode = 'none';

      // Detect selectable change.
      fixture.detectChanges();
      await fixture.whenStable();
      // Selectable change updates roles.
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();

      // Confirm elements are using appropriate roles.
      const repeaterEl = fixture.nativeElement.querySelector('.sky-repeater');
      expect(repeaterEl.getAttribute('role')).toEqual('grid');
      expect(
        repeaterEl
          .querySelector('sky-repeater-item:first-child > .sky-repeater-item')
          .getAttribute('role'),
      ).toEqual('row');
    });

    it('should update the isSelected property when the user clicks the checkbox', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const el = fixture.nativeElement;
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      // Make each repeater item selectable.
      cmp.repeater?.items
        ?.toArray()
        .forEach((item) => (item.selectable = true));
      fixture.detectChanges();
      const repeaterItems = cmp.repeater?.items?.toArray();
      const repeaterCheckboxes = el.querySelectorAll('sky-checkbox');

      // Click on last repeater item.
      repeaterCheckboxes[2].querySelector('input').click();
      fixture.detectChanges();
      tick();

      // Expect only last item to be selected, and input property (isSelected) to receive new value.
      expect(repeaterItems?.[0].isSelected).toBeFalsy();
      expect(repeaterItems?.[1].isSelected).toBeFalsy();
      expect(repeaterItems?.[2].isSelected).toBeTrue();
      expect(cmp.lastItemSelected).toBe(true);

      flushDropdownTimer();
    }));

    it('should select item with space and enter keys when selectable is set to true', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp: RepeaterTestComponent = fixture.componentInstance;
      const el = fixture.nativeElement;

      fixture.detectChanges();
      tick();
      cmp.selectable = true;
      fixture.detectChanges();

      const items = getRepeaterItems(el);

      const isSelectedChangeSpy = spyOn(
        cmp,
        'onIsSelectedChange',
      ).and.callThrough();

      // Expect first item NOT to be selected.
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-selected');

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'Enter',
        },
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
          key: ' ',
        },
      });
      fixture.detectChanges();

      // Expect first item NOT to be selected.
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-selected');
      // Expect the isSelectedChange event to have been called with 'false'.
      expect(isSelectedChangeSpy).toHaveBeenCalledWith(false);
      // Expect the event to have occurred twice.
      expect(isSelectedChangeSpy).toHaveBeenCalledTimes(1);
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
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);

      const activeRepeaterItem = el.querySelectorAll(
        '.sky-repeater-item-active',
      );
      expect(activeRepeaterItem.length).toEqual(0);

      flushDropdownTimer();
    }));

    it('should update active item if activeIndex is programmatically set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
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
      cmp.expandMode = 'none';
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
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      items[0].click();
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll(
        '.sky-repeater-item-active',
      );
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should update active item on click if activeIndex is set to a number', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      cmp.activeIndex = 2;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      items[0].click();
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll(
        '.sky-repeater-item-active',
      );
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should NOT update active item on click if activeIndex has not been set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = false;
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);

      items[0].click();
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll(
        '.sky-repeater-item-active',
      );
      expect(activeRepeaterItem.length).toEqual(0);

      flushDropdownTimer();
    }));

    it('should emit activeIndex values as active index is changed', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);
      const emitterSpy = spyOnProperty(
        cmp,
        'activeIndex',
        'set',
      ).and.callThrough();

      items[0].click();
      fixture.detectChanges();

      expect(emitterSpy).toHaveBeenCalledTimes(1);
      expect(cmp.activeIndex).toEqual(0);

      flushDropdownTimer();
    }));

    it('should NOT emit activeIndex if new value is the same', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);
      const emitterSpy = spyOnProperty(
        cmp,
        'activeIndex',
        'set',
      ).and.callThrough();

      items[0].click();
      fixture.detectChanges();

      items[0].click();
      fixture.detectChanges();

      expect(emitterSpy).toHaveBeenCalledTimes(1);

      flushDropdownTimer();
    }));

    it('should update active item on enter key if activeIndex has been set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);
      const items = getItems(fixture);

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: 'Enter',
        },
      });
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll(
        '.sky-repeater-item-active',
      );
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should update active item on space key if activeIndex has been set', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      detectChangesAndTick(fixture);
      const items = getItems(fixture);

      // Focus on first repeater item and press enter key.
      SkyAppTestUtility.fireDomEvent(items[0], 'focus');
      SkyAppTestUtility.fireDomEvent(items[0], 'keydown', {
        keyboardEventInit: {
          key: ' ',
        },
      });
      fixture.detectChanges();

      const activeRepeaterItem = el.querySelectorAll(
        '.sky-repeater-item-active',
      );
      expect(activeRepeaterItem.length).toEqual(1);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should clear active item if the item is disabled', fakeAsync(() => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      cmp.activeIndex = 0;
      detectChangesAndTick(fixture);
      const items = getRepeaterItems(el);
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      cmp.disableFirstItem = true;
      fixture.detectChanges();
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-active');

      cmp.disableFirstItem = false;
      fixture.detectChanges();
      expect(items[0]).not.toHaveCssClass('sky-repeater-item-active');

      flushDropdownTimer();
    }));

    it('should be accessible', async () => {
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      cmp.activeIndex = 0;

      // Detect active index.
      fixture.detectChanges();
      await fixture.whenStable();

      // Role changes on next cycle.
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
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
      const inlineForm = el.querySelector(
        '#repeater-item-without-inline-form sky-inline-form',
      );

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

    it('should show inline-form with custom buttons', async () => {
      component.inlineFormConfig = {
        buttonLayout: SkyInlineFormButtonLayout.Custom,
        buttons: [
          { action: 'save', text: 'Foo', styleType: 'primary' },
          { action: 'delete', text: 'Bar', styleType: 'default' },
        ],
      };

      component.showInlineForm = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const buttons = el.querySelectorAll(
        '.sky-inline-form-footer button',
      ) as NodeListOf<HTMLElement>;

      expect(buttons[0].innerText.trim()).toEqual('Foo');
      expect(buttons[1].innerText.trim()).toEqual('Bar');
    });

    it('should emit SkyInlineFormCloseArgs when inline form template is closed', async () => {
      fixture.detectChanges();
      component.showInlineForm = true;
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.inlineFormCloseArgs).toBeUndefined();
      const button = el.querySelector(
        '.sky-inline-form-footer .sky-btn-primary',
      ) as HTMLElement;
      button.click();

      expect(component.inlineFormCloseArgs).not.toBeUndefined();
      expect(component.inlineFormCloseArgs?.reason).toBe('done');
    });

    it('should be accessible', async () => {
      component.showInlineForm = true;
      // Show inline form.
      fixture.detectChanges();
      await fixture.whenStable();
      // Role changes on next cycle.
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  it('with reorderability should show a console warning not all item tags are defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(
      RepeaterWithMissingTagsFixtureComponent,
    );
    const logService = TestBed.inject(SkyLogService);
    const logServiceSpy = spyOn(logService, 'warn');
    detectChangesAndTick(fixture);
    expect(logServiceSpy).toHaveBeenCalled();
  }));

  describe('dragula integration', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;

    it("should set the repeater item's grab handle as the drag handle", fakeAsync(
      inject([DragulaService], (dragulaService: DragulaService) => {
        let movesCallback:
          | ((
              el?: Element,
              container?: Element,
              handle?: Element,
              sibling?: Element,
            ) => boolean)
          | undefined;

        let counter = 0;
        spyOn(dragulaService, 'find').and.callFake(() => {
          // Ignore the first call to 'find' (called in the repeater component),
          // we only want to mock out ng2-dragula's internal call.
          if (++counter === 1) {
            return undefined as unknown as Group;
          }

          return {
            drake: {
              destroy() {},
              containers: [],
            },
          } as unknown as Group;
        });

        const setOptionsSpy = spyOn(dragulaService, 'createGroup').and.callFake(
          (name, options) => {
            movesCallback = options.moves;
            return undefined as unknown as Group;
          },
        );

        fixture = TestBed.createComponent(RepeaterTestComponent);

        fixture.componentInstance.reorderable = true;
        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        tick();

        const nativeElement = fixture.elementRef.nativeElement;
        const repeaterItem =
          nativeElement.querySelectorAll('sky-repeater-item')[1];
        const handle = getReorderHandles(nativeElement)[1];

        const result = movesCallback!(repeaterItem, undefined, handle);
        expect(result).toBe(true);

        expect(setOptionsSpy).toHaveBeenCalled();

        flushDropdownTimer();
      }),
    ));
  });

  describe('with reorderability', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;
    let mockDragulaService: MockDragulaService;
    let logServiceSpy: jasmine.Spy;

    function fireDragEvent(dragEvent: 'drag' | 'dragend', index: number): void {
      const groupName = fixture.componentInstance.repeater?.dragulaGroupName;
      const repeaterItem = el.querySelectorAll('sky-repeater-item')[index];

      mockDragulaService[dragEvent]().next({
        name: groupName,
        el: repeaterItem,
      });
    }

    beforeEach(fakeAsync(() => {
      fixture = TestBed.overrideComponent(SkyRepeaterComponent, {
        add: {
          viewProviders: [
            { provide: DragulaService, useClass: MockDragulaService },
          ],
        },
      }).createComponent(RepeaterTestComponent);

      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
      const logService = TestBed.inject(SkyLogService);
      logServiceSpy = spyOn(logService, 'warn');

      fixture.detectChanges();
      cmp.reorderable = true;
      tick(); // Allow repeater-item.component to set tabIndexes & render context dropdown.
      fixture.detectChanges();

      mockDragulaService = fixture.debugElement
        .query(By.css('sky-repeater'))
        .injector.get(DragulaService) as MockDragulaService;
    }));

    function validateRepeaterItemReorderability(
      fixture: ComponentFixture<RepeaterTestComponent>,
      isReorderable: boolean,
    ): void {
      const cmp = fixture.componentInstance;
      const repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems).not.toBeUndefined();

      if (repeaterItems) {
        for (const item of repeaterItems) {
          expect(item.reorderable).toBe(isReorderable);
        }
      }
    }

    it('should not show a console warning if all item tags are defined', fakeAsync(() => {
      detectChangesAndTick(fixture);
      expect(logServiceSpy).not.toHaveBeenCalled();
    }));

    it('should set newly added items to reorderable if repeater is reorderable', fakeAsync(() => {
      cmp.removeLastItem = true;

      fixture.detectChanges();

      tick();

      let repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.length).toBe(2);
      repeaterItems?.forEach((item) => {
        expect(item.reorderable).toBe(true);
      });

      cmp.removeLastItem = false;

      fixture.detectChanges();

      tick();

      repeaterItems = cmp.repeater?.items?.toArray();

      expect(repeaterItems?.length).toBe(3);
      repeaterItems?.forEach((item) => {
        expect(item.reorderable).toBe(true);
      });
    }));

    it('should move an item to the top via the "Top" button', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      el.querySelectorAll('.sky-repeater-item-reorder-top')[1].click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should not move the top item via the "Top" button', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[0];
      el.querySelectorAll('.sky-repeater-item-reorder-top')[0].click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should update css classes correctly while dragging', () => {
      fireDragEvent('drag', 1);

      let repeaterItem = el.querySelectorAll('sky-repeater-item')[1];

      expect(
        repeaterItem.classList.contains('sky-repeater-item-dragging'),
      ).toBeTruthy();

      fireDragEvent('dragend', 1);

      repeaterItem = el.querySelectorAll('sky-repeater-item')[1];

      expect(
        repeaterItem.classList.contains('sky-repeater-item-dragging'),
      ).toBeFalsy();
    });

    it('should auto-scroll while dragging', () => {
      const repeaterInjector = fixture.debugElement.query(
        By.css('sky-repeater'),
      ).injector;

      const autoScrollSvc = repeaterInjector.get(SkyRepeaterAutoScrollService);
      const scrollableHostSvc = repeaterInjector.get(SkyScrollableHostService);

      const scrollableHostEl = scrollableHostSvc.getScrollableHost(
        fixture.elementRef,
      );

      const mockAutoScroller = jasmine.createSpyObj('autoScroller', [
        'destroy',
      ]);

      const autoScrollSpy = spyOn(autoScrollSvc, 'autoScroll').and.returnValue(
        mockAutoScroller,
      );

      fireDragEvent('drag', 1);

      expect(autoScrollSpy).toHaveBeenCalledOnceWith([scrollableHostEl], {
        margin: 20,
        maxSpeed: 10,
        scrollWhenOutside: true,
        autoScroll: jasmine.any(Function),
      });

      // The auto-scroll function should always return `true` since the auto-scroller
      // is destroyed when dragging ends.
      expect(autoScrollSpy.calls.argsFor(0)[1].autoScroll?.()).toBeTrue();

      fireDragEvent('dragend', 1);

      expect(mockAutoScroller.destroy).toHaveBeenCalledOnceWith();
    });

    it('should move an item up via keyboard controls using "Space" to activate', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      reorderItemWithKey(fixture, 1, 'up');
      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should move an item up via keyboard controls using "Enter" to activate', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      reorderItemWithKey(fixture, 1, 'up', 'Enter');

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should move an item down via keyboard controls', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      reorderItemWithKey(fixture, 1, 'down');

      expect(el.querySelectorAll('sky-repeater-item')[2]).toBe(itemToTest);
    }));

    it('should not move an item down via keyboard controls if it is the last item', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[2];
      reorderItemWithKey(fixture, 2, 'down');
      expect(el.querySelectorAll('sky-repeater-item')[2]).toBe(itemToTest);
    }));

    it('should not move an item when the left and right arrows are received keyboard controls', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'arrowLeft' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'arrowRight' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should not move an item up via keyboard controls if the blur event is received', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'blur');
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'arrowUp' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should turn off reordering when escape is hit', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'Escape' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'arrowUp' },
      });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should revert any reordering up when escape is hit', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'arrowUp' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'Escape' },
      });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should revert any reordering down when escape is hit', fakeAsync(() => {
      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = getReorderHandles(el)[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: ' ' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'arrowDown' },
      });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', {
        keyboardEventInit: { key: 'Escape' },
      });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[2]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should emit tags when "move to top" is clicked', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      el.querySelectorAll('.sky-repeater-item-reorder-top')[2].click();
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toEqual(['item3', 'item1', 'item2']);

      flushDropdownTimer();
    }));

    it('should emit tags when keyboard controls are used to reorder', fakeAsync(() => {
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      reorderItemWithKey(fixture, 1, 'down');
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toEqual(['item1', 'item3', 'item2']);

      reorderItemWithKey(fixture, 2, 'up');

      expect(cmp.sortedItemTags).toEqual(['item1', 'item2', 'item3']);

      flushDropdownTimer();
    }));

    it('should emit tags when item is dragged to reorder', fakeAsync(() => {
      cmp.reorderable = true;
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      const groupName = fixture.componentInstance.repeater?.dragulaGroupName;
      const repeaterItem: HTMLElement =
        el.querySelectorAll('sky-repeater-item')[0];
      mockDragulaService.drag().next({ name: groupName, el: repeaterItem });
      detectChangesAndTick(fixture);
      const repeaterDiv: HTMLElement =
        fixture.nativeElement.querySelector('.sky-repeater');

      repeaterDiv.removeChild(repeaterItem);
      const nextSibling = repeaterDiv.querySelectorAll('sky-repeater-item')[2];

      repeaterDiv.insertBefore(repeaterItem, nextSibling);
      mockDragulaService.dragend().next({ name: groupName, el: repeaterItem });
      detectChangesAndTick(fixture);
      expect(cmp.sortedItemTags).toEqual(['item2', 'item3', 'item1']);
    }));

    it('should allow for toggling reorderability on and off', fakeAsync(() => {
      cmp.reorderable = true;
      detectChangesAndTick(fixture);

      cmp.reorderable = false;
      detectChangesAndTick(fixture);

      cmp.reorderable = true;
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      const groupName = fixture.componentInstance.repeater?.dragulaGroupName;
      const repeaterItem: HTMLElement =
        el.querySelectorAll('sky-repeater-item')[0];
      mockDragulaService.drag().next({ name: groupName, el: repeaterItem });
      detectChangesAndTick(fixture);
      const repeaterDiv: HTMLElement =
        fixture.nativeElement.querySelector('.sky-repeater');

      repeaterDiv.removeChild(repeaterItem);
      const nextSibling = repeaterDiv.querySelectorAll('sky-repeater-item')[2];

      repeaterDiv.insertBefore(repeaterItem, nextSibling);
      mockDragulaService.dragend().next({ name: groupName, el: repeaterItem });
      detectChangesAndTick(fixture);
      expect(cmp.sortedItemTags).toEqual(['item2', 'item3', 'item1']);
    }));

    it('should not reset items if reorderability is toggled off after reordering', fakeAsync(() => {
      cmp.reorderable = true;
      detectChangesAndTick(fixture);

      const items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      el.querySelectorAll('.sky-repeater-item-reorder-top')[1].click();
      detectChangesAndTick(fixture);

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);

      cmp.reorderable = false;
      detectChangesAndTick(fixture);

      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should move through items with keyboard', fakeAsync(() => {
      cmp.showItemWithNoContent = true;
      detectChangesAndTick(fixture);
      const items: Element[] = Array.from(
        el.querySelectorAll('.sky-repeater-item'),
      );
      expect(items.length).toEqual(4);
      const sequence = [
        { startAt: 1, key: 'ArrowDown', expect: 2 },
        { startAt: 2, key: 'ArrowDown', expect: 3 },
        { startAt: 3, key: 'ArrowUp', expect: 2 },
        { startAt: 2, key: 'End', expect: 3 },
        { startAt: 3, key: 'ArrowDown', expect: 0 },
        { startAt: 0, key: 'ArrowUp', expect: 3 },
        { startAt: 3, key: 'ArrowUp', expect: 2 },
        { startAt: 2, key: 'Home', expect: 0 },
        { startAt: 0, key: 'ArrowUp', expect: 3 },
        { startAt: 3, key: 'ArrowDown', expect: 0 },
        { startAt: 0, key: 'ArrowDown', expect: 1 },
      ];

      for (const step of sequence) {
        SkyAppTestUtility.fireDomEvent(items[step.startAt], 'keydown', {
          keyboardEventInit: { key: step.key },
        });
        fixture.detectChanges();
        expect(document.activeElement).toEqual(items[step.expect]);
      }

      const inputField =
        fixture.nativeElement.querySelector('input[type="text"]');
      SkyAppTestUtility.fireDomEvent(inputField, 'keydown', {
        keyboardEventInit: { key: 'ArrowDown' },
      });
      fixture.detectChanges();
      expect(document.activeElement).toEqual(items[1]);
    }));

    it('should be accessible', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should set all items to reorderable when the repeater items change', fakeAsync(() => {
      cmp.showRepeaterWithNgFor = true;
      detectChangesAndTick(fixture);

      validateRepeaterItemReorderability(fixture, true);

      cmp.items = [
        {
          id: 'item4',
          title: 'Item 4',
        },
        {
          id: 'item5',
          title: 'Item 5',
        },
      ];
      detectChangesAndTick(fixture);

      validateRepeaterItemReorderability(fixture, true);
    }));

    it('should show a console warning when the items change and not all item tags are defined', fakeAsync(() => {
      cmp.showRepeaterWithNgFor = true;
      detectChangesAndTick(fixture);

      expect(logServiceSpy).not.toHaveBeenCalled();

      cmp.items = [
        {
          id: 'item4',
          title: 'Item 4',
        },
        {
          title: 'Item 5',
        },
      ];
      detectChangesAndTick(fixture);

      expect(logServiceSpy).toHaveBeenCalledWith(
        'Please supply tag properties for each repeater item when reordering functionality is enabled.',
      );
    }));

    it('should not show a console warning when the items change and no items exist', fakeAsync(() => {
      cmp.showRepeaterWithNgFor = true;
      detectChangesAndTick(fixture);

      expect(logServiceSpy).not.toHaveBeenCalled();

      cmp.items = [];
      detectChangesAndTick(fixture);

      expect(logServiceSpy).not.toHaveBeenCalled();
    }));

    it('should not show a console warning when the items change and items are undefined', fakeAsync(() => {
      cmp.showRepeaterWithNgFor = true;
      detectChangesAndTick(fixture);

      expect(logServiceSpy).not.toHaveBeenCalled();

      cmp.items = undefined;
      detectChangesAndTick(fixture);

      expect(logServiceSpy).not.toHaveBeenCalled();
    }));
  });

  describe('aria roles', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.overrideComponent(SkyRepeaterComponent, {
        add: {
          viewProviders: [
            { provide: DragulaService, useClass: MockDragulaService },
          ],
        },
      }).createComponent(RepeaterTestComponent);

      cmp = fixture.componentInstance;
      cmp.showRepeaterWithActiveIndex = true;
      cmp.expandMode = 'none';
      el = fixture.nativeElement;
    }));

    it('should calculate aria role as list', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(el.querySelector('.sky-repeater').getAttribute('role')).toEqual(
        'list',
      );
      expect(
        el.querySelector('.sky-repeater-item').getAttribute('role'),
      ).toEqual('listitem');
      expect(
        el.querySelector('.sky-repeater-item-title').getAttribute('role'),
      ).toBeFalsy();
      expect(
        el.querySelector('.sky-repeater-item-content').getAttribute('role'),
      ).toBeFalsy();
    });

    it('should calculate aria role as grid', async () => {
      cmp.showRepeaterWithActiveIndex = false;
      cmp.expandMode = 'none';
      cmp.reorderable = true;
      cmp.selectable = true;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(el.querySelector('.sky-repeater').getAttribute('role')).toEqual(
        'grid',
      );
      expect(
        el.querySelector('.sky-repeater-item').getAttribute('role'),
      ).toEqual('row');
      expect(
        el.querySelector('.sky-repeater-item-header').getAttribute('role'),
      ).toEqual('rowheader');
      expect(
        el.querySelector('.sky-repeater-item-content').getAttribute('role'),
      ).toEqual('gridcell');
    });

    it('should calculate aria role as grid when the only interactable element is the context menu', async () => {
      cmp.showRepeaterWithActiveIndex = false;
      cmp.expandMode = 'none';
      cmp.reorderable = false;
      cmp.selectable = false;
      cmp.showContextMenu = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(el.querySelector('.sky-repeater').getAttribute('role')).toEqual(
        'grid',
      );
    });
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
        const activeRepeaterItem = el.querySelectorAll(
          '.sky-repeater-item-active',
        );
        expect(activeRepeaterItem.length).toEqual(1);
      });

      fixture.destroy();
      flush();
    }));
  });

  describe('with nested repeater items', () => {
    let fixture: ComponentFixture<NestedRepeaterTestComponent>;
    let el: any;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NestedRepeaterTestComponent);
      el = fixture.nativeElement;
      fixture.detectChanges();
      tick();
    }));

    it('should reorder top-level repeater items', fakeAsync(() => {
      const initialTopRepeaterItem = el.querySelector(
        'sky-repeater-item[tag="top-item"]',
      );
      const initialBottomRepeaterItem = el.querySelector(
        'sky-repeater-item[tag="bottom-item"]',
      );

      expect(initialTopRepeaterItem).toBeDefined();
      expect(initialBottomRepeaterItem).toBeDefined();

      el.querySelectorAll('.sky-repeater-item-reorder-top')[1].click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const topRepeaterItem = el.querySelectorAll('sky-repeater-item')[0];

      expect(topRepeaterItem).toBe(initialBottomRepeaterItem);
    }));
  });

  describe('accessibility tests', () => {
    async function setupTest(args: {
      activeIndex?: number;
      expandMode?: SkyRepeaterExpandModeType;
      reorderable?: boolean;
      selectable?: boolean;
      context?: boolean;
    }): Promise<ComponentFixture<A11yRepeaterTestComponent>> {
      const fixture = TestBed.createComponent(A11yRepeaterTestComponent);
      const cmp = fixture.componentInstance;

      const items: A11yRepeaterItem[] = [
        {
          selectable: args.selectable,
          context: args.context,
          title: 'Item 1',
          message: 'Content 1',
          tag: 'item1',
        },
        {
          selectable: args.selectable,
          context: args.context,
          title: 'Item 2',
          message: 'Content 2',
          tag: 'item2',
        },
      ];

      cmp.items = items;
      cmp.activeIndex = args.activeIndex;
      cmp.expandMode = args.expandMode;
      cmp.reorderable = args.reorderable;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();

      return fixture;
    }

    it('should be accessible when selectable and expandable', async () => {
      const fixture = await setupTest({
        expandMode: 'single',
        selectable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and multi expandable', async () => {
      const fixture = await setupTest({
        expandMode: 'multiple',
        selectable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable and expandable', async () => {
      const fixture = await setupTest({
        reorderable: true,
        expandMode: 'single',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable and multi expandable', async () => {
      const fixture = await setupTest({
        reorderable: true,
        expandMode: 'multiple',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when expandable with context menu', async () => {
      const fixture = await setupTest({
        context: true,
        expandMode: 'single',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when multi expandable with context menu', async () => {
      const fixture = await setupTest({
        context: true,
        expandMode: 'multiple',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when expandable with active index', async () => {
      const fixture = await setupTest({
        expandMode: 'single',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when multi expandable with active index', async () => {
      const fixture = await setupTest({
        expandMode: 'multiple',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable with a context menu', async () => {
      const fixture = await setupTest({
        selectable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable and selectable', async () => {
      const fixture = await setupTest({
        reorderable: true,
        selectable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable with a context menu', async () => {
      const fixture = await setupTest({
        reorderable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable with active index', async () => {
      const fixture = await setupTest({
        activeIndex: 1,
        selectable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable with active index', async () => {
      const fixture = await setupTest({
        activeIndex: 1,
        reorderable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with active index and context menu', async () => {
      const fixture = await setupTest({
        activeIndex: 1,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable, reorderable, and expandable', async () => {
      const fixture = await setupTest({
        expandMode: 'single',
        selectable: true,
        reorderable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable, reorderable, and multi expandable', async () => {
      const fixture = await setupTest({
        expandMode: 'multiple',
        selectable: true,
        reorderable: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and expandable with context menu', async () => {
      const fixture = await setupTest({
        selectable: true,
        context: true,
        expandMode: 'single',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and multi expandable with context menu', async () => {
      const fixture = await setupTest({
        selectable: true,
        context: true,
        expandMode: 'multiple',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and expandable with active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        expandMode: 'single',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and multi expandable with active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        expandMode: 'multiple',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and reorderable with a context menu', async () => {
      const fixture = await setupTest({
        selectable: true,
        reorderable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable and selectable with active index', async () => {
      const fixture = await setupTest({
        reorderable: true,
        selectable: true,
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable with active index and context menu', async () => {
      const fixture = await setupTest({
        activeIndex: 1,
        selectable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable with active index and context', async () => {
      const fixture = await setupTest({
        activeIndex: 1,
        reorderable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable, reorderable, and expandable with context menu', async () => {
      const fixture = await setupTest({
        expandMode: 'single',
        selectable: true,
        reorderable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable, reorderable, and multi expandable with context menu', async () => {
      const fixture = await setupTest({
        expandMode: 'multiple',
        selectable: true,
        reorderable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and expandable with context menu and active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        context: true,
        expandMode: 'single',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when selectable and multi expandable with context menu and active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        context: true,
        expandMode: 'multiple',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable, selectable and expandable with active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        reorderable: true,
        expandMode: 'single',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable, selectable and multi expandable with active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        reorderable: true,
        expandMode: 'multiple',
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable, selectable and expandable with context menu', async () => {
      const fixture = await setupTest({
        selectable: true,
        reorderable: true,
        context: true,
        expandMode: 'single',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable, selectable and multi expandable with context menu', async () => {
      const fixture = await setupTest({
        selectable: true,
        reorderable: true,
        context: true,
        expandMode: 'multiple',
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable and selectable with context menu and active index', async () => {
      const fixture = await setupTest({
        selectable: true,
        reorderable: true,
        context: true,
        activeIndex: 1,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable, selectable, and expandable with context menu and active index', async () => {
      const fixture = await setupTest({
        reorderable: true,
        expandMode: 'single',
        activeIndex: 1,
        selectable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when reorderable, selectable, and multi expandable with context menu and active index', async () => {
      const fixture = await setupTest({
        reorderable: true,
        expandMode: 'multiple',
        activeIndex: 1,
        selectable: true,
        context: true,
      });
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
