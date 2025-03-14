import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyPagingFixtureButton } from './paging-fixture-button';

/**
 * Provides information for and interaction with a SKY UX paging component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 * @internal
 */
export class SkyPagingFixture {
  #_debugEl: DebugElement;

  /**
   * The id of the active page, if available.
   */
  public get activePageId(): string {
    return this.#getPageId(this.#activePageButton);
  }

  /**
   * Properties of the page links displayed in the paging component.
   */
  public get pageLinks(): SkyPagingFixtureButton[] {
    return this.#pagingLinks.map((page: DebugElement) => {
      return {
        id: this.#getPageId(page.nativeElement),
        isActive: page.nativeElement.classList.contains('sky-paging-current'),
        isEnabled: !page.nativeElement.disabled,
      };
    });
  }

  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#_debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-paging',
    );

    void this.#waitForComponentInitialization();
  }

  /**
   * Selects the specified page by id, if it is enabled.
   */
  public async selectPage(id: string | number): Promise<void> {
    const pageButton = this.#getPageLink(id.toString());

    if (pageButton !== undefined && !pageButton.disabled) {
      pageButton.click();

      this.#fixture.detectChanges();
      await this.#fixture.whenStable();
    }
  }

  /**
   * Clicks the next page button, if it is enabled.
   */
  public async selectNextPage(): Promise<void> {
    const nextButton = this.#nextPageButton;

    if (nextButton !== undefined && !nextButton.disabled) {
      nextButton.click();

      this.#fixture.detectChanges();
      await this.#fixture.whenStable();
    }
  }

  /**
   * Clicks the previous page button, if it is enabled.
   */
  public async selectPreviousPage(): Promise<void> {
    const previousButton = this.#previousPageButton;

    if (previousButton !== undefined && !previousButton.disabled) {
      previousButton.click();

      this.#fixture.detectChanges();
      await this.#fixture.whenStable();
    }
  }

  //#region helpers

  get #activePageButton(): HTMLButtonElement {
    return this.#_debugEl.query(
      By.css('.sky-list-paging-link .sky-paging-current'),
    )?.nativeElement as HTMLButtonElement;
  }

  get #nextPageButton(): HTMLButtonElement {
    return this.#_debugEl.query(By.css('.sky-paging-btn[sky-cmp-id="next"]'))
      ?.nativeElement as HTMLButtonElement;
  }

  get #previousPageButton(): HTMLButtonElement {
    return this.#_debugEl.query(
      By.css('.sky-paging-btn[sky-cmp-id="previous"]'),
    )?.nativeElement as HTMLButtonElement;
  }

  get #pagingLinks(): DebugElement[] {
    return this.#_debugEl.queryAll(By.css('.sky-list-paging-link button'));
  }

  #getPageLink(id: string): HTMLButtonElement {
    return this.#_debugEl.query(
      By.css(`.sky-list-paging-link button[sky-cmp-id="${id}"]`),
    )?.nativeElement as HTMLButtonElement;
  }

  #getPageId(page: HTMLButtonElement): string {
    return page?.getAttribute('sky-cmp-id') ?? '';
  }

  async #waitForComponentInitialization(): Promise<void> {
    this.#fixture.detectChanges();
    await this.#fixture.whenStable();

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  //#endregion
}
