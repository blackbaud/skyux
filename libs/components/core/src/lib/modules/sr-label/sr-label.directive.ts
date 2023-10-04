import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';

const SR_LABELS_CONTAINER_ID = 'sky-sr-labels-container';

/**
 * Adds the element to a screen reader only section of the body.
 * This prevents components' DOM from including text only intended for screen readers.
 */
@Directive({
  selector: '[skySrLabel]',
  standalone: true,
})
export class SkySrLabelDirective implements OnInit {
  readonly #elementRef = inject(ElementRef);
  #_createLabel = true;

  public ngOnInit(): void {
    this.#insertSrLabel();
  }

  @Input()
  public set destroyRef(ref: DestroyRef) {
    ref.onDestroy(() => this.#removeSrLabel());
  }

  @Input()
  public set createLabel(value: boolean | undefined) {
    this.#_createLabel = value ?? true;
    this.#insertSrLabel();
  }

  public get createLabel(): boolean {
    return this.#_createLabel;
  }

  #insertSrLabel(): void {
    const srLabelsContainerEl = this.#getSrLabelsContainerEl();
    if (this.createLabel) {
      srLabelsContainerEl.append(this.#elementRef.nativeElement);
    } else {
      this.#removeSrLabel();
    }
  }

  #getSrLabelsContainerEl(): HTMLElement {
    let containerEl = document.getElementById(SR_LABELS_CONTAINER_ID);

    if (!containerEl) {
      const el = document.createElement('div');
      el.id = SR_LABELS_CONTAINER_ID;
      el.style.display = 'none';

      document.body.append(el);
      containerEl = el;
    }

    return containerEl;
  }

  #removeSrLabel(): void {
    const srLabelsContainerEl = this.#getSrLabelsContainerEl();
    this.#elementRef.nativeElement.remove();

    if (srLabelsContainerEl.childNodes.length === 0) {
      srLabelsContainerEl.remove();
    }
  }
}
