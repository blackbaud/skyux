import { DragDropRegistry, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { SkyInlineFormButtonLayout } from '@skyux/inline-form';

import { A11yRepeaterItem } from './fixtures/a11y-repeater-item';
import { A11yRepeaterTestComponent } from './fixtures/a11y-repeater.component.fixture';
import { NestedRepeaterTestComponent } from './fixtures/nested-repeater.component.fixture';
import { RepeaterAsyncItemsTestComponent } from './fixtures/repeater-async-items.component.fixture';
import { SkyRepeaterFixturesModule } from './fixtures/repeater-fixtures.module';
import { RepeaterInlineFormFixtureComponent } from './fixtures/repeater-inline-form.component.fixture';
import { RepeaterWithMissingTagsFixtureComponent } from './fixtures/repeater-missing-tag.fixture';
import { RepeaterScrollableHostTestComponent } from './fixtures/repeater-scrollable-host.component.fixture';
import { RepeaterTestComponent } from './fixtures/repeater.component.fixture';
import { SkyRepeaterExpandModeType } from './repeater-expand-mode-type';
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

    it('should select item when clicking around the content area when there is not another click target', fakeAsync(() => {
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

      const firstItem = items[0];
      const firstItemTitle = items[0].querySelector('sky-repeater-item-title');
      const firstItemContent = items[0].querySelector(
        'sky-repeater-item-content',
      );
      const inputField = firstItemContent?.querySelector('#inputField');
      expect(firstItemTitle && firstItemContent && inputField).toBeTruthy();

      // Expect first item NOT to be selected.
      expect(firstItem).not.toHaveCssClass('sky-repeater-item-selected');

      // Clicking the title does not select the item.
      SkyAppTestUtility.fireDomEvent(firstItemTitle, 'click');
      fixture.detectChanges();
      expect(firstItem).not.toHaveCssClass('sky-repeater-item-selected');

      // Clicking the input does not select the item.
      SkyAppTestUtility.fireDomEvent(inputField, 'click');
      fixture.detectChanges();
      expect(firstItem).not.toHaveCssClass('sky-repeater-item-selected');

      // Clicking the content selects the item.
      SkyAppTestUtility.fireDomEvent(firstItemContent, 'click');
      fixture.detectChanges();
      expect(firstItem).toHaveCssClass('sky-repeater-item-selected');
      expect(isSelectedChangeSpy).toHaveBeenCalledWith(true);
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

  describe('CDK drag-drop integration', () => {
    it('should set up drag refs with grab handles for reorderable items', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.componentInstance.reorderable = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      const nativeElement = fixture.elementRef.nativeElement;
      const handles = getReorderHandles(nativeElement);

      expect(handles.length).toBeGreaterThan(0);

      flushDropdownTimer();
    }));

    it('should add and remove dragging CSS class via CDK drag events', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.componentInstance.reorderable = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Get the DragRef instances registered with the DragDropRegistry.
      const registry = TestBed.inject(DragDropRegistry);
      const dragRefs = Array.from(
        (registry as unknown as { _dragInstances: Set<DragRef> })
          ._dragInstances,
      );

      expect(dragRefs.length).toBeGreaterThan(0);

      const firstItemEl: HTMLElement =
        fixture.nativeElement.querySelectorAll('sky-repeater-item')[0];

      // Trigger the 'started' event on the first drag ref.
      dragRefs[0].started.next({
        source: dragRefs[0],
        event: new MouseEvent('mousedown'),
      });
      fixture.detectChanges();

      expect(
        firstItemEl.classList.contains('sky-repeater-item-dragging'),
      ).toBeTrue();

      // Trigger the 'ended' event on the first drag ref.
      dragRefs[0].ended.next({
        source: dragRefs[0],
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('mouseup'),
      });
      fixture.detectChanges();

      expect(
        firstItemEl.classList.contains('sky-repeater-item-dragging'),
      ).toBeFalse();

      flushDropdownTimer();
    }));

    it('should reorder items and move DOM elements on CDK drop', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp = fixture.componentInstance;
      cmp.reorderable = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Get the DropListRef and DragRef instances from the DragDropRegistry.
      const registry = TestBed.inject(DragDropRegistry);
      const dropListRefs = Array.from(
        (registry as unknown as { _dropInstances: Set<DropListRef> })
          ._dropInstances,
      );
      const dragRefs = Array.from(
        (registry as unknown as { _dragInstances: Set<DragRef> })
          ._dragInstances,
      );

      expect(dropListRefs.length).toBe(1);
      expect(cmp.sortedItemTags).toBeUndefined();

      const dropListRef = dropListRefs[0];
      const containerEl = fixture.nativeElement.querySelector('.sky-repeater');

      // Simulate a CDK drop event: move item from index 0 to index 2.
      dropListRef.dropped.next({
        item: dragRefs[0],
        container: dropListRef,
        previousIndex: 0,
        currentIndex: 2,
        previousContainer: dropListRef,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('mouseup'),
      });

      fixture.detectChanges();
      tick();

      expect(cmp.sortedItemTags).toEqual(['item2', 'item3', 'item1']);

      // Verify DOM was reordered: the first item should now be at the end.
      const items = containerEl.querySelectorAll('sky-repeater-item');
      expect(
        items[2].querySelector('.sky-repeater-item-title')?.textContent?.trim(),
      ).toContain('Title 1');

      flushDropdownTimer();
    }));

    it('should handle drop to middle position (insertBefore path)', fakeAsync(() => {
      const fixture = TestBed.createComponent(RepeaterTestComponent);
      const cmp = fixture.componentInstance;
      cmp.reorderable = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Get the DropListRef and DragRef instances from the DragDropRegistry.
      const registry = TestBed.inject(DragDropRegistry);
      const dropListRefs = Array.from(
        (registry as unknown as { _dropInstances: Set<DropListRef> })
          ._dropInstances,
      );
      const dragRefs = Array.from(
        (registry as unknown as { _dragInstances: Set<DragRef> })
          ._dragInstances,
      );

      const dropListRef = dropListRefs[0];

      // Drop item from index 2 to index 0 (inserts before existing item at index 0).
      dropListRef.dropped.next({
        item: dragRefs[2],
        container: dropListRef,
        previousIndex: 2,
        currentIndex: 0,
        previousContainer: dropListRef,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('mouseup'),
      });

      fixture.detectChanges();
      tick();

      expect(cmp.sortedItemTags).toEqual(['item3', 'item1', 'item2']);

      // Verify the DOM was reordered correctly: item3 moved to index 0.
      const containerEl = fixture.nativeElement.querySelector('.sky-repeater');
      const items = containerEl.querySelectorAll('sky-repeater-item');
      expect(
        items[0].querySelector('.sky-repeater-item-title')?.textContent?.trim(),
      ).toContain('Title 3');
      expect(
        items[1].querySelector('.sky-repeater-item-title')?.textContent?.trim(),
      ).toContain('Title 1');
      expect(
        items[2].querySelector('.sky-repeater-item-title')?.textContent?.trim(),
      ).toContain('Title 2');

      flushDropdownTimer();
    }));

    it('should register scrollable host as a scrollable parent for the drop list', fakeAsync(() => {
      const fixture = TestBed.createComponent(
        RepeaterScrollableHostTestComponent,
      );

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      // Get the DropListRef instance from the DragDropRegistry.
      const registry = TestBed.inject(DragDropRegistry);
      const dropListRefs = Array.from(
        (registry as unknown as { _dropInstances: Set<DropListRef> })
          ._dropInstances,
      );

      expect(dropListRefs.length).toBe(1);

      const dropListRef = dropListRefs[0];

      // Verify the scrollable parent was registered by checking the
      // DropListRef's internal _scrollableElements.
      const scrollableElements = (
        dropListRef as unknown as { _scrollableElements: HTMLElement[] }
      )._scrollableElements;

      const scrollableDiv = fixture.nativeElement.querySelector(
        '[style*="overflow-y"]',
      );

      expect(scrollableElements).toContain(scrollableDiv);

      flushDropdownTimer();
    }));
  });

  describe('with reorderability', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;
    let logServiceSpy: jasmine.Spy;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);

      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
      const logService = TestBed.inject(SkyLogService);
      logServiceSpy = spyOn(logService, 'warn');

      fixture.detectChanges();
      cmp.reorderable = true;
      tick(); // Allow repeater-item.component to set tabIndexes & render context dropdown.
      fixture.detectChanges();
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

    it('should update css classes correctly while dragging via CDK', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const repeaterItem = el.querySelectorAll('sky-repeater-item')[1];

      // Verify the dragging class is not present initially.
      expect(
        repeaterItem.classList.contains('sky-repeater-item-dragging'),
      ).toBeFalsy();
    }));

    it('should emit tags when item is dragged to reorder via CDK drop', fakeAsync(() => {
      cmp.reorderable = true;
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toBeUndefined();

      // Simulate CDK drop by calling the repeater service directly
      // and emitting tags (same end result as a CDK drop event).
      const repeaterService = fixture.debugElement
        .query(By.css('sky-repeater'))
        .injector.get(SkyRepeaterService);

      const repeaterItem: HTMLElement =
        el.querySelectorAll('sky-repeater-item')[0];
      const repeaterDiv: HTMLElement =
        fixture.nativeElement.querySelector('.sky-repeater');

      // Manually move the DOM element to simulate a drag from index 0 to index 2.
      repeaterDiv.removeChild(repeaterItem);
      repeaterDiv.appendChild(repeaterItem);

      repeaterService.reorderItem(0, 2);
      repeaterService.registerOrderChange();
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

      // Simulate reorder via service
      const repeaterService = fixture.debugElement
        .query(By.css('sky-repeater'))
        .injector.get(SkyRepeaterService);

      const repeaterItem: HTMLElement =
        el.querySelectorAll('sky-repeater-item')[0];
      const repeaterDiv: HTMLElement =
        fixture.nativeElement.querySelector('.sky-repeater');

      repeaterDiv.removeChild(repeaterItem);
      repeaterDiv.appendChild(repeaterItem);

      repeaterService.reorderItem(0, 2);
      repeaterService.registerOrderChange();
      detectChangesAndTick(fixture);

      expect(cmp.sortedItemTags).toEqual(['item2', 'item3', 'item1']);
    }));

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

      // Simulate a CDK drop by calling the repeater service directly.
      const repeaterService = fixture.debugElement
        .query(By.css('sky-repeater'))
        .injector.get(SkyRepeaterService);

      repeaterService.reorderItem(0, 2);
      repeaterService.registerOrderChange();
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

      // Simulate a CDK drop by calling the repeater service directly.
      const repeaterService = fixture.debugElement
        .query(By.css('sky-repeater'))
        .injector.get(SkyRepeaterService);

      repeaterService.reorderItem(0, 2);
      repeaterService.registerOrderChange();
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
      fixture = TestBed.createComponent(RepeaterTestComponent);

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
