import { ElementRef, Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Service for interacting with the DOM elements of the phone field.
 * @internal
 */
@Injectable()
export class SkyPhoneFieldAdapterService implements OnDestroy {
  #ngUnsubscribe = new Subject<void>();

  #renderer: Renderer2;
  #resourcesService: SkyLibResourcesService;

  constructor(renderer: Renderer2, resourcesService: SkyLibResourcesService) {
    this.#renderer = renderer;
    this.#resourcesService = resourcesService;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public addElementClass(elementRef: ElementRef, className: string): void {
    this.#renderer.addClass(elementRef.nativeElement, className);
  }

  public setElementDisabledState(
    elementRef: ElementRef,
    disabled: boolean
  ): void {
    this.#renderer.setProperty(elementRef.nativeElement, 'disabled', disabled);
  }

  public setElementPlaceholder(
    elementRef: ElementRef,
    placeholder: string
  ): void {
    this.#renderer.setAttribute(
      elementRef.nativeElement,
      'placeholder',
      placeholder
    );
  }

  public setElementType(elementRef: ElementRef): void {
    this.#renderer.setAttribute(elementRef.nativeElement, 'type', 'tel');
  }

  public setElementValue(elementRef: ElementRef, value: string): void {
    if (value) {
      // TODO: check to see if this is necessary after running tests
      this.#renderer.setProperty(elementRef.nativeElement, 'value', value);
    }
  }

  public setAriaLabel(element: ElementRef): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (!element.nativeElement.getAttribute('aria-label')) {
      this.#resourcesService
        .getString('skyux_phone_field_default_label')
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value: string) => {
          this.#renderer.setAttribute(
            element.nativeElement,
            'aria-label',
            value
          );
        });
    }
  }

  public focusCountrySearchElement(el: Element): void {
    const input: HTMLElement | null = el.querySelector('textarea');
    input?.focus();
  }

  public focusPhoneInput(el: Element): void {
    const input: HTMLElement | null = el.querySelector(
      '.sky-phone-field-container input'
    );
    input?.focus();
  }
}
