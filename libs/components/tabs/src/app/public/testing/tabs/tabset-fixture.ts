import {
  ComponentFixture
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyTabsetFixtureTab
} from './tab-fixture-tab';

/**
 * Allows interaction with a SKY UX tabset component.
 */
export class SkyTabsetFixture {

  /**
   * The tabset component's ARIA label.
   */
  public get ariaLabel(): string {
    const tabsetEl = this.getTabsetEl();
    return tabsetEl.getAttribute('aria-label') || undefined;
  }

  /**
   * The tabset component's ARIA labelled by attribute.
   */
  public get ariaLabelledBy(): string {
    const tabsetEl = this.getTabsetEl();
    return tabsetEl.getAttribute('aria-labelledby') || undefined;
  }

  /**
   * The index of the currently selected tab.
   */
  public get activeTabIndex(): number {
    const tabLinkEls = this.getTabLinkEls();

    for (let i = 0, n = tabLinkEls.length; i < n; i++) {
      if (tabLinkEls.item(i).classList.contains('sky-btn-tab-selected')) {
        return i;
      }
    }

    return -1;
  }

  private debugEl: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-tabset');
  }

  /**
   * Retrieves information about the tab at the specified index.
   * @param tabIndex The index of the tab.
   */
  public getTab(tabIndex: number): SkyTabsetFixtureTab {
    const tabLinkEl = this.getTabLinkEl(tabIndex);

    const active = this.activeTabIndex === tabIndex;
    const disabled = tabLinkEl.classList.contains('sky-btn-tab-disabled');
    const tabHeading = this.getTextContent(
      tabLinkEl.querySelector('.sky-tab-heading').childNodes[0]
    );
    const tabHeaderCount = this.getTextContent(tabLinkEl.querySelector('.sky-tab-header-count'));

    let permalinkValue: string;

    if (tabLinkEl.href) {
      const permalink = tabLinkEl.href.split(';')[1];

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
      tabHeading
    };
  }

  /**
   * Clicks the tabset's "new" button.
   */
  public async clickNewButton(): Promise<any> {
    return this.clickButton('sky-tabset-btn-new');
  }

  /**
   * Clicks the tabset's "open" button.
   */
  public async clickOpenButton(): Promise<any> {
    return this.clickButton('sky-tabset-btn-open');
  }

  /**
   * Clicks the tab button at the specified index.
   * @param tabIndex The index of the tab.
   */
  public async clickTab(tabIndex: number): Promise<any> {
    const tabLinkEl = this.getTabLinkEl(tabIndex);

    if (!tabLinkEl) {
      throw new Error(`There is no tab at index ${tabIndex}.`);
    }

    tabLinkEl.click();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  /**
   * Click's the tab's close button at the specified index.
   * @param tabIndex The index of the tab.
   */
  public async clickTabClose(tabIndex: number): Promise<any> {
    const tabLinkEl = this.getTabLinkEl(tabIndex);

    const closeBtnEl = tabLinkEl.querySelector('.sky-btn-tab-close') as HTMLButtonElement;

    if (!closeBtnEl) {
      throw new Error('The specified tab does not have a close button.');
    }

    closeBtnEl.click();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  private async clickButton(buttonCls: string): Promise<any> {
    const tabsetEl = this.getTabsetEl();

    const newButtonEl =
      tabsetEl.querySelector(`.sky-tabset-btns .${buttonCls}`) as HTMLButtonElement;

    newButtonEl.click();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  private getTabsetEl(): HTMLDivElement {
    const tabsetEl = this.debugEl.query(By.css('.sky-tabset')).nativeElement;

    return tabsetEl;
  }

  private getTabLinkEls(): NodeListOf<HTMLAnchorElement> {
    return this.getTabsetEl().querySelectorAll(
      `.sky-tabset-tabs .sky-btn-tab`
    );
  }

  private getTabLinkEl(tabIndex: number): HTMLAnchorElement {
    const tabLinkEl = this.getTabLinkEls().item(tabIndex);

    if (!tabLinkEl) {
      throw new Error(`There is no tab at index ${tabIndex}.`);
    }

    return tabLinkEl;
  }

  private getTextContent(el: Element | Node): string {
    return (el && el.textContent.trim()) || undefined;
  }

}
