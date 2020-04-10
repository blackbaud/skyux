import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyAffixConfig,
  SkyAffixService
} from '@skyux/core';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyDropdownFixturesModule
} from './fixtures/dropdown-fixtures.module';

import {
  DropdownFixtureComponent
} from './fixtures/dropdown.component.fixture';

import {
  SkyDropdownMessageType
} from './types/dropdown-message-type';

import {
  SkyDropdownItemComponent
} from './dropdown-item.component';

describe('Dropdown component', function () {

  let fixture: ComponentFixture<DropdownFixtureComponent>;

  //#region helpers

  function getButtonElement(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.sky-dropdown-button');
  }

  function getMenuContainerElement(): HTMLElement {
    return document.querySelector('.sky-dropdown-menu-container');
  }

  function getMenuElement(): Element {
    const container = getMenuContainerElement();
    if (!container) {
      return container;
    }

    return container.querySelector('.sky-dropdown-menu');
  }

  function getMenuItems(): NodeListOf<Element> {
    return getMenuElement().querySelectorAll('.sky-dropdown-item');
  }

  function getFirstMenuItem(): Element {
    return getMenuItems().item(0);
  }

  function verifyActiveMenuItemByIndex(index: number): void {
    const menuItems = fixture.componentInstance.dropdownItemRefs.toArray();

    menuItems.forEach((item: SkyDropdownItemComponent, i: number) => {
      if (i === index) {
        expect(item.isActive).toEqual(true);
        expect(item.elementRef.nativeElement
          .querySelector('.sky-dropdown-item'))
          .toHaveCssClass('sky-dropdown-item-active');
      } else {
        expect(item.isActive).toEqual(false);
        expect(item.elementRef.nativeElement
          .querySelector('.sky-dropdown-item'))
          .not.toHaveCssClass('sky-dropdown-item-active');
      }
    });
  }

  function isMenuItemFocused(index: number): boolean {
    const menuItemButtons = document.querySelectorAll('.sky-dropdown-item button');
    return isElementFocused(menuItemButtons[index]);
  }

  function isElementFocused(elem: Element): boolean {
    return (elem === document.activeElement);
  }

  function isElementVisible(elem: Element): boolean {
    return (getComputedStyle(elem).visibility !== 'hidden');
  }

  /**
   * Multiple ticks are needed to accommodate setTimeout and observable streams.
   */
  function detectChangesFakeAsync(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  //#endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyDropdownFixturesModule
      ]
    });

    fixture = TestBed.createComponent(DropdownFixtureComponent);
  });

  it('should set defaults', fakeAsync(() => {
    detectChangesFakeAsync();

    const dropdownRef = fixture.componentInstance.dropdownRef;
    expect(dropdownRef.alignment).toEqual('left');
    expect(dropdownRef.buttonStyle).toEqual('default');
    expect(dropdownRef.buttonType).toEqual('select');
    expect(dropdownRef.disabled).toEqual(false);
    expect(dropdownRef.dismissOnBlur).toEqual(true);
    expect(dropdownRef.horizontalAlignment).toEqual('left');
    expect(dropdownRef.label).toBeUndefined();
    expect(dropdownRef.title).toBeUndefined();
    expect(dropdownRef.trigger).toEqual('click');

    const menuRef = fixture.componentInstance.dropdownMenuRef;
    expect(menuRef.ariaLabelledBy).toBeUndefined();
    expect(menuRef.ariaRole).toEqual('menu');
    expect(menuRef.useNativeFocus).toEqual(true);

    const itemRefs = fixture.componentInstance.dropdownItemRefs;
    expect(itemRefs.first.ariaRole).toEqual('menuitem');

    const button = getButtonElement();
    expect(button).toHaveCssClass('sky-btn-default');
  }));

  it('should allow setting the horizontal alignment', fakeAsync(inject(
    [SkyAffixService],
    (affixService: SkyAffixService) => {
      const expectedAlignment = 'center';

      fixture.componentInstance.alignment = expectedAlignment;

      let actualConfig: SkyAffixConfig;

      const mockAffixer = {
        placementChange: Observable.of({}),
        affixTo(elem: any, config: SkyAffixConfig ) {
          actualConfig = config;
        },
        destroy() {},
        reaffix() {}
      };

      const button = getButtonElement();
      const createAffixerSpy = spyOn(affixService, 'createAffixer').and.returnValue(mockAffixer);

      detectChangesFakeAsync();
      button.click();
      detectChangesFakeAsync();

      expect(actualConfig.horizontalAlignment).toEqual(expectedAlignment);

      // Clear the spy to return the service to normal.
      createAffixerSpy.and.callThrough();
    }
  )));

  it('should use horizontalAlignment if alignment is undefined', fakeAsync(inject(
    [SkyAffixService],
    (affixService: SkyAffixService) => {
      const expectedAlignment = 'right';

      fixture.componentInstance.alignment = undefined;
      fixture.componentInstance.horizontalAlignment = expectedAlignment;

      let actualConfig: SkyAffixConfig;

      const mockAffixer = {
        placementChange: Observable.of({}),
        affixTo(elem: any, config: SkyAffixConfig ) {
          actualConfig = config;
        },
        destroy() {},
        reaffix() {}
      };

      const button = getButtonElement();
      const createAffixerSpy = spyOn(affixService, 'createAffixer').and.returnValue(mockAffixer);

      // Make sure the set alignment in our test doesn't match the default alignment.
      // (We need to confirm that a change has occurred.)
      expect(fixture.componentInstance.dropdownRef.alignment).not.toEqual(expectedAlignment);

      detectChangesFakeAsync();
      button.click();
      detectChangesFakeAsync();

      expect(actualConfig.horizontalAlignment).toEqual(expectedAlignment);

      // Clear the spy to return the service to normal.
      createAffixerSpy.and.callThrough();
    }
  )));

  it('should allow setting button style and type', fakeAsync(() => {
    fixture.componentInstance.buttonStyle = 'danger';
    fixture.componentInstance.buttonType = 'context-menu';

    detectChangesFakeAsync();

    const button = getButtonElement();
    expect(button).toHaveCssClass('sky-btn-danger');
    expect(button).toHaveCssClass('sky-dropdown-button-type-context-menu');
  }));

  it('should reposition the menu when number of menu items change', fakeAsync(() => {
    detectChangesFakeAsync();

    const button = getButtonElement();

    button.click();
    detectChangesFakeAsync();

    expect(fixture.componentInstance.dropdownItemRefs.length).toEqual(4);

    const spy = spyOn(fixture.componentInstance.messageStream, 'next').and.callThrough();
    fixture.componentInstance.changeItems();

    detectChangesFakeAsync();

    expect(fixture.componentInstance.dropdownItemRefs.length).toEqual(3);
    expect(spy).toHaveBeenCalledWith({
      type: SkyDropdownMessageType.Reposition
    });
  }));

  it('should add scrollbars for long list of dropdown items', fakeAsync(() => {
    detectChangesFakeAsync();

    const button = getButtonElement();

    button.click();
    detectChangesFakeAsync();

    const menu = getMenuElement();

    // Should NOT have a scrollbar.
    expect(menu.scrollHeight > menu.clientHeight).toEqual(false);

    fixture.componentInstance.setManyItems();
    detectChangesFakeAsync();

    // Should now have a scrollbar.
    expect(menu.scrollHeight > menu.clientHeight).toEqual(true);
  }));

  it('should emit when a menu item is selected', fakeAsync(() => {
    const menuChangesSpy = spyOn(fixture.componentInstance, 'onMenuChanges').and.callThrough();
    detectChangesFakeAsync();

    const button = getButtonElement();

    // Open the menu.
    button.click();
    detectChangesFakeAsync();

    // Click third item button.
    const buttonIndex = 2;
    const firstItemButton = getMenuItems().item(buttonIndex).querySelector('button');
    firstItemButton.click();
    detectChangesFakeAsync();

    const selectedItem = fixture.componentInstance.dropdownItemRefs.find((item, i) => {
      return (i === buttonIndex);
    });

    expect(menuChangesSpy).toHaveBeenCalledWith({ activeIndex: buttonIndex });
    expect(menuChangesSpy).toHaveBeenCalledWith({ selectedItem });
  }));

  describe('mouse interactions', function () {
    it('should open and close menu via mouse click', fakeAsync(() => {
      fixture.componentInstance.trigger = 'click';
      detectChangesFakeAsync();

      const button = getButtonElement();

      button.click();
      // Simulate mouse movement as well.
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      detectChangesFakeAsync();

      let dropdownMenu = getMenuElement();
      expect(isElementVisible(dropdownMenu)).toEqual(true);

      button.click();
      // Simulate mouse movement as well.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      detectChangesFakeAsync();

      dropdownMenu = getMenuElement();

      expect(dropdownMenu).toBeNull();
    }));

    it('should open and close menu via mouse hover', fakeAsync(() => {
      fixture.componentInstance.trigger = 'hover';
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      detectChangesFakeAsync();

      let container = getMenuContainerElement();
      let menu = getMenuElement();

      expect(isElementVisible(container)).toEqual(true);

      // Simulate moving the mouse to the menu.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      SkyAppTestUtility.fireDomEvent(menu, 'mouseenter');
      detectChangesFakeAsync();

      container = getMenuContainerElement();
      menu = getMenuElement();

      // Confirm menu is still open.
      expect(isElementVisible(container)).toEqual(true);

      // Simulate moving the mouse from the menu to the trigger button.
      SkyAppTestUtility.fireDomEvent(menu, 'mouseleave');
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      detectChangesFakeAsync();

      container = getMenuContainerElement();
      menu = getMenuElement();

      // Confirm menu is still open.
      expect(isElementVisible(container)).toEqual(true);

      // Simulate mouse leaving the trigger button.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      // Menu should now be closed.
      expect(container).toBeNull();

      // Re-open the menu.
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      detectChangesFakeAsync();

      container = getMenuContainerElement();
      menu = getMenuElement();

      expect(isElementVisible(container)).toEqual(true);

      // Simulate moving the mouse to the menu.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      SkyAppTestUtility.fireDomEvent(menu, 'mouseenter');
      detectChangesFakeAsync();

      container = getMenuContainerElement();
      menu = getMenuElement();

      // Confirm menu is still open.
      expect(isElementVisible(container)).toEqual(true);

      // Simulate mouse leaving the menu completely.
      SkyAppTestUtility.fireDomEvent(menu, 'mouseleave');
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      // Menu should now be closed.
      expect(container).toBeNull();
    }));

    it('should close menu when clicking outside', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();
      button.click();
      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(window.document.body, 'click');
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();
    }));

    it('should allow preventing menu close on window click', fakeAsync(() => {
      fixture.componentInstance.dismissOnBlur = false;
      detectChangesFakeAsync();

      const button = getButtonElement();
      button.click();
      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(window.document.body, 'click');
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      // Menu should still be open.
      expect(isElementVisible(container)).toEqual(true);
    }));
  });

  describe('keyboard interactions', function () {
    it('should open menu and focus first item with arrowdown key', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'arrowdown'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      // Close the dropdown.
      button.click();
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();

      // IE 11 uses 'down'.
      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'down'
        }
      });

      detectChangesFakeAsync();

      container = getMenuContainerElement();
      const menuItems = getMenuItems();
      const firstButton = menuItems.item(0).querySelector('button');

      expect(isElementVisible(container)).toEqual(true);
      expect(isElementFocused(firstButton)).toEqual(true);
    }));

    it('should open menu and focus last item with arrowup key', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'arrowup'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      // Close the dropdown.
      button.click();
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();

      // IE 11 uses 'up'.
      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'up'
        }
      });

      detectChangesFakeAsync();

      container = getMenuContainerElement();
      const menuItems = getMenuItems();
      const lastButton = menuItems.item(menuItems.length - 1).querySelector('button');

      expect(isElementVisible(container)).toEqual(true);
      expect(isElementFocused(lastButton)).toEqual(true);
    }));

    it('should not focus last item if it is disabled', fakeAsync(() => {
      fixture.componentInstance.items[fixture.componentInstance.items.length - 1].disabled = true;
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'arrowup'
        }
      });

      detectChangesFakeAsync();

      const container = getMenuContainerElement();
      const menuItems = getMenuItems();
      expect(isElementVisible(container)).toEqual(true);
      expect(isMenuItemFocused(menuItems.length - 1)).toEqual(false);
      expect(isMenuItemFocused(menuItems.length - 2)).toEqual(true);
    }));

    it('should close menu with escape key while trigger button is focused', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();
      button.click();
      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'escape'
        }
      });

      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();
    }));

    it('should close menu with escape key while menu is focused', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();
      button.click();
      detectChangesFakeAsync();

      let container = getMenuContainerElement();
      const firstItem = getFirstMenuItem();

      expect(isElementVisible(container)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(firstItem, 'keydown', {
        keyboardEventInit: {
          key: 'escape'
        }
      });

      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();
      expect(isElementFocused(button)).toEqual(true);
    }));

    it('should focus first item if opened with enter key', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      const container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);
      expect(isMenuItemFocused(0)).toEqual(true);
    }));

    it('should allow disabling native focus', fakeAsync(() => {
      fixture.componentInstance.useNativeFocus = false;
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      const container = getMenuContainerElement();

      // The menu should be open, but the first item should not be focused.
      expect(isElementVisible(container)).toEqual(true);
      expect(isMenuItemFocused(0)).toEqual(false);
    }));

    it('should not focus the first item if it is disabled', fakeAsync(() => {
      fixture.componentInstance.items[0].disabled = true;
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      const container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);
      expect(isMenuItemFocused(0)).toEqual(false);
      expect(isMenuItemFocused(2)).toEqual(true);
    }));

    it('should handle all items being disabled', fakeAsync(() => {
      fixture.componentInstance.items = [
        {
          name: 'Option 1',
          disabled: true
        },
        {
          name: 'Option 2',
          disabled: true
        }
      ];
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(0)).toEqual(false);
      expect(isMenuItemFocused(1)).toEqual(false);

      const menu = getMenuElement();

      // Attempt to move to next item.
      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'arrowdown'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(0)).toEqual(false);
      expect(isMenuItemFocused(1)).toEqual(false);

      // Attempt to move to previous item.
      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'arrowup'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(0)).toEqual(false);
      expect(isMenuItemFocused(1)).toEqual(false);

      // Try to focus the last item using the up arrow.
      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'up'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(0)).toEqual(false);
      expect(isMenuItemFocused(1)).toEqual(false);
    }));

    it('should navigate menu with arrow keys', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(0)).toEqual(true);

      const menu = getMenuElement();

      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'arrowdown'
        }
      });

      detectChangesFakeAsync();

      // Should skip second item because it is disabled.
      expect(isMenuItemFocused(2)).toEqual(true);

      // Try IE 11 'down' key.
      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'down'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(3)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'arrowdown'
        }
      });

      detectChangesFakeAsync();

      // It should loop back to first item.
      expect(isMenuItemFocused(0)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'arrowup'
        }
      });

      detectChangesFakeAsync();

      // It should loop back to last item.
      expect(isMenuItemFocused(3)).toEqual(true);

      // Try IE 11's 'up' key.
      SkyAppTestUtility.fireDomEvent(menu, 'keydown', {
        keyboardEventInit: {
          key: 'up'
        }
      });

      detectChangesFakeAsync();

      expect(isMenuItemFocused(2)).toEqual(true);
    }));

    it('should close the menu after trigger button loses focus', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      // Run 'tab' on trigger button.
      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'tab'
        }
      });
      button.blur();

      detectChangesFakeAsync();

      container = getMenuContainerElement();

      // Tab key should progress to next item after the trigger button.
      expect(container).toBeNull();
    }));

    it('should not close the menu if dismissOnBlur is false (trigger has focus)', fakeAsync(() => {
      fixture.componentInstance.dismissOnBlur = false;
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      // Run 'tab' on trigger button.
      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'tab'
        }
      });
      button.blur();

      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);
    }));

    it('should not close the menu if dismissOnBlur is false (menu has focus)', fakeAsync(() => {
      fixture.componentInstance.dismissOnBlur = false;
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      const firstButton = getMenuItems().item(0).querySelector('button');

      // Run 'tab' on first item.
      SkyAppTestUtility.fireDomEvent(firstButton, 'keydown', {
        keyboardEventInit: {
          key: 'tab'
        }
      });
      firstButton.blur();

      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);
    }));

    it('should close the menu when tab key is pressed within the menu', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'down'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      const menuItems = getMenuItems();

      SkyAppTestUtility.fireDomEvent(menuItems.item(0), 'keydown', {
        keyboardEventInit: {
          key: 'tab'
        }
      });

      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();
    }));

    it('should select a menu item with the space bar', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'down'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      const menuItems = getMenuItems();
      const menuSpy = spyOn(fixture.componentInstance, 'onMenuChanges').and.callThrough();

      SkyAppTestUtility.fireDomEvent(menuItems.item(0), 'keydown', {
        keyboardEventInit: {
          key: ' '
        }
      });

      detectChangesFakeAsync();

      expect(menuSpy).toHaveBeenCalledWith({
        selectedItem: fixture.componentInstance.dropdownItemRefs.first
      });
    }));

    it('should select a menu item with the enter key', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'down'
        }
      });

      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      const menuItems = getMenuItems();
      const menuSpy = spyOn(fixture.componentInstance, 'onMenuChanges').and.callThrough();

      SkyAppTestUtility.fireDomEvent(menuItems.item(0), 'keydown', {
        keyboardEventInit: {
          key: 'enter'
        }
      });

      detectChangesFakeAsync();

      expect(menuSpy).toHaveBeenCalledWith({
        selectedItem: fixture.componentInstance.dropdownItemRefs.first
      });
    }));
  });

  describe('message stream', function () {
    it('should open and close the menu', fakeAsync(() => {
      detectChangesFakeAsync();

      let container = getMenuContainerElement();

      // Verify the menu is closed on startup.
      expect(container).toBeNull();

      fixture.componentInstance.sendMessage(SkyDropdownMessageType.Open);
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(isElementVisible(container)).toEqual(true);

      fixture.componentInstance.sendMessage(SkyDropdownMessageType.Close);
      detectChangesFakeAsync();

      container = getMenuContainerElement();

      expect(container).toBeNull();
    }));

    it('should focus the trigger button', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      expect(isElementFocused(button)).toEqual(false);

      fixture.componentInstance.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
      detectChangesFakeAsync();

      expect(isElementFocused(button)).toEqual(true);
    }));

    it('should allow navigating the menu', fakeAsync(() => {
      detectChangesFakeAsync();

      // Open the menu.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.Open);
      detectChangesFakeAsync();

      // Focus the first item.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.FocusFirstItem);
      detectChangesFakeAsync();

      verifyActiveMenuItemByIndex(0);
      expect(isMenuItemFocused(0)).toEqual(true);

      // Focus the next item.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.FocusNextItem);
      detectChangesFakeAsync();

      // It should skip the second item because it is disabled.
      verifyActiveMenuItemByIndex(2);
      expect(isMenuItemFocused(2)).toEqual(true);

      // Focus the previous item.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.FocusPreviousItem);
      detectChangesFakeAsync();

      verifyActiveMenuItemByIndex(0);
      expect(isMenuItemFocused(0)).toEqual(true);
    }));

    it('should not open the menu if disabled', fakeAsync(() => {
      fixture.componentInstance.disabled = true;
      detectChangesFakeAsync();

      // Attempt to open the menu.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.Open);
      detectChangesFakeAsync();

      const container = getMenuContainerElement();

      expect(container).toBeNull();
    }));

    it('should allow repositioning the menu', fakeAsync(() => {
      detectChangesFakeAsync();

      // Open the menu.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.Open);
      detectChangesFakeAsync();

      const affixer = fixture.componentInstance.dropdownRef['affixer'];
      const affixSpy = spyOn(affixer, 'reaffix').and.callThrough();

      // Reposition the menu.
      fixture.componentInstance.sendMessage(SkyDropdownMessageType.Reposition);
      detectChangesFakeAsync();

      // The affixing method should be called now.
      expect(affixSpy).toHaveBeenCalled();
    }));
  });

  describe('focus properties', () => {

    it('should reflect the state of focus', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();
      button.click();
      detectChangesFakeAsync();

      const firstItemButton = getFirstMenuItem().querySelector('button');

      const dropdownRef = fixture.componentInstance.dropdownRef;

      expect(dropdownRef.buttonIsFocused).toEqual(false);
      expect(dropdownRef.menuIsFocused).toEqual(false);

      button.focus();
      detectChangesFakeAsync();

      expect(dropdownRef.buttonIsFocused).toEqual(true);
      expect(dropdownRef.menuIsFocused).toEqual(false);

      // Move focus to first item.
      firstItemButton.focus();
      detectChangesFakeAsync();

      expect(dropdownRef.buttonIsFocused).toEqual(false);
      expect(dropdownRef.menuIsFocused).toEqual(true);
    }));
  });

  describe('accessibility', function () {
    it('should set default ARIA attributes', fakeAsync(() => {
      detectChangesFakeAsync();
      const button = getButtonElement();

      button.click();
      detectChangesFakeAsync();

      const menu = getMenuElement();
      const item = getFirstMenuItem();

      expect(button.getAttribute('aria-haspopup')).toEqual(menu.getAttribute('role'));
      expect(button.getAttribute('aria-label')).toEqual('Context menu');
      expect(button.getAttribute('aria-expanded')).toEqual('true');
      expect(menu.getAttribute('role')).toEqual('menu');
      expect(menu.getAttribute('aria-labelledby')).toBeNull();
      expect(item.getAttribute('role')).toEqual('menuitem');
    }));

    it('should allow custom overrides of ARIA attributes', fakeAsync(() => {
      detectChangesFakeAsync();
      const button = getButtonElement();

      button.click();
      detectChangesFakeAsync();

      fixture.componentInstance.menuAriaRole = 'menu-role-override';
      fixture.componentInstance.menuAriaLabelledBy = 'menu-labelled-by-override';
      fixture.componentInstance.itemAriaRole = 'item-role-override';
      fixture.componentInstance.label = 'button-label-override';

      detectChangesFakeAsync();
      detectChangesFakeAsync();

      const menu = getMenuElement();
      const item = getFirstMenuItem();

      expect(button.getAttribute('aria-label')).toEqual('button-label-override');
      expect(menu.getAttribute('role')).toEqual('menu-role-override');
      expect(menu.getAttribute('aria-labelledby')).toEqual('menu-labelled-by-override');
      expect(item.getAttribute('role')).toEqual('item-role-override');
    }));

    it('should set the aria-expanded attribute', fakeAsync(() => {
      detectChangesFakeAsync();
      const button = getButtonElement();

      expect(button.getAttribute('aria-expanded')).toEqual('false');

      button.click();
      detectChangesFakeAsync();

      expect(button.getAttribute('aria-expanded')).toEqual('true');

      button.click();
      detectChangesFakeAsync();

      expect(button.getAttribute('aria-expanded')).toEqual('false');
    }));

    it('should set the aria-controls attribute', fakeAsync(() => {
      detectChangesFakeAsync();
      const button = getButtonElement();

      expect(button.getAttribute('aria-controls')).toBeNull();

      button.click();
      detectChangesFakeAsync();

      const menu = getMenuElement();
      expect(button.getAttribute('aria-controls')).toEqual(menu.getAttribute('id'));

      button.click();
      detectChangesFakeAsync();

      expect(button.getAttribute('aria-controls')).toBeNull();
    }));

    it('should set the title attribute', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getButtonElement();

      button.click();
      detectChangesFakeAsync();

      expect(button.getAttribute('title')).toBeNull();

      fixture.componentInstance.title = 'dropdown-title-override';
      detectChangesFakeAsync();

      expect(button.getAttribute('title')).toEqual('dropdown-title-override');
    }));

    it('should be accessible when closed', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(window.document.body).toBeAccessible();
        });
      });
    }));

    it('should be accessible when open', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const button = getButtonElement();

        button.click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(window.document.body).toBeAccessible();
        });
      });
    }));
  });
});
