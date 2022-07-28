import { ComponentFixture } from '@angular/core/testing';

/**
 * Allows interaction with a SKY UX modal component.
 */
export class SkyModalFixture {
  #modalElement: HTMLElement;

  #fixture: ComponentFixture<any>;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#fixture = fixture;
    const modalElement = document.querySelector(
      'sky-modal[data-sky-id="' + skyTestId + '"]'
    ) as HTMLElement;

    if (!modalElement) {
      throw new Error(
        `No element was found with a \`data-sky-id\` value of "${skyTestId}".`
      );
    } else {
      this.#modalElement = modalElement;
    }
  }

  /**
   * The modal component's ARIA describedby attribute.
   */
  public get ariaDescribedBy(): string | undefined {
    const modalDialogElement = this.#getModalDiaglogElement();
    if (modalDialogElement) {
      return modalDialogElement.getAttribute('aria-describedby') || undefined;
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * The modal component's ARIA labelledby attribute.
   */
  public get ariaLabelledBy(): string | undefined {
    const modalDialogElement = this.#getModalDiaglogElement();
    if (modalDialogElement) {
      return modalDialogElement.getAttribute('aria-labelledby') || undefined;
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * The modal component's role attribute.
   */
  public get ariaRole(): string | undefined {
    const modalDialogElement = this.#getModalDiaglogElement();
    if (modalDialogElement) {
      return modalDialogElement.getAttribute('role') || undefined;
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * Whether or not the modal is a full page modal.
   */
  public get fullPage(): boolean {
    const modalDivElement = this.getModalDiv();
    if (modalDivElement) {
      return modalDivElement.classList.contains('sky-modal-full-page');
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * The size of the modal.
   */
  public get size(): string | undefined {
    const modalDivElement = this.getModalDiv();

    if (modalDivElement) {
      const possibleSizes = ['small', 'medium', 'large'];

      for (let size of possibleSizes) {
        if (modalDivElement.classList.contains('sky-modal-' + size)) {
          return size;
        }
      }

      return;
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * Whether or not the modal is set up for tiled content.
   */
  public get tiledBody(): boolean {
    const modalDivElement = this.getModalDiv();
    if (modalDivElement) {
      return modalDivElement.classList.contains('sky-modal-tiled');
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * Clicks the modal header's "close" button.
   */
  public clickHeaderCloseButton(): void {
    const closeButton: HTMLElement | null = this.#modalElement.querySelector(
      '.sky-modal .sky-modal-btn-close'
    );

    if (closeButton) {
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
    const helpButton: HTMLElement | null = this.#modalElement.querySelector(
      '.sky-modal .sky-modal-header-buttons button[name="help-button"]'
    );

    if (helpButton) {
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
    if (this.#modalElement) {
      return this.#modalElement.querySelector('.sky-modal');
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * Returns the modal's content element.
   */
  public getModalContentEl(): any {
    if (this.#modalElement) {
      return this.#modalElement.querySelector('.sky-modal-content');
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * Returns the modal's footer element.
   */
  public getModalFooterEl(): any {
    if (this.#modalElement) {
      return this.#modalElement.querySelector('.sky-modal-footer');
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  /**
   * Returns the modal's header element.
   */
  public getModalHeaderEl(): any {
    if (this.#modalElement) {
      return this.#modalElement.querySelector('.sky-modal-header');
    } else {
      throw new Error(`No modal exists.`);
    }
  }

  #getModalDiaglogElement(): HTMLElement {
    if (this.#modalElement) {
      const modalDialog: HTMLElement | null =
        this.#modalElement.querySelector('.sky-modal-dialog');

      if (modalDialog) {
        return modalDialog;
      } else {
        throw new Error(`No modal exists.`);
      }
    } else {
      throw new Error(`No modal exists.`);
    }
  }
}
