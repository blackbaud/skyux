import { ComponentFixture } from '@angular/core/testing';

/**
 * Allows interaction with a SKY UX modal component.
 * @deprecated Use `SkyModalHarness` instead.
 * @internal
 */
export class SkyModalFixture {
  #modalElement: HTMLElement;

  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    const modalElement = document.querySelector(
      'sky-modal[data-sky-id="' + skyTestId + '"]',
    ) as HTMLElement;

    if (!modalElement) {
      throw new Error(
        `No element was found with a \`data-sky-id\` value of "${skyTestId}".`,
      );
    }

    this.#modalElement = modalElement;
  }

  /**
   * The modal component's ARIA describedby attribute.
   */
  public get ariaDescribedBy(): string | undefined {
    const modalDialogElement = this.#getModalDialogElement();
    /* Non-null assertion as our component has a default for if the user does not provide this attribute or if they provide "undefined" */
    const describedByAttribute =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      modalDialogElement.getAttribute('aria-describedby')!;
    return describedByAttribute;
  }

  /**
   * The modal component's ARIA labelledby attribute.
   */
  public get ariaLabelledBy(): string | undefined {
    const modalDialogElement = this.#getModalDialogElement();
    /* Non-null assertion as our component has a default for if the user does not provide this attribute or if they provide "undefined" */
    const labelledByAttribute =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      modalDialogElement.getAttribute('aria-labelledby')!;

    return labelledByAttribute;
  }

  /**
   * The modal component's role attribute.
   */
  public get ariaRole(): string | undefined {
    const modalDialogElement = this.#getModalDialogElement();
    /* Non-null assertion as our component has a default for if the user does not provide this attribute or if they provide "undefined" */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const roleAttribute = modalDialogElement.getAttribute('role')!;
    return roleAttribute;
  }

  /**
   * Whether or not the modal is a full page modal.
   */
  public get fullPage(): boolean {
    const modalDivElement = this.getModalDiv();
    return modalDivElement.classList.contains('sky-modal-full-page');
  }

  /**
   * The size of the modal.
   */
  public get size(): string | undefined {
    const modalDivElement = this.getModalDiv();
    const possibleSizes = ['small', 'medium', 'large'];

    for (const size of possibleSizes) {
      if (modalDivElement.classList.contains('sky-modal-' + size)) {
        return size;
      }
    }

    return;
  }

  /**
   * Whether or not the modal is set up for tiled content.
   */
  public get tiledBody(): boolean {
    const modalDivElement = this.getModalDiv();
    return modalDivElement.classList.contains('sky-modal-tiled');
  }

  /**
   * Clicks the modal header's "close" button.
   */
  public clickHeaderCloseButton(): void {
    this.#checkModalElement();
    const closeButton: HTMLElement | null = this.#modalElement.querySelector(
      '.sky-modal .sky-modal-btn-close',
    );

    if (
      closeButton &&
      window.getComputedStyle(closeButton).display !== 'none'
    ) {
      closeButton.click();
      this.#fixture.detectChanges();
    } else {
      throw new Error(`No header close button exists.`);
    }
  }

  /**
   * Clicks the modal header's "help" button.
   */
  public clickHelpButton(): void {
    this.#checkModalElement();
    const helpButton: HTMLElement | null = this.#modalElement.querySelector(
      '.sky-modal .sky-modal-header-buttons button[name="help-button"]',
    );

    if (helpButton && window.getComputedStyle(helpButton).display !== 'none') {
      helpButton.click();
      this.#fixture.detectChanges();
    } else {
      throw new Error(`No help button exists.`);
    }
  }

  /**
   * Returns the main modal element.
   */
  public getModalDiv(): any {
    this.#checkModalElement();
    return this.#modalElement.querySelector('.sky-modal');
  }

  /**
   * Returns the modal's content element.
   */
  public getModalContentEl(): any {
    this.#checkModalElement();
    return this.#modalElement.querySelector('.sky-modal-content');
  }

  /**
   * Returns the modal's footer element.
   */
  public getModalFooterEl(): any {
    this.#checkModalElement();
    return this.#modalElement.querySelector('.sky-modal-footer');
  }

  /**
   * Returns the modal's header element.
   */
  public getModalHeaderEl(): any {
    this.#checkModalElement();
    return this.#modalElement.querySelector('.sky-modal-header');
  }

  #checkModalElement(): void {
    if (!document.contains(this.#modalElement)) {
      throw new Error('Modal element no longer exists. Was the modal closed?');
    }
  }

  #getModalDialogElement(): HTMLElement {
    this.#checkModalElement();
    // We can always know that the dialog element will exist if the modal is open and exists.
    return this.#modalElement.querySelector('.sky-modal-dialog')!;
  }
}
