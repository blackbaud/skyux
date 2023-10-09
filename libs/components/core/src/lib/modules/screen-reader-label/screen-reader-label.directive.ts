import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';

const SCREEN_READER_LABELS_CONTAINER_ID = 'sky-screen-reader-labels-container';

/**
 * Adds the element to a screen reader only section of the body.
 * This prevents components' DOM from including text only intended for screen readers.
 */
@Directive({
  selector: '[skyScreenReaderLabel]',
  standalone: true,
})
export class SkyScreenReaderLabelDirective implements OnInit {
  public ngOnInit(): void {
    this.#insertScreenReaderLabel();
  }

  @Input()
  public set destroyRef(ref: DestroyRef) {
    ref.onDestroy(() => this.#removeScreenReaderLabel());
  }

  @Input()
  public set createLabel(value: boolean | undefined) {
    this.#_createLabel = value ?? false;
    this.#insertScreenReaderLabel();
  }

  public get createLabel(): boolean {
    return this.#_createLabel;
  }

  readonly #elementRef = inject(ElementRef);
  #_createLabel = false;

  #insertScreenReaderLabel(): void {
    const screenReaderLabelsContainerEl =
      this.#getScreenReaderLabelsContainerEl();
    if (this.createLabel) {
      screenReaderLabelsContainerEl.append(this.#elementRef.nativeElement);
    } else {
      this.#removeScreenReaderLabel();
    }
  }

  #getScreenReaderLabelsContainerEl(): HTMLElement {
    let containerEl = document.getElementById(
      SCREEN_READER_LABELS_CONTAINER_ID
    );

    if (!containerEl) {
      const el = document.createElement('div');
      el.id = SCREEN_READER_LABELS_CONTAINER_ID;
      el.style.display = 'none';

      document.body.append(el);
      containerEl = el;
    }

    return containerEl;
  }

  #removeScreenReaderLabel(): void {
    const screenReaderLabelsContainerEl =
      this.#getScreenReaderLabelsContainerEl();
    this.#elementRef.nativeElement.remove();

    if (screenReaderLabelsContainerEl.childNodes.length === 0) {
      screenReaderLabelsContainerEl.remove();
    }
  }
}
