import {
  async,
  ComponentFixture,
  fakeAsync,
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
  RepeaterTestComponent
} from './fixtures/repeater.component.fixture';

import {
  SkyRepeaterFixturesModule
} from './fixtures/repeater-fixtures.module';

import {
  RepeaterInlineFormFixtureComponent
} from './fixtures/repeater-inline-form.component.fixture';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyRepeaterFixturesModule
      ]
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
    })
  );

  it('should have aria-control set pointed at content', fakeAsync(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    expect(el.querySelector('sky-chevron').getAttribute('aria-controls'))
      .toBe(el.querySelector('.sky-repeater-item-content').getAttribute('id'));
  }));

  it('should be accessible', async(() => {
    let fixture = TestBed.createComponent(RepeaterTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

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

      let selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected') as NodeList;
      expect(selectedItemsEl.length).toBe(0);

      // select first item
      const repeaterItems = cmp.repeater.items.toArray();
      repeaterItems[0].updateIsSelected({ source: undefined, checked: true });

      fixture.detectChanges();

      tick();

      expect(repeaterItems[0].isSelected).toBe(true);
      expect(repeaterItems[1].isSelected).toBe(false);
      expect(repeaterItems[2].isSelected).toBe(false);

      selectedItemsEl = el.querySelectorAll('.sky-repeater-item-selected');
      expect(selectedItemsEl.length).toBe(1);
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

    it('should update the isSelected property when the user selects an item', fakeAsync(() => {
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
    }));
  });

  describe('with activeIndex', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(RepeaterTestComponent);
      cmp = fixture.componentInstance;
      el = fixture.nativeElement;
    });

    function getItems(): HTMLElement[] {
      return el.querySelectorAll('.sky-repeater-item');
    }

    it('should show active item if activeIndex is set on init', fakeAsync(() => {
      cmp.activeIndex = 0;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      let activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);
    }));

    it('should add and remove active css class when activeIndex value changes', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      let activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(0);

      cmp.activeIndex = 0;
      fixture.detectChanges();
      tick();

      activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(1);
      const items = getItems();
      expect(items[0]).toHaveCssClass('sky-repeater-item-active');

      cmp.activeIndex = undefined;
      fixture.detectChanges();
      tick();

      activeRepeaterItem = el.querySelectorAll('.sky-repeater-item-active');
      expect(activeRepeaterItem.length).toBe(0);
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

  describe('with reorderability', () => {
    let fixture: ComponentFixture<RepeaterTestComponent>;
    let cmp: RepeaterTestComponent;
    let el: any;
    let mockDragulaService: DragulaService;

    beforeEach(() => {
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
      fixture.detectChanges();
      cmp.reorderable = true;
    });

    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
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
      let repeaterItem: HTMLElement = el.querySelectorAll('sky-repeater-item')[1];
      mockDragulaService.drag.emit([, repeaterItem]);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      repeaterItem = el.querySelectorAll('sky-repeater-item')[1];
      expect(repeaterItem.classList.contains('sky-repeater-item-dragging')).toBeTruthy(); mockDragulaService.dragend.emit([, repeaterItem]);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      repeaterItem = el.querySelectorAll('sky-repeater-item')[1];
      expect(repeaterItem.classList.contains('sky-repeater-item-dragging')).toBeFalsy();
    }));

    it('should set the repeater item\'s grab handle as the drag handle', fakeAsync(() => {
      let repeaterItem: Element = el.querySelectorAll('sky-repeater-item')[1];
      let handle: Element = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
      let setOptionsSpy = spyOn(mockDragulaService, 'setOptions').and.callFake(
        (bagId: any, options: any) => {
          let result = options.moves(
            repeaterItem,
            undefined,
            handle
          );

          expect(result).toBe(true);
        }
      );

      fixture = TestBed.createComponent(RepeaterTestComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(setOptionsSpy).toHaveBeenCalled();
    }));

    it('should move an item up via keyboard controls', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowUp' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[0]).toBe(itemToTest);
    }));

    it('should move an item down via keyboard controls', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowDown' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[2]).toBe(itemToTest);
    }));

    it('should not move an item down via keyboard controls if it is the last item', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[2];
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[2];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowDown' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[2]).toBe(itemToTest);
    }));

    it('should not move an item when the left and right arrows are received keyboard controls', fakeAsync(() => {
      let items = el.querySelectorAll('sky-repeater-item');
      const itemToTest = items[1];
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
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
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
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
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
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
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
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
      const itemDragHandle = el.querySelectorAll('.sky-repeater-item-grab-handle')[1];
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: ' ' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'arrowDown' } });
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(itemDragHandle, 'keydown', { keyboardEventInit: { key: 'Escape' } });
      fixture.detectChanges();
      expect(el.querySelectorAll('sky-repeater-item')[2]).not.toBe(itemToTest);
      expect(el.querySelectorAll('sky-repeater-item')[1]).toBe(itemToTest);
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });
});
