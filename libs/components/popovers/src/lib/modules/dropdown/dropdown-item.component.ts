import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Specifies the items to display on the dropdown menu.
 */
@Component({
  selector: 'sky-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyDropdownItemComponent implements AfterViewInit {
  /**
   * The ARIA role for the dropdown menu item
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the item functions and what it controls. For information about
   * how an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default "menuitem"
   */
  @Input()
  public set ariaRole(value: string | undefined) {
    this.#_ariaRole = value ?? 'menuitem';
  }

  public get ariaRole(): string {
    return this.#_ariaRole;
  }

  public isActive = false;

  #_ariaRole = 'menuitem';

  #changeDetector: ChangeDetectorRef;
  #renderer: Renderer2;

  constructor(
    public elementRef: ElementRef,
    changeDetector: ChangeDetectorRef,
    renderer: Renderer2,
  ) {
    this.#changeDetector = changeDetector;
    this.#renderer = renderer;
  }

  public ngAfterViewInit(): void {
    // Make sure anchor elements are tab-able.
    const buttonElement = this.#getButtonElement();
    /* istanbul ignore else */
    if (buttonElement) {
      this.#renderer.setAttribute(buttonElement, 'tabIndex', '0');
    }

    this.#changeDetector.detectChanges();
  }

  public focusElement(enableNativeFocus: boolean): void {
    this.isActive = true;

    if (enableNativeFocus) {
      this.#getButtonElement()?.focus();
    }

    this.#changeDetector.detectChanges();
  }

  public isFocusable(): boolean {
    const isFocusable =
      this.#getButtonElement()?.getAttribute('disabled') === null;
    return isFocusable;
  }

  public resetState(): void {
    this.isActive = false;
    this.#changeDetector.markForCheck();
  }

  #getButtonElement(): HTMLButtonElement | null {
    return this.elementRef.nativeElement.querySelector('button,a');
  }
}
