import {
  Injectable,
  OnDestroy,
  Renderer2,
  ElementRef
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

/**
 * Service for interacting with the DOM elements of the phone field.
 * @internal
 */
@Injectable()
export class SkyPhoneFieldAdapterService implements OnDestroy {

  private ngUnsubscribe = new Subject();

  constructor(
    private renderer: Renderer2,
    private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public addElementClass(elementRef: ElementRef, className: string): void {
    this.renderer.addClass(elementRef.nativeElement, className);
  }

  public setElementDisabledState(elementRef: ElementRef, disabled: boolean): void {
    this.renderer.setProperty(
      elementRef.nativeElement,
      'disabled',
      disabled
    );
  }

  public setElementPlaceholder(elementRef: ElementRef, placeholder: string): void {
    this.renderer.setAttribute(elementRef.nativeElement, 'placeholder', placeholder);
  }

  public setElementType(elementRef: ElementRef): void {
    this.renderer.setAttribute(elementRef.nativeElement, 'type', 'tel');
  }

  public setElementValue(elementRef: ElementRef, value: string): void {
    if (value) {
      this.renderer.setProperty(
        elementRef.nativeElement,
        'value',
        value
      );
    }
  }

  public setAriaLabel(element: ElementRef): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (!element.nativeElement.getAttribute('aria-label')) {
      this.resourcesService.getString('skyux_phone_field_default_label')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value: string) => {
          this.renderer.setAttribute(
            element.nativeElement,
            'aria-label',
            value
          );
        });
    }
  }

  public focusCountrySearchElement(el: Element): void {
    const input: HTMLElement = el.querySelector('textarea');
    input.focus();
  }

  public focusPhoneInput(el: Element): void {
    const input: HTMLElement = el.querySelector('.sky-phone-field-container input');
    input.focus();
  }

}
