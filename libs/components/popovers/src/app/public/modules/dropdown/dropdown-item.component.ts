import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'sky-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDropdownItemComponent implements AfterViewInit {
  @Input()
  public ariaRole = 'menuitem';

  public get buttonElement(): HTMLButtonElement {
    return this.elementRef.nativeElement.querySelector('button,a');
  }

  public isActive = false;
  public isDisabled = false;

  public constructor(
    public elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }

  public ngAfterViewInit() {
    this.isDisabled = !this.isFocusable();

    // Make sure anchor elements are tab-able.
    const buttonElement = this.buttonElement;
    /* istanbul ignore else */
    if (buttonElement) {
      this.renderer.setAttribute(buttonElement, 'tabIndex', '0');
    }

    this.changeDetector.detectChanges();
  }

  public focusElement(enableNativeFocus: boolean) {
    this.isActive = true;

    if (enableNativeFocus) {
      this.buttonElement.focus();
    }

    this.changeDetector.detectChanges();
  }

  public isFocusable(): boolean {
    /*tslint:disable no-null-keyword */
    const isFocusable = (
      this.buttonElement &&
      this.buttonElement.getAttribute('disabled') === null
    );
    /*tslint:enable */
    return isFocusable;
  }

  public resetState() {
    this.isActive = false;
    this.changeDetector.markForCheck();
  }
}
