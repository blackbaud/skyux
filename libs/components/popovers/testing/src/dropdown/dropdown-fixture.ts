import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyPopoversFixtureDropdown } from './popovers-fixture-dropdown';
import { SkyPopoversFixtureDropdownItem } from './popovers-fixture-dropdown-item';
import { SkyPopoversFixtureDropdownMenu } from './popovers-fixture-dropdown-menu';

/**
 * Provides information for and interaction with a SKY UX dropdown component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyDropdownFixture {
  /**
   * Returns information about the dropdown component.
   */
  public get dropdown(): SkyPopoversFixtureDropdown | undefined {
    const button = this.buttonDebugElement;

    if (!button) {
      return;
    }

    return {
      buttonStyle: this.getButtonStyle(button.classes),
      buttonType: this.getButtonType(button.classes),
      disabled: button.nativeElement.disabled,
      label: button.nativeElement.getAttribute('aria-label'),
      title: button.nativeElement.getAttribute('title'),
    };
  }

  /**
   * Returns the dropdown button's text.
   */
  public get dropdownButtonText(): string | undefined {
    return SkyAppTestUtility.getText(this.buttonDebugElement.nativeElement);
  }

  /**
   * Returns information about the dropdown menu component.
   */
  public get dropdownMenu(): SkyPopoversFixtureDropdownMenu | undefined {
    const menu = this.getDropdownMenuContent();
    if (!menu) {
      return;
    }

    return {
      ariaLabelledBy: menu.getAttribute('aria-labelledby'),
      ariaRole: menu.getAttribute('role'),
    };
  }

  /**
   * Indicates if the dropdown menu is open and visible.
   */
  public get dropdownMenuIsVisible(): boolean {
    return this.getDropdownMenuContent() !== undefined;
  }

  private get buttonDebugElement(): DebugElement {
    return this.debugEl.query(By.css('.sky-dropdown-button'));
  }

  private debugEl: DebugElement;

  constructor(private fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-dropdown'
    );
  }

  /**
   * Click the dropdown button to open or close the dropdown menu.
   */
  public async clickDropdownButton(): Promise<unknown> {
    this.buttonDebugElement.nativeElement.click();
    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  /**
   * Click the dropdown item at the provided index.
   */
  public async clickDropdownItem(index: number): Promise<unknown> {
    const itemEls = this.getDropdownItemEls();

    if (!itemEls) {
      return;
    }

    if (index >= itemEls.length) {
      throw new Error(`There is no dropdown item at index ${index}.`);
    }

    itemEls[index].querySelector('button,a').click();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  /**
   * Returns information about the dropdown item at the provided index.
   */
  public getDropdownItem(
    index: number
  ): SkyPopoversFixtureDropdownItem | undefined {
    const itemEls = this.getDropdownItemEls();

    if (!itemEls) {
      return;
    }

    if (index >= itemEls.length) {
      throw new Error(`There is no dropdown item at index ${index}.`);
    }

    const item = itemEls[index];
    if (!item) {
      return;
    }

    return {
      ariaRole: item.getAttribute('role'),
    };
  }

  /**
   * Returns the contents of the dropdown menu.
   */
  public getDropdownMenuContent(): any {
    const overlay = this.getOverlay();
    if (!overlay) {
      return;
    }

    return overlay.querySelector('.sky-dropdown-menu');
  }

  private getDropdownItemEls(): NodeListOf<any> | undefined {
    const overlay = this.getOverlay();

    if (!overlay) {
      return;
    }

    return overlay.querySelectorAll('.sky-dropdown-item');
  }

  private getOverlay(): HTMLElement | null {
    return document.querySelector('sky-overlay');
  }

  private getButtonStyle(classNames: {
    [key: string]: boolean;
  }): string | undefined {
    if (classNames['sky-btn-primary']) {
      return 'primary';
    }
    if (classNames['sky-btn-default']) {
      return 'default';
    }
  }

  private getButtonType(classNames: {
    [key: string]: boolean;
  }): string | undefined {
    const prefix = 'sky-dropdown-button-type-';

    for (const i in classNames) {
      if (classNames[i]) {
        if (i.indexOf(prefix) > -1) {
          return i.replace(prefix, '');
        }
      }
    }

    return undefined;
  }
}
