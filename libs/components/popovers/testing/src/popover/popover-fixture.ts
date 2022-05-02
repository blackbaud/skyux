import { ComponentFixture } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Provides information for and interaction with a SKY UX popover component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyPopoverFixture {
  /**
   * Returns the popover alignment if the popover is open, otherwise undefined.
   */
  public get alignment(): string | undefined {
    return this.getClassSuffixByClassPrefix(
      this.containerElement,
      'sky-popover-alignment-'
    );
  }

  /**
   * Returns the popover body element if the popover is open, otherwise undefined.
   */
  public get body(): HTMLElement | undefined {
    return this.bodyElement;
  }

  /**
   * Returns the popover position if the popover is open, otherwise undefined.
   */
  public get placement(): string | undefined {
    return this.getClassSuffixByClassPrefix(
      this.containerElement,
      'sky-popover-placement-'
    );
  }

  /**
   * Returns the popover title text if the popover is open, otherwise undefined.
   */
  public get popoverTitle(): string | undefined {
    return SkyAppTestUtility.getText(this.titleElement);
  }

  /**
   * Indicates if the popover is open and visible.
   */
  public get popoverIsVisible(): boolean {
    return this.contentElement !== undefined;
  }

  constructor(private fixture: ComponentFixture<unknown>) {}

  /**
   * Triggers the blur event for the popover.
   */
  public blur(): Promise<unknown> {
    // close the popover by changing focus to the body element
    SkyAppTestUtility.fireDomEvent(window.document.body, 'click');

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  //#region helpers
  private get contentElement(): HTMLElement | undefined {
    return this.queryOverlay('sky-popover-content') || undefined;
  }

  private get containerElement(): HTMLElement | undefined {
    return this.queryOverlay('.sky-popover-container') || undefined;
  }

  private get titleElement(): HTMLElement | undefined {
    return this.queryOverlay('.sky-popover-title') || undefined;
  }

  private get bodyElement(): HTMLElement | undefined {
    return this.queryOverlay('.sky-popover-body') || undefined;
  }

  private getOverlay(): Element | undefined {
    return document.querySelector('sky-overlay') || undefined;
  }

  private queryOverlay(query: string): HTMLElement | null {
    const overlay = this.getOverlay();

    return !overlay ? null : overlay.querySelector(query);
  }

  /**
   * Searches the element's class names for a class which matches a given prefix.
   * If a match is found, the prefix is trimmed from the class name and the suffix is returned.
   * If no class matching the prefix is found, undefined is returned.
   *
   * Example:
   *   For a class 'sky-popover-placement-right', passing the prefix 'sky-popover-placement-'
   *   should return the value 'right'.
   * @param prefix
   */
  private getClassSuffixByClassPrefix(
    element: HTMLElement | undefined,
    prefix: string
  ): string | undefined {
    const containerClasses = element?.className.split(' ');
    const prefixedClass = containerClasses?.find((x) => x.startsWith(prefix));

    return !prefixedClass ? undefined : prefixedClass.slice(prefix.length);
  }
  //#endregion
}
