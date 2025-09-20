import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Provides information for and interaction with a SKY UX infinite scroll component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 * @deprecated Use `SkyInfiniteScrollHarness` instead.
 * @internal
 */
export class SkyInfiniteScrollFixture {
  #debugElement: DebugElement;
  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugElement = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-infinite-scroll',
    );
  }

  public get loadMoreButtonIsVisible(): boolean {
    return this.#getButton() !== null;
  }

  public async clickLoadMoreButton(): Promise<void> {
    const button = this.#getButton();

    if (button !== null) {
      button.click();
    }

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  #getButton(): HTMLButtonElement | null {
    return (
      this.#debugElement.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>('.sky-infinite-scroll .sky-btn');
  }
}
