import { ElementRef, Injectable, OnDestroy, Renderer2 } from '@angular/core';

import { Subject } from 'rxjs';

/**
 * Service for interacting with the DOM elements of the phone field.
 * @internal
 */
@Injectable()
export class SkyPhoneFieldAdapterService implements OnDestroy {
  #ngUnsubscribe = new Subject<void>();

  #renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.#renderer = renderer;
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
    this.#renderer.setProperty(elementRef.nativeElement, 'value', value);
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
