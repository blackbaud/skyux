import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyTabsetFixtureTab } from './tab-fixture-tab';

/**
 * Allows interaction with a SKY UX tabset component.
 * @deprecated Use `SkyTabsetHarness` instead.
 * @internal
 */
export class SkyTabsetFixture {
  /**
   * The tabset component's ARIA label.
   */
  public get ariaLabel(): string | undefined {
    const tabsetEl = this.#getTabsetEl();
    return tabsetEl.getAttribute('aria-label') || undefined;
  }

  /**
   * The tabset component's ARIA labelled by attribute.
   */
  public get ariaLabelledBy(): string | undefined {
    const tabsetEl = this.#getTabsetEl();
    return tabsetEl.getAttribute('aria-labelledby') || undefined;
  }

  /**
   * The index of the currently selected tab.
   */
  public get activeTabIndex(): number {
    const tabLinkEls = this.#getTabLinkEls();

    for (let i = 0, n = tabLinkEls.length; i < n; i++) {
      if (tabLinkEls.item(i).classList.contains('sky-btn-tab-selected')) {
        return i;
      }
    }

    /* safety check */
    /* istanbul ignore next */
    return -1;
  }

  #debugEl: DebugElement;
  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-tabset',
    );
  }

  /**
   * Retrieves information about the tab at the specified index.
   * @param tabIndex The index of the tab.
   */
  public getTab(tabIndex: number): SkyTabsetFixtureTab {
    const tabLinkEl = this.#getTabLinkEl(tabIndex);

    const active = this.activeTabIndex === tabIndex;
    const disabled = tabLinkEl.classList.contains('sky-btn-tab-disabled');
    const tabHeading = this.#getTextContent(
      tabLinkEl.querySelector('.sky-tab-heading span')?.childNodes[0],
    );
    const tabHeaderCount = this.#getTextContent(
      tabLinkEl.querySelector('.sky-tab-header-count'),
    );

    let permalinkValue: string | undefined;

    if (tabLinkEl.href) {
      const permalink = tabLinkEl.href.split('?')[1];
      if (permalink) {
        const permalinkParts = permalink.split('=');

        permalinkValue = decodeURIComponent(permalinkParts[1]);
      }
    }

    return {
      active,
      disabled,
      permalinkValue,
      tabHeaderCount,
      tabHeading,
    };
  }

  /**
   * Clicks the tabset's "new" button.
   */
  public async clickNewButton(): Promise<void> {
    await this.#clickButton('sky-tabset-btn-new');
  }

  /**
   * Clicks the tabset's "open" button.
   */
  public async clickOpenButton(): Promise<void> {
    await this.#clickButton('sky-tabset-btn-open');
  }

  /**
   * Clicks the tab button at the specified index.
   * @param tabIndex The index of the tab.
   */
  public async clickTab(tabIndex: number): Promise<void> {
    const tabLinkEl = this.#getTabLinkEl(tabIndex);

    tabLinkEl.click();

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  /**
   * Click's the tab's close button at the specified index.
   * @param tabIndex The index of the tab.
   */
  public async clickTabClose(tabIndex: number): Promise<void> {
    const tabWrapperEl = this.#getTabsetEl().querySelectorAll(
      `.sky-tabset-tabs .sky-btn-tab-wrapper`,
    )[tabIndex];

    const closeBtnEl = tabWrapperEl.querySelector(
      '.sky-btn-tab-close',
    ) as HTMLButtonElement;

    if (!closeBtnEl) {
      throw new Error('The specified tab does not have a close button.');
    }

    closeBtnEl.click();

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  async #clickButton(buttonCls: string): Promise<void> {
    const tabsetEl = this.#getTabsetEl();

    const newButtonEl = tabsetEl.querySelector(
      `.sky-tabset-btns .${buttonCls}`,
    ) as HTMLButtonElement;

    newButtonEl.click();

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  #getTabsetEl(): HTMLDivElement {
    const tabsetEl = this.#debugEl.query(By.css('.sky-tabset')).nativeElement;

    return tabsetEl;
  }

  #getTabLinkEls(): NodeListOf<HTMLAnchorElement> {
    return this.#getTabsetEl().querySelectorAll(
      `.sky-tabset-tabs .sky-btn-tab`,
    );
  }

  #getTabLinkEl(tabIndex: number): HTMLAnchorElement {
    const tabLinkEl = this.#getTabLinkEls().item(tabIndex);

    if (!tabLinkEl) {
      throw new Error(`There is no tab at index ${tabIndex}.`);
    }

    return tabLinkEl;
  }

  #getTextContent(el: Element | Node | undefined | null): string | undefined {
    return (el && el.textContent?.trim()) || undefined;
  }
}
