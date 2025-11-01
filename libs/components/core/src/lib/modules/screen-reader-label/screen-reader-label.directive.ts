import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';

const SCREEN_READER_LABELS_CONTAINER_ID = 'sky-screen-reader-labels-container';

/**
 * Adds the element to a screen reader only section of the body.
 * This prevents components' DOM from including text only intended for screen readers.
 *
 * @internal
 */
@Directive({
  selector: '[skyScreenReaderLabel]',
})
export class SkyScreenReaderLabelDirective implements OnDestroy {
  public ngOnDestroy(): void {
    this.#removeLabelEl();
  }

  /**
   * Indicates if the label should be created in the DOM.
   * @default false
   */
  @Input()
  public set createLabel(value: boolean | undefined) {
    this.#_createLabel = value ?? false;
    this.#updateLabelEl();
  }

  public get createLabel(): boolean {
    return this.#_createLabel;
  }

  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  #_createLabel = false;

  #updateLabelEl(): void {
    if (this.createLabel) {
      const containerEl = this.#getContainerEl() || this.#createContainerEl();

      this.#renderer.appendChild(containerEl, this.#elementRef.nativeElement);
    } else {
      this.#removeLabelEl();
    }
  }

  #getContainerEl(): HTMLElement | null {
    return document.getElementById(SCREEN_READER_LABELS_CONTAINER_ID);
  }

  #createContainerEl(): HTMLElement {
    const el = document.createElement('div');
    el.id = SCREEN_READER_LABELS_CONTAINER_ID;
    el.style.display = 'none';

    this.#renderer.appendChild(document.body, el);

    return el;
  }

  #removeLabelEl(): void {
    const containerEl = this.#getContainerEl();

    this.#elementRef.nativeElement.remove();

    if (containerEl && containerEl.childNodes.length === 0) {
      containerEl.remove();
    }
  }
}
