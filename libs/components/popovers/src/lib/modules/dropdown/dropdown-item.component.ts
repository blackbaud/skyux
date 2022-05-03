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
})
export class SkyDropdownItemComponent implements AfterViewInit {
  /**
   * Specifies an ARIA role for the dropdown menu item
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the item functions and what it controls. For information about
   * how an ARIA role indicates what an item represents on a web page, see the
   * [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   * @default "menuitem"
   */
  @Input()
  public set ariaRole(value: string | undefined) {
    this._ariaRole = value;
  }

  public get ariaRole(): string {
    return this._ariaRole || 'menuitem';
  }

  public get buttonElement(): HTMLButtonElement {
    return this.elementRef.nativeElement.querySelector('button,a');
  }

  public isActive = false;

  public isDisabled = false;

  private _ariaRole: string | undefined;

  public constructor(
    public elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    this.isDisabled = !this.isFocusable();

    // Make sure anchor elements are tab-able.
    const buttonElement = this.buttonElement;
    /* istanbul ignore else */
    if (buttonElement) {
      this.renderer.setAttribute(buttonElement, 'tabIndex', '0');
    }

    this.changeDetector.detectChanges();
  }

  public focusElement(enableNativeFocus: boolean): void {
    this.isActive = true;

    if (enableNativeFocus) {
      this.buttonElement.focus();
    }

    this.changeDetector.detectChanges();
  }

  public isFocusable(): boolean {
    /*tslint:disable no-null-keyword */
    const isFocusable =
      this.buttonElement &&
      this.buttonElement.getAttribute('disabled') === null;
    /*tslint:enable */
    return isFocusable;
  }

  public resetState(): void {
    this.isActive = false;
    this.changeDetector.markForCheck();
  }
}
