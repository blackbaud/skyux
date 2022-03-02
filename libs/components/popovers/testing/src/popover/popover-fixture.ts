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
  public get alignment(): string {
    return this.getClassSuffixByClassPrefix(
      this.containerElement,
      'sky-popover-alignment-'
    );
  }

  /**
   * Returns the popover body element if the popover is open, otherwise undefined.
   */
  public get body(): HTMLElement {
    return this.bodyElement;
  }

  /**
   * Returns the popover position if the popover is open, otherwise undefined.
   */
  public get placement(): string {
    return this.getClassSuffixByClassPrefix(
      this.containerElement,
      'sky-popover-placement-'
    );
  }

  /**
   * Returns the popover title text if the popover is open, otherwise undefined.
   */
  public get popoverTitle(): string {
    return SkyAppTestUtility.getText(this.titleElement);
  }

  /**
   * Indicates if the popover is open and visible.
   */
  public get popoverIsVisible(): boolean {
    return this.contentElement !== undefined;
  }

  constructor(private fixture: ComponentFixture<any>) {}

  /**
   * Triggers the blur event for the popover.
   */
  public blur(): Promise<any> {
    // close the popover by changing focus to the body element
    SkyAppTestUtility.fireDomEvent(window.document.body, 'click');

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  //#region helpers
  private get contentElement(): HTMLElement {
    return this.queryOverlay('sky-popover-content');
  }

  private get containerElement(): HTMLElement {
    return this.queryOverlay('.sky-popover-container');
  }

  private get titleElement(): HTMLElement {
    return this.queryOverlay('.sky-popover-title');
  }

  private get bodyElement(): HTMLElement {
    return this.queryOverlay('.sky-popover-body');
  }

  private getOverlay(): HTMLElement {
    return document.querySelector('sky-overlay');
  }

  private queryOverlay(query: string): HTMLElement {
    const overlay = this.getOverlay();

    return !overlay ? undefined : overlay.querySelector(query);
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
    element: HTMLElement,
    prefix: string
  ): string {
    let containerClasses = element?.className.split(' ');
    let prefixedClass = containerClasses?.find((x) => x.startsWith(prefix));

    return !prefixedClass ? undefined : prefixedClass.slice(prefix.length);
  }
  //#endregion
}
